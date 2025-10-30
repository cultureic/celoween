import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        Category: true,
        Level: true,
        CourseInstructor: {
          include: {
            Instructor: true,
          },
        },
        _count: {
          select: {
            Module: true,
            CourseEnrollment: true,
          },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      instructorId,
      modules,
    } = body;

    // Validate required fields
    if (!title || !subtitle) {
      return NextResponse.json(
        { error: 'Title and subtitle are required', details: { title: !!title, subtitle: !!subtitle } },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the course with modules and lessons in a transaction
    const course = await prisma.$transaction(async (tx) => {
      // Create the course
      const newCourse = await tx.course.create({
        data: {
          id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title,
          subtitle,
          slug,
          categoryId: categoryId || null,
          levelId: levelId || null,
          coverUrl: coverUrl || null,
          promoVideoUrl: promoVideoUrl || null,
          durationHours,
          lessonsCount: modules?.reduce((total: number, module: any) => total + (module.lessons?.length || 0), 0) || 0,
          isFree,
          status,
          visibility,
          updatedAt: new Date(),
        },
      });

      // Link instructor if provided
      if (instructorId) {
        await tx.courseInstructor.create({
          data: {
            courseId: newCourse.id,
            instructorId,
            role: 'Lead Instructor',
          },
        });
      }

      // Create modules and lessons
      if (modules && modules.length > 0) {
        for (let i = 0; i < modules.length; i++) {
          const moduleData = modules[i];
        
        const newModule = await tx.module.create({
          data: {
            id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${i}`,
            courseId: newCourse.id,
            index: i + 1,
            title: moduleData.title || `Module ${i + 1}`,
            summary: moduleData.summary || '',
            updatedAt: new Date(),
          },
        });

        // Create lessons for this module
        for (let j = 0; j < moduleData.lessons.length; j++) {
          const lessonData = moduleData.lessons[j];
          
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
            },
          });
        }
      }
      }

      return newCourse;
    });

    // Fetch the created course with relations
    const createdCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        Category: true,
        Level: true,
        CourseInstructor: {
          include: {
            Instructor: true,
          },
        },
        Module: {
          include: {
            Lesson: true,
          },
          orderBy: { index: 'asc' },
        },
      },
    });

    return NextResponse.json(createdCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to create course', 
        details: errorMessage,
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}