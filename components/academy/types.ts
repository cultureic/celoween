export type CurriculumItemType =
  | "video"
  | "reading"
  | "lab"
  | "assignment"
  | "quiz"
  | "project"
  | "discussion";

export type CurriculumItem = {
  type: CurriculumItemType;
  title: string;                 // ES visible
  durationMin?: number;          // optional
  resourceUrl?: string;          // Actual URL for videos/resources
  resourceUrlPlaceholder?: string;   // e.g., {{VIDEO_URL_M0_S1_1}}
  downloadablePlaceholder?: string;  // e.g., {{PDF_URL_M0_S1_1}}
  content?: string;              // Direct content for readings (markdown)
  componentType?: string;        // Custom component type (e.g., "FundingGuideToggle")
  notes?: string;                // ES contextual notes
};

export type Submodule = {
  index: number;                 // 1-based
  title: string;                 // ES visible
  summary?: string;              // ES
  content?: string;              // Direct content for submodules (markdown)
  items: CurriculumItem[];
};

export type Module = {
  index: number;                 // 1-based
  title: string;                 // ES visible
  summary?: string;              // ES overview
  submodules: Submodule[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;                 // ES
  subtitle: string;              // ES
  level: "Principiante" | "Intermedio" | "Avanzado";
  category: string;              // ES
  tags: string[];                // ES
  durationHours: number;
  lessonsCount: number;          // approx. total items
  rating: number;
  ratingCount: number;
  learners: number;
  coverUrl: string;              // placeholder
  promoVideoUrl?: string;        // placeholder
  instructor: {
    name: string;                // ES
    title: string;               // ES
    avatarUrl: string;           // placeholder
    bio: string;                 // ES
  };
  priceUSD: number;
  isFree: boolean;
  prerequisites?: string[];      // ES
  outcomes?: string[];           // ES
  modules: Module[];             // NEW hierarchical curriculum
  createdAt?: string;            // ISO string used by "Newest" sorting
};

export type FilterState = {
  q: string;
  level: "Todos" | "Principiante" | "Intermedio" | "Avanzado";
  category: string | "Todos";
  sort: "Más Popular" | "Mejor Valorado" | "Más Reciente";
};