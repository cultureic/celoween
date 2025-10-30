import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        Category: true,
        Level: true,
        Module: {
          include: {
            Lesson: {
              orderBy: { index: 'asc' }
            }
          },
          orderBy: { index: 'asc' }
        },
        CourseInstructor: {
          include: {
            Instructor: true
          }
        },
        _count: {
          select: {
            Module: true,
            CourseEnrollment: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      subtitle,
      slug,
      categoryId,
      levelId,
      coverUrl,
      promoVideoUrl,
      durationHours,
      isFree,
      status,
      visibility,
      Module: modules
    } = body;

    // Validate required fields
    if (!title || !subtitle) {
      return NextResponse.json(
        { error: 'Title and subtitle are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current course)
    if (slug) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug },
      });

      if (existingCourse && existingCourse.id !== id) {
        return NextResponse.json(
          { error: 'A course with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update course with modules and lessons in a transaction
    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Update the main course data
      const course = await tx.course.update({
        where: { id },
        data: {
          title,
          subtitle,
          slug,
          categoryId: categoryId || null,
          levelId: levelId || null,
          coverUrl: coverUrl || null,
          promoVideoUrl: promoVideoUrl || null,
          durationHours,
          isFree,
          status,
          visibility: visibility || 'PUBLIC',
        }
      });

      // If modules are provided, update them
      if (modules && Array.isArray(modules)) {
        // First delete lessons, then modules to avoid foreign key constraint issues
        const existingModules = await tx.module.findMany({
          where: { courseId: id },
          select: { id: true }
        });
        
        // Delete lessons first
        for (const existingModule of existingModules) {
          await tx.lesson.deleteMany({
            where: { moduleId: existingModule.id }
          });
        }
        
        // Then delete modules
        await tx.module.deleteMany({
          where: { courseId: id }
        });

        // Create new modules and lessons
        for (let i = 0; i < modules.length; i++) {
          const moduleData = modules[i];
          
          const newModule = await tx.module.create({
            data: {
              id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${i}`,
              courseId: id,
              index: i + 1,
              title: moduleData.title || `Module ${i + 1}`,
              summary: moduleData.summary || '',
              updatedAt: new Date(),
            }
          });

          // Create lessons for this module
          if (moduleData.Lesson && Array.isArray(moduleData.Lesson)) {
            for (let j = 0; j < moduleData.Lesson.length; j++) {
              const lessonData = moduleData.Lesson[j];
              
              await tx.lesson.create({
                data: {
                  id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${i}_${j}`,
                  moduleId: newModule.id,
                  index: j + 1,
                  title: lessonData.title || `Lesson ${j + 1}`,
                  summary: lessonData.summary || '',
                  contentMdx: lessonData.contentMdx || '',
                  status: 'PUBLISHED',
                  visibility: 'PUBLIC',
                  updatedAt: new Date(),
                }
              });
            }
          }
        }

        // Update lessons count
        const totalLessons = modules.reduce((total: number, module: any) => {
          return total + (module.Lesson?.length || 0);
        }, 0);

        await tx.course.update({
          where: { id },
          data: {
            lessonsCount: totalLessons
          }
        });
      }

      return course;
    });

    // Fetch the updated course with relations
    const courseWithRelations = await prisma.course.findUnique({
      where: { id },
      include: {
        Category: true,
        Level: true,
        Module: {
          include: {
            Lesson: {
              orderBy: { index: 'asc' }
            }
          },
          orderBy: { index: 'asc' }
        }
      }
    });

    return NextResponse.json(courseWithRelations);
  } catch (error) {
    console.error('Error updating course:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to update course', 
        details: errorMessage,
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete course (this will cascade to modules, lessons, etc.)
    await prisma.course.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to delete course', 
        details: errorMessage,
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}