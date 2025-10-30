"use client";

import { Course } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Users, Clock, Play } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  href: string;
}

export function CourseCardSimple({ course, href }: CourseCardProps) {
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  };

  const formatLearners = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Link href={href as any} className="block h-full">
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{course.title}</span>
          </div>
          {course.promoVideoUrl && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="w-6 h-6 text-gray-900 ml-0.5" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Badge className={`text-xs font-medium ${getLevelColor(course.level)} text-black dark:text-yellow-300`}>
                {course.level}
              </Badge>
              <Badge variant="outline" className="text-xs text-black dark:text-yellow-300">
                {course.category}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1 theme-yellow-dark:text-black">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 theme-yellow-dark:text-black/80">
                {course.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{course.rating}</span>
                <span>({course.ratingCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatLearners(course.learners)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.durationHours)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                {course.isFree ? (
                  <span className="text-black dark:text-yellow-300">Free</span>
                ) : (
                  <span className="text-black dark:text-foreground">${course.priceUSD}</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {course.lessonsCount} lessons
              </div>
            </div>
            <Button className="w-full">
              View Course
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

