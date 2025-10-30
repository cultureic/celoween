"use client";
import { Progress } from "@/components/ui/progress"; // shadcn

export default function CourseProgress({ courseSlug, totalModules }:{ courseSlug:string; totalModules:number }) {
  // Simplified version without NFT connections
  const percent = 0; // Default to 0% progress
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progreso del curso</span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
