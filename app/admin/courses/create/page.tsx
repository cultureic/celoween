'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  title: string;
  subtitle: string;
  slug: string;
  categoryId: string;
  levelId: string;
  coverUrl: string;
  promoVideoUrl: string;
  durationHours: number;
  lessonsCount: number;
  isFree: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'LOGGED_IN' | 'WALLET';
  instructorId: string;
  modules: Array<{
    title: string;
    summary: string;
    lessons: Array<{
      title: string;
      summary: string;
      contentMdx: string;
    }>;
  }>;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    slug: '',
    categoryId: '',
    levelId: '',
    coverUrl: '',
    promoVideoUrl: '',
    durationHours: 8,
    lessonsCount: 0,
    isFree: true,
    status: 'DRAFT',
    visibility: 'PUBLIC',
    instructorId: '',
    modules: [
      {
        title: '',
        summary: '',
        lessons: [
          {
            title: '',
            summary: '',
            contentMdx: '',
          },
        ],
      },
    ],
  });

  // Generate slug from title
  useEffect(() => {
    if (formData.title) {
      const baseSlug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Add timestamp suffix to make it unique
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Calculate lesson count
  useEffect(() => {
    const lessonsCount = formData.modules.reduce((total, module) => total + module.lessons.length, 0);
    setFormData(prev => ({ ...prev, lessonsCount }));
  }, [formData.modules]);

  // Fetch reference data
  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, levelsRes, instructorsRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/levels'),
        fetch('/api/admin/instructors'),
      ]);

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (levelsRes.ok) setLevels(await levelsRes.json());
      if (instructorsRes.ok) setInstructors(await instructorsRes.json());
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: '',
          summary: '',
          lessons: [
            {
              title: '',
              summary: '',
              contentMdx: '',
            },
          ],
        },
      ],
    }));
  };

  const removeModule = (moduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, index) => index !== moduleIndex),
    }));
  };

  const addLesson = (moduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  title: '',
                  summary: '',
                  contentMdx: '',
                },
              ],
            }
          : module
      ),
    }));
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.filter((_, lessonIdx) => lessonIdx !== lessonIndex),
            }
          : module
      ),
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateModuleField = (moduleIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex ? { ...module, [field]: value } : module
      ),
    }));
  };

  const updateLessonField = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lessonIdx) =>
                lessonIdx === lessonIndex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : module
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const course = await response.json();
        alert(`Course '${course.title}' created successfully! Redirecting to overview...`);
        // Force refresh and go back to overview after create
        router.refresh();
        setTimeout(() => {
          router.push('/admin/courses');
        }, 500);
      } else {
        const error = await response.json();
        console.error('Course creation failed:', error);
        alert(`Error creating course: ${error.message || 'Unknown error'}\n${error.details ? 'Details: ' + error.details : ''}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Add a new course to the academy</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                placeholder="e.g., Introduction to Celo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                placeholder="Auto-generated from title"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /academy/{formData.slug}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Subtitle *
              </label>
              <textarea
                required
                rows={3}
                value={formData.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                placeholder="Brief description of what students will learn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
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
                value={formData.levelId}
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
                Instructor
              </label>
              <select
                value={formData.instructorId}
                onChange={(e) => updateField('instructorId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              >
                <option value="">Select an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                value={formData.durationHours}
                onChange={(e) => updateField('durationHours', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => updateField('coverUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Video URL
              </label>
              <input
                type="url"
                value={formData.promoVideoUrl}
                onChange={(e) => updateField('promoVideoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => updateField('isFree', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700">Free Course</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => updateField('visibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
              >
                <option value="PUBLIC">Public</option>
                <option value="LOGGED_IN">Logged In Users</option>
                <option value="WALLET">Wallet Connected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modules and Lessons */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
            <button
              type="button"
              onClick={addModule}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          <div className="space-y-6">
            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Module {moduleIndex + 1}</h3>
                  {formData.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModuleField(moduleIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                      placeholder="e.g., Getting Started"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Summary
                    </label>
                    <input
                      type="text"
                      value={module.summary}
                      onChange={(e) => updateModuleField(moduleIndex, 'summary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                      placeholder="Brief description of the module"
                    />
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Lessons</h4>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          Lesson {lessonIndex + 1}
                        </span>
                        {module.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              updateLessonField(moduleIndex, lessonIndex, 'title', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                            placeholder="Lesson title"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={lesson.summary}
                            onChange={(e) =>
                              updateLessonField(moduleIndex, lessonIndex, 'summary', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
                            placeholder="Lesson summary"
                          />
                        </div>
                      </div>

                      <div>
                        <textarea
                          rows={8}
                          value={lesson.contentMdx}
                          onChange={(e) =>
                            updateLessonField(moduleIndex, lessonIndex, 'contentMdx', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono text-sm text-gray-900 bg-white"
                          placeholder="# Lesson Content

Write your lesson content in Markdown format.

## Example Section

You can include:
- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks

```javascript
const example = 'Hello, Celo!';
```"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use Markdown (MDX) format for rich content
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Course Summary:</strong> {formData.modules.length} modules, {formData.lessonsCount} lessons
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/courses"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}