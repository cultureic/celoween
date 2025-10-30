"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Play, ArrowRight, Award, GraduationCap } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle?: string;
    level: string;
    category: string;
    learners: number;
    rating: number;
    ratingCount: number;
    durationHours: number;
    lessonsCount: number;
    isFree: boolean;
    priceUSD: number;
    coverUrl?: string;
    promoVideoUrl?: string;
  };
  href: string;
}

export function CourseCard({ course, href }: CourseCardProps) {
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

  const badgeBase = "bg-transparent text-celo-fg border border-celo-border rounded-full px-2.5 py-0.5 text-xs inline-flex items-center gap-1";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -2 }}
      className="h-full"
      aria-labelledby={`course-${course.id}`}
    >
      <Link href={href as any} className="block h-full focus:outline-none focus:ring-2 focus:ring-celo-yellow/70 focus:ring-offset-2 focus:ring-offset-white" aria-labelledby={`course-${course.id}`}>
        <div className="relative h-full rounded-xl3 border border-celo-border bg-white/40 dark:bg-white/5 backdrop-blur-xl overflow-hidden p-6 transition-all duration-300 hover:shadow-md cursor-pointer before:pointer-events-none before:absolute before:inset-0 before:rounded-xl3 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-60 dark:before:from-white/10 dark:before:opacity-40 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl3 after:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.18),rgba(255,255,255,0)_60%)] after:opacity-70 dark:after:opacity-30">
          {/* Course Image */}
          <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
            {course.coverUrl ? (
              <Image
                src={course.coverUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-200 hover:scale-[1.03] [mask-image:linear-gradient(to_bottom,black_85%,transparent)]"
                onError={(e) => {
                  // Hide the image if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(247,255,88,0.15),transparent_60%)] bg-gray-100 flex items-center justify-center">
                <Play className="w-12 h-12 text-celo-yellow" />
              </div>
            )}
            {course.promoVideoUrl && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-celo-yellow rounded-full p-3">
                  <Play className="w-6 h-6 text-black ml-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Course Content */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={badgeBase}>
                <GraduationCap className="w-3.5 h-3.5 text-celo-yellow" />
                {course.level}
              </span>
              <span className={badgeBase}>
                <Award className="w-3.5 h-3.5 text-celo-yellow" />
                {course.category}
              </span>
            </div>

            {/* Title and Subtitle */}
            <div>
              <h3 
                id={`course-${course.id}`}
                className="font-display text-xl leading-tight mb-2 text-celo-fg"
              >
                {course.title}
              </h3>
              {course.subtitle && (
                <p className="text-celo-muted text-sm leading-relaxed overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {course.subtitle}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-celo-muted">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-celo-yellow text-celo-yellow" />
                <span className="font-medium text-celo-fg">{course.rating}</span>
                <span>({course.ratingCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatLearners(course.learners)} alumnos</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.durationHours)}</span>
              </div>
            </div>

            {/* Price and Lessons */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold">
                {course.isFree ? (
                  <span className="text-celo-yellow">Gratis</span>
                ) : (
                  <span className="text-celo-fg">${course.priceUSD}</span>
                )}
              </div>
              <div className="text-sm text-celo-muted">
                {course.lessonsCount} lecciones
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full bg-celo-yellow text-black font-medium py-2.5 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-celo-yellow/70 focus:ring-offset-2 focus:ring-offset-white relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(245,240,230,0.9),rgba(245,240,230,0)_60%)] before:opacity-0 before:scale-0 before:transition-transform before:duration-500 before:ease-out hover:before:opacity-100 hover:before:scale-125 before:-z-10"
            >
              Ver curso
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
