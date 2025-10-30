import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ProgressSchemas, validateData, ValidationError, sanitizeObject } from '@/lib/validation';

/**
 * Log progress tracking events for audit
 */
function logProgressEvent(event: string, data: any, userId?: string) {
  const timestamp = new Date().toISOString();
  console.log(`[PROGRESS] ${timestamp} - ${event}`, {
    userId,
    ...sanitizeObject(data),
  });
}

/**
 * Update user lesson progress with comprehensive validation and error handling
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  let userId: string | undefined;
  
  try {
    // Parse and validate request body
    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { 
          error: 'INVALID_JSON', 
          message: 'Request body must be valid JSON' 
        },
        { status: 400 }
      );
    }

    // Validate input with comprehensive schema
    const validatedData = validateData(
      ProgressSchemas.updateProgress,
      rawBody,
      'Progress update'
    );

    const { walletAddress, lessonId, status, secondsSpent = 0 } = validatedData;

    // Ensure lesson exists before proceeding
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true, moduleId: true }
    });

    if (!lesson) {
      logProgressEvent('LESSON_NOT_FOUND', { lessonId, walletAddress });
      return NextResponse.json(
        { 
          error: 'LESSON_NOT_FOUND', 
          message: 'The specified lesson does not exist' 
        },
        { status: 404 }
      );
    }

    // Find or create user by wallet address
    let user = await prisma.user.findUnique({ 
      where: { walletAddress },
      select: { id: true, walletAddress: true }
    });
    
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          walletAddress,
          updatedAt: new Date(),
        },
        select: { id: true, walletAddress: true }
      });
      logProgressEvent('USER_CREATED', { userId: user.id, walletAddress });
    }

    userId = user.id;

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.userLessonProgress.findUnique({
        where: {
          userId_lessonId: { userId: user.id, lessonId }
        }
      });

      if (!existing) {
        // Create new progress entry
        const newProgress = await tx.userLessonProgress.create({
          data: {
            id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            lessonId,
            status: status || 'IN_PROGRESS',
            secondsSpent,
            lastVisitedAt: new Date(),
            completedAt: status === 'COMPLETED' ? new Date() : null,
          },
          select: {
            id: true,
            status: true,
            secondsSpent: true,
            completedAt: true,
            lastVisitedAt: true,
          }
        });

        logProgressEvent('PROGRESS_CREATED', {
          progressId: newProgress.id,
          userId: user.id,
          lessonId,
          status: newProgress.status,
          secondsSpent: newProgress.secondsSpent,
        });

        return newProgress;
      } else {
        // Update existing progress
        const updatedProgress = await tx.userLessonProgress.update({
          where: { id: existing.id },
          data: {
            status: status || existing.status,
            secondsSpent: (existing.secondsSpent || 0) + secondsSpent,
            lastVisitedAt: new Date(),
            completedAt: status === 'COMPLETED' 
              ? (existing.completedAt || new Date())
              : status === 'NOT_STARTED' 
                ? null 
                : existing.completedAt,
          },
          select: {
            id: true,
            status: true,
            secondsSpent: true,
            completedAt: true,
            lastVisitedAt: true,
          }
        });

        logProgressEvent('PROGRESS_UPDATED', {
          progressId: updatedProgress.id,
          userId: user.id,
          lessonId,
          oldStatus: existing.status,
          newStatus: updatedProgress.status,
          addedTime: secondsSpent,
          totalTime: updatedProgress.secondsSpent,
        });

        return updatedProgress;
      }
    });

    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: {
        progress: result,
        lesson: {
          id: lesson.id,
          title: lesson.title,
        },
      },
      meta: {
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      logProgressEvent('VALIDATION_ERROR', {
        field: error.field,
        message: error.message,
        code: error.code,
        userId,
      });
      
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field,
          code: error.code,
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code === 'P2002') {
      logProgressEvent('UNIQUE_CONSTRAINT_ERROR', { error: error.message, userId });
      return NextResponse.json(
        {
          error: 'CONFLICT',
          message: 'A conflict occurred while updating progress',
        },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      logProgressEvent('RECORD_NOT_FOUND', { error: error.message, userId });
      return NextResponse.json(
        {
          error: 'NOT_FOUND',
          message: 'Required record not found',
        },
        { status: 404 }
      );
    }

    // Log unexpected errors
    logProgressEvent('UNEXPECTED_ERROR', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      userId,
      responseTime: `${responseTime}ms`,
    });

    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while updating progress',
        ...(process.env.NODE_ENV === 'development' && { 
          debug: {
            message: error.message,
            stack: error.stack,
          }
        }),
      },
      { status: 500 }
    );
  }
}

/**
 * Get user progress with optional filtering
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    // Validate query parameters
    const validatedParams = validateData(
      ProgressSchemas.getProgress,
      { walletAddress, courseId, lessonId },
      'Progress query'
    );

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: validatedParams.walletAddress },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Build query conditions
    const where: any = { userId: user.id };
    if (validatedParams.lessonId) {
      where.lessonId = validatedParams.lessonId;
    }

    // If courseId is specified, get lessons for that course
    if (validatedParams.courseId) {
      const courseLessons = await prisma.lesson.findMany({
        where: {
          Module: {
            courseId: validatedParams.courseId
          }
        },
        select: { id: true }
      });
      
      where.lessonId = { in: courseLessons.map(l => l.id) };
    }

    // Get progress records
    const progress = await prisma.userLessonProgress.findMany({
      where,
      include: {
        Lesson: {
          select: {
            id: true,
            title: true,
            index: true,
            Module: {
              select: {
                id: true,
                title: true,
                index: true,
                Course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { Lesson: { Module: { index: 'asc' } } },
        { Lesson: { index: 'asc' } }
      ],
    });

    logProgressEvent('PROGRESS_RETRIEVED', {
      userId: user.id,
      recordCount: progress.length,
      courseId: validatedParams.courseId,
      lessonId: validatedParams.lessonId,
    });

    return NextResponse.json({
      success: true,
      data: progress,
      meta: {
        count: progress.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field,
        },
        { status: 400 }
      );
    }

    console.error('Progress retrieval error:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve progress',
      },
      { status: 500 }
    );
  }
}

