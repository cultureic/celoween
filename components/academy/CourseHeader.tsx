"use client";

import Link from "next/link";
import { Star, Users, Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/components/academy/types";

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const formatLearners = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante": return "bg-green-100 text-green-800 border-green-200";
      case "Intermedio": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Avanzado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/academy" className="hover:text-foreground transition-colors">
          Academia
        </Link>
        <span className="mx-2">›</span>
        <Link 
          href={`/academy?category=${encodeURIComponent(course.category)}`} 
          className="hover:text-foreground transition-colors"
        >
          {course.category}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground font-medium">{course.title}</span>
      </nav>

      {/* Main header content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Badge className={`text-sm font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {course.category}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
                {course.subtitle}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 shrink-0"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>

        {/* Course stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
            </div>
            <span className="text-muted-foreground">({course.ratingCount} calificaciones)</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{formatLearners(course.learners)} estudiantes</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{course.durationHours} horas</span>
          </div>

          <div className="text-muted-foreground">
            {course.lessonsCount} lecciones
          </div>
        </div>

        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
