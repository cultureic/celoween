import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, ExternalLink, Trash2 } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoursesPage() {
  let courses: any[] = [];
  
  try {
    courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        Category: true,
        Level: true,
        _count: {
          select: {
            Module: true,
            CourseEnrollment: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage all courses in the academy</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Course Image/Cover */}
              <div className="h-48 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center">
                {course.coverUrl ? (
                  <img
                    src={course.coverUrl}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="text-white text-4xl font-bold">
                    {course.title.charAt(0)}
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {course.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium shrink-0 ml-2 ${
                      course.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : course.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.subtitle}
                </p>

                {/* Course Meta */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {course.Level?.name || 'No Level'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.Category?.name || 'No Category'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{course._count.Module} modules</span>
                    <span>{course._count.CourseEnrollment} enrolled</span>
                    {course.durationHours && (
                      <span>{course.durationHours}h duration</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Link
                    href={`/admin/courses/${course.id}` as any}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  
                  <Link
                    href={`/academy/${course.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Link>
                  
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors ml-auto">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first course for the academy.
          </p>
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
}