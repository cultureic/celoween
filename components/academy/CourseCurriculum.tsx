"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  PlayCircle, 
  FileText, 
  FlaskConical, 
  ClipboardCheck, 
  HelpCircle, 
  FolderGit2, 
  MessageSquare,
  Clock,
  Download,
  ExternalLink,
  Play
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ModuleProgress from "./ModuleProgress";
import { Course, CurriculumItemType, Module, Submodule, CurriculumItem } from "./types";
import { ModuleCompletionProvider } from "@/lib/contexts/ModuleCompletionContext";
import { getYouTubeVideoId, getYouTubeThumbnail } from "@/lib/youtube";

interface CourseCurriculumProps {
  course: Course;
  isEnrolled?: boolean;
}


export function CourseCurriculum({ course, isEnrolled = false }: CourseCurriculumProps) {
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<CurriculumItem | null>(null);
  
  // Simple function to convert markdown links to clickable HTML
  const makeLinksClickable = (text: string) => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-celo-yellow hover:text-celo-yellow/80 underline font-medium">$1</a>');
  };

  // Function to handle video click
  const handleVideoClick = (item: CurriculumItem, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click handler
    setSelectedVideo(item);
    setShowVideoModal(true);
  };

  // Function to check if item has a video URL
  const hasVideoUrl = (item: CurriculumItem) => {
    return item.type === "video" && (item.resourceUrl || item.resourceUrlPlaceholder);
  };

  // Function to get video thumbnail
  const getVideoThumbnail = (item: CurriculumItem) => {
    if (item.type === "video" && item.resourceUrl) {
      const videoId = getYouTubeVideoId(item.resourceUrl);
      if (videoId) {
        return getYouTubeThumbnail(videoId);
      }
    }
    return null;
  };
  const getItemIcon = (type: CurriculumItemType) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "lab":
        return <FlaskConical className="w-4 h-4" />;
      case "assignment":
        return <ClipboardCheck className="w-4 h-4" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      case "project":
        return <FolderGit2 className="w-4 h-4" />;
      case "discussion":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getItemColor = (type: CurriculumItemType) => {
    switch (type) {
      case "video":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "reading":
        return "text-green-600 bg-green-50 border-green-200";
      case "lab":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "assignment":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "quiz":
        return "text-pink-600 bg-pink-50 border-pink-200";
      case "project":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "discussion":
        return "text-teal-600 bg-teal-50 border-teal-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: CurriculumItemType) => {
    switch (type) {
      case "video":
        return "Video";
      case "reading":
        return "Lectura";
      case "lab":
        return "Laboratorio";
      case "assignment":
        return "Tarea";
      case "quiz":
        return "Cuestionario";
      case "project":
        return "Proyecto";
      case "discussion":
        return "Discusión";
      default:
        return type;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const totalItems = course.modules.reduce((acc: number, module: Module) => 
    acc + module.submodules.reduce((subAcc: number, submodule: Submodule) => subAcc + submodule.items.length, 0), 0
  );
  
  const totalDuration = course.modules.reduce((acc: number, module: Module) => 
    acc + module.submodules.reduce((subAcc: number, submodule: Submodule) => 
      subAcc + submodule.items.reduce((itemAcc: number, item: CurriculumItem) => itemAcc + (item.durationMin || 0), 0), 0
    ), 0
  );

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Temario del Curso</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{course.modules.length} módulos</span>
          <span>•</span>
          <span>{totalItems} elementos</span>
          {totalDuration > 0 && (
            <>
              <span>•</span>
              <span>{formatDuration(totalDuration)} total</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Tipos de contenido</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {(["video", "reading", "lab", "assignment", "quiz", "project", "discussion"] as CurriculumItemType[]).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${getItemColor(type)}`}>
                {getItemIcon(type)}
              </div>
              <span>{getTypeLabel(type)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {course.modules.map((module: Module) => (
          <AccordionItem key={module.index} value={`module-${module.index}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                  {module.index}
                </div>
                <div>
                  <div className="font-semibold">Módulo {module.index}: {module.title}</div>
                  {module.summary && (
                    <div className="text-sm text-muted-foreground font-normal">
                      {module.summary}
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <div className="px-4 pb-2">
              <ModuleCompletionProvider 
                courseSlug={course.slug} 
                courseId={course.id} 
                moduleIndex={module.index - 1}
              >
                <ModuleProgress courseSlug={course.slug} courseId={course.id} moduleIndex={module.index - 1} />
              </ModuleCompletionProvider>
            </div>
            <AccordionContent className="pb-4">
              {/* Submodules Accordion */}
              <Accordion type="single" collapsible className="w-full space-y-2">
                {module.submodules.map((submodule: Submodule) => (
                  <AccordionItem key={submodule.index} value={`submodule-${module.index}-${submodule.index}`} className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                          {submodule.index}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{submodule.title}</div>
                          {submodule.summary && (
                            <div className="text-xs text-muted-foreground font-normal">
                              {submodule.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      {/* Locked message for non-enrolled users */}
                      {!isEnrolled ? (
                        <div className="p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted">
                          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-lg mb-2">Contenido Bloqueado</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Inscríbete en el curso para acceder a este contenido
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {submodule.items.length} elementos disponibles después de inscribirse
                          </Badge>
                        </div>
                      ) : (
                        <>
                      {/* Direct content display for submodules */}
                      {submodule.content && (
                        <div className="mb-6 p-6 bg-muted/20 rounded-lg border border-muted">
                                          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-900 dark:text-slate-100">
                            <div className="space-y-4 text-sm leading-relaxed">
                              {submodule.content.split('\n').map((line, index) => {
                                // Handle headers
                                if (line.startsWith('## ')) {
                                  return (
                                    <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-8 mb-4 border-b-2 border-celo-yellow pb-3">
                                      {line.replace('## ', '')}
                                    </h2>
                                  );
                                }
                                // Handle bold text lines (complete lines in bold)
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return (
                                            <div key={index} className="font-bold text-slate-900 dark:text-slate-50 text-base mb-2" dangerouslySetInnerHTML={{ __html: makeLinksClickable(line.replace(/\*\*/g, '')) }} />
                                  );
                                }
                                // Handle paragraphs with bold text inline
                                if (line.includes('**') && !line.startsWith('-')) {
                                  const parts = line.split(/(\*\*.*?\*\*)/g);
                                  return (
                                    <p key={index} className="text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                                      {parts.map((part, partIndex) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          return (
                                            <span key={partIndex} className="font-bold text-slate-900 dark:text-slate-50" dangerouslySetInnerHTML={{ __html: makeLinksClickable(part.replace(/\*\*/g, '')) }} />
                                          );
                                        }
                                        return <span key={partIndex} dangerouslySetInnerHTML={{ __html: makeLinksClickable(part) }} />;
                                      })}
                                    </p>
                                  );
                                }
                                // Handle list items
                                if (line.startsWith('- **')) {
                                  const text = line.replace('- **', '').replace('**', '');
                                  const parts = text.split(':');
                                  const title = parts[0];
                                  const description = parts.slice(1).join(':').trim();
                                  return (
                                            <div key={index} className="flex items-start gap-3 ml-6 mb-2">
                                              <span className="text-celo-yellow mt-1 text-lg">•</span>
                                              <div>
                                                <span className="font-bold text-slate-900 dark:text-slate-50 text-base" dangerouslySetInnerHTML={{ __html: makeLinksClickable(title + ':') }}></span>
                                                <span className="text-slate-800 dark:text-slate-200 ml-1" dangerouslySetInnerHTML={{ __html: makeLinksClickable(description) }}></span>
                                              </div>
                                            </div>
                                  );
                                }
                                // Handle regular list items (without bold)
                                if (line.startsWith('- ')) {
                                  return (
                                            <div key={index} className="flex items-start gap-3 ml-6 mb-2">
                                              <span className="text-celo-yellow mt-1">•</span>
                                              <span className="text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: makeLinksClickable(line.replace('- ', '')) }}></span>
                                            </div>
                                  );
                                }
                                // Handle regular paragraphs
                                if (line.trim() && !line.startsWith('##') && !line.startsWith('-')) {
                                  return (
                                            <p key={index} className="text-slate-800 dark:text-slate-200 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: makeLinksClickable(line) }}></p>
                                  );
                                }
                                // Handle empty lines
                                if (!line.trim()) {
                                  return <div key={index} className="h-3"></div>;
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Button for submodules with content */}
                      {submodule.content && (
                        <div className="mb-4 flex justify-center">
                          <Button 
                            asChild
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
                          >
                            <a 
                              href="https://docs.gap.karmahq.xyz/how-to-guides/integrations/celo-proof-of-ship" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Ver documentación oficial en Karma GAP
                            </a>
                          </Button>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {submodule.items.map((item: CurriculumItem, itemIndex: number) => {
                          const itemId = `item-${module.index}-${submodule.index}-${itemIndex}`;
                          const isExpanded = expandedContent === itemId;
                          
                          return (
                            <div key={itemIndex} className="space-y-2">
                              <div
                                className={`flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors ${item.content ? 'cursor-pointer' : ''}`}
                                onClick={item.content ? () => setExpandedContent(isExpanded ? null : itemId) : undefined}
                              >
                                {/* Video thumbnail or icon */}
                                {hasVideoUrl(item) ? (
                                  <div 
                                    className="relative w-20 h-12 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                                    onClick={(e) => handleVideoClick(item, e)}
                                    title="Ver video"
                                  >
                                    {getVideoThumbnail(item) ? (
                                      <>
                                        <img 
                                          src={getVideoThumbnail(item)!} 
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                          <Play className="w-6 h-6 text-white" />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                          <Play className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                                      </>
                                    )}
                                  </div>
                                ) : !item.content ? (
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${getItemColor(item.type)}`}>
                                    {getItemIcon(item.type)}
                                  </div>
                                ) : null}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{item.title}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {!item.content && (
                                      <Badge variant="outline" className="text-xs">
                                        {getTypeLabel(item.type)}
                                      </Badge>
                                    )}
                                    {item.durationMin && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(item.durationMin)}
                                      </div>
                                    )}
                                    {item.notes && (
                                      <div className="text-xs text-muted-foreground">
                                        {item.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Resource buttons */}
                                <div className="flex items-center gap-1">
                                  {item.resourceUrlPlaceholder && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-muted-foreground"
                                      disabled
                                      title="Video pendiente"
                                    >
                                      {item.type === "video" ? (
                                        <PlayCircle className="w-3 h-3" />
                                      ) : (
                                        <ExternalLink className="w-3 h-3" />
                                      )}
                                    </Button>
                                  )}
                                  {item.downloadablePlaceholder && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-muted-foreground"
                                      disabled
                                      title="Descarga pendiente"
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  )}
                                  {!item.content && !item.resourceUrlPlaceholder && !item.downloadablePlaceholder && (
                                    <Badge variant="secondary" className="text-xs">
                                      pendiente
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {/* Content display */}
                              {item.content && isExpanded && (
                                <div className="ml-0 p-6 bg-muted/20 rounded-lg border border-muted">
                                  <div className="prose prose-sm max-w-none dark:prose-invert text-slate-900 dark:text-slate-100">
                                    <div className="space-y-4 text-sm leading-relaxed">
                                      {item.content.split('\n').map((line, index) => {
                                        // Handle headers
                                        if (line.startsWith('## ')) {
                                          return (
                                            <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-8 mb-4 border-b-2 border-celo-yellow pb-3">
                                              {line.replace('## ', '')}
                                            </h2>
                                          );
                                        }
                                        // Handle bold text lines (complete lines in bold)
                                        if (line.startsWith('**') && line.endsWith('**')) {
                                          return (
                                            <div key={index} className="font-bold text-slate-900 dark:text-slate-50 text-base mb-2">
                                              {line.replace(/\*\*/g, '')}
                                            </div>
                                          );
                                        }
                                        // Handle paragraphs with bold text inline
                                        if (line.includes('**') && !line.startsWith('-')) {
                                          const parts = line.split(/(\*\*.*?\*\*)/g);
                                          return (
                                            <p key={index} className="text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                                              {parts.map((part, partIndex) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                  return (
                                                    <span key={partIndex} className="font-bold text-slate-900 dark:text-slate-50">
                                                      {part.replace(/\*\*/g, '')}
                                                    </span>
                                                  );
                                                }
                                                return part;
                                              })}
                                            </p>
                                          );
                                        }
                                        // Handle list items
                                        if (line.startsWith('- **')) {
                                          const text = line.replace('- **', '').replace('**', '');
                                          const parts = text.split(':');
                                          const title = parts[0];
                                          const description = parts.slice(1).join(':').trim();
                                          return (
                                            <div key={index} className="flex items-start gap-3 ml-6 mb-2">
                                              <span className="text-celo-yellow mt-1 text-lg">•</span>
                                              <div>
                                                <span className="font-bold text-slate-900 dark:text-slate-50 text-base">{title}:</span>
                                                <span className="text-slate-800 dark:text-slate-200 ml-1">{description}</span>
                                              </div>
                                            </div>
                                          );
                                        }
                                        // Handle regular list items (without bold)
                                        if (line.startsWith('- ')) {
                                          return (
                                            <div key={index} className="flex items-start gap-3 ml-6 mb-2">
                                              <span className="text-celo-yellow mt-1">•</span>
                                              <span className="text-slate-800 dark:text-slate-200">{line.replace('- ', '')}</span>
                                            </div>
                                          );
                                        }
                                        // Handle regular paragraphs
                                        if (line.trim() && !line.startsWith('##') && !line.startsWith('-')) {
                                          return (
                                            <p key={index} className="text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                                              {line}
                                            </p>
                                          );
                                        }
                                        // Handle empty lines
                                        if (!line.trim()) {
                                          return <div key={index} className="h-3"></div>;
                                        }
                                        return null;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              ✕
            </Button>
            {selectedVideo.resourceUrl ? (
              (() => {
                const videoId = getYouTubeVideoId(selectedVideo.resourceUrl);
                if (videoId) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return null;
              })()
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                  <p className="text-lg mb-2">¡Video disponible próximamente!</p>
                  <p className="text-sm opacity-75">
                    {selectedVideo.durationMin && `Duración: ${formatDuration(selectedVideo.durationMin)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
