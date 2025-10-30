'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  categoryId?: string;
  levelId?: string;
  coverUrl?: string;
  promoVideoUrl?: string;
  durationHours?: number;
  isFree: boolean;
  status: string;
  visibility: string;
  Module?: Module[];
}

interface Module {
  id: string;
  index: number;
  title: string;
  summary?: string;
  Lesson?: Lesson[];
}

interface Lesson {
  id: string;
  index: number;
  title: string;
  summary?: string;
  contentMdx?: string;
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!courseId) return;
    
    const fetchData = async () => {
      try {
        // Fetch course data
        const courseResponse = await fetch(`/api/admin/courses/${courseId}`);
        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourse(courseData);
        } else {
          console.error('Failed to fetch course');
          router.push('/admin/courses');
          return;
        }

        // Fetch categories and levels
        const [categoriesResponse, levelsResponse] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/levels'),
        ]);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        if (levelsResponse.ok) {
          const levelsData = await levelsResponse.json();
          setLevels(levelsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/admin/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, router]);

  const handleSave = async () => {
    if (!course || !courseId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert('Course updated successfully! Redirecting to overview...');
        // Force refresh and redirect to courses overview
        router.refresh();
        setTimeout(() => {
          router.push('/admin/courses');
        }, 500);
      } else {
        const error = await response.json();
        console.error('Course update failed:', error);
        alert(`Error updating course: ${error.message || 'Unknown error'}\n${error.details ? 'Details: ' + error.details : ''}`);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !courseId) return;
    
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Course deleted successfully!');
        router.push('/admin/courses');
      } else {
        const error = await response.json();
        console.error('Course deletion failed:', error);
        alert(`Error deleting course: ${error.message || 'Unknown error'}\n${error.details ? 'Details: ' + error.details : ''}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  const updateField = (field: keyof Course, value: any) => {
    setCourse(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addModule = () => {
    setCourse(prev => {
      if (!prev) return null;
      const newModule: Module = {
        id: `temp-${Date.now()}`,
        index: (prev.Module?.length || 0) + 1,
        title: '',
        summary: '',
        Lesson: [],
      };
      return {
        ...prev,
        Module: [...(prev.Module || []), newModule],
      };
    });
  };

  const removeModule = (moduleIndex: number) => {
    setCourse(prev => {
      if (!prev?.Module) return prev;
      return {
        ...prev,
        Module: prev.Module.filter((_, index) => index !== moduleIndex),
      };
    });
  };

  const updateModule = (moduleIndex: number, field: string, value: any) => {
    setCourse(prev => {
      if (!prev?.Module) return prev;
      return {
        ...prev,
        Module: prev.Module.map((module, index) =>
          index === moduleIndex ? { ...module, [field]: value } : module
        ),
      };
    });
  };

  const addLesson = (moduleIndex: number) => {
    setCourse(prev => {
      if (!prev?.Module) return prev;
      return {
        ...prev,
        Module: prev.Module.map((module, index) => {
          if (index === moduleIndex) {
            const newLesson: Lesson = {
              id: `temp-${Date.now()}`,
              index: (module.Lesson?.length || 0) + 1,
              title: '',
              summary: '',
              contentMdx: '',
            };
            return {
              ...module,
              Lesson: [...(module.Lesson || []), newLesson],
            };
          }
          return module;
        }),
      };
    });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setCourse(prev => {
      if (!prev?.Module) return prev;
      return {
        ...prev,
        Module: prev.Module.map((module, index) => {
          if (index === moduleIndex) {
            return {
              ...module,
              Lesson: module.Lesson?.filter((_, lIndex) => lIndex !== lessonIndex) || [],
            };
          }
          return module;
        }),
      };
    });
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    setCourse(prev => {
      if (!prev?.Module) return prev;
      return {
        ...prev,
        Module: prev.Module.map((module, mIndex) => {
          if (mIndex === moduleIndex) {
            return {
              ...module,
              Lesson: module.Lesson?.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              ) || [],
            };
          }
          return module;
        }),
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link
            href="/admin/courses"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/courses"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600">{course.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Basic Course Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={course.title}
              onChange={(e) => updateField('title', e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={course.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /academy/{course.slug}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Subtitle
            </label>
            <textarea
              rows={3}
              value={course.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              placeholder="Brief description of what students will learn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={course.coverUrl || ''}
              onChange={(e) => updateField('coverUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1200x675px (16:9 ratio)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Video URL
            </label>
            <input
              type="url"
              value={course.promoVideoUrl || ''}
              onChange={(e) => updateField('promoVideoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube video URL (watch or embed format)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={course.categoryId || ''}
              onChange={(e) => updateField('categoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={course.levelId || ''}
              onChange={(e) => updateField('levelId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            >
              <option value="">Select a level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Hours)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={course.durationHours || ''}
              onChange={(e) => updateField('durationHours', parseInt(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={course.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={course.isFree}
                onChange={(e) => updateField('isFree', e.target.checked)}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">This course is free</span>
            </label>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
          <button
            onClick={addModule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        </div>

        {course.Module?.map((module, moduleIndex) => (
          <div key={module.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900">
                Module {module.index}
              </h3>
              <button
                onClick={() => removeModule(moduleIndex)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  value={module.title}
                  onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Summary
                </label>
                <textarea
                  rows={2}
                  value={module.summary || ''}
                  onChange={(e) => updateModule(moduleIndex, 'summary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Lessons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-800">Lessons</h4>
                  <button
                    onClick={() => addLesson(moduleIndex)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Lesson
                  </button>
                </div>

                {module.Lesson?.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Lesson {lesson.index}
                      </span>
                      <button
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <textarea
                        placeholder="Lesson summary"
                        rows={2}
                        value={lesson.summary || ''}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'summary', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Lesson Content (MDX)
                        </label>
                        <textarea
                          placeholder="Write your lesson content in MDX format...\n\n# Lesson Title\n\nThis is a paragraph with **bold** and *italic* text.\n\n## Section\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log('Hello World');\n```"
                          rows={8}
                          value={lesson.contentMdx || ''}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'contentMdx', e.target.value)}
                          className="w-full px-2 py-1 text-xs font-mono border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          MDX supports Markdown syntax with React components. Use # for headings, ** for bold, * for italic, ``` for code blocks.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {(!course.Module || course.Module.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>No modules added yet. Click &quot;Add Module&quot; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}