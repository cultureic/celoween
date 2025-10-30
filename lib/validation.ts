import { z } from 'zod';

/**
 * Wallet address validation regex (Ethereum address format)
 */
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

/**
 * Slug validation regex (URL-safe string)
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * CUID validation regex
 */
const CUID_REGEX = /^c[a-z0-9]+$/;

/**
 * Base validation schemas
 */
export const BaseSchemas = {
  walletAddress: z
    .string()
    .regex(WALLET_ADDRESS_REGEX, 'Invalid wallet address format')
    .transform(addr => addr.toLowerCase()),
  
  cuid: z
    .string()
    .regex(CUID_REGEX, 'Invalid CUID format'),
  
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .max(100, 'Slug too long')
    .regex(SLUG_REGEX, 'Invalid slug format - use lowercase letters, numbers, and hyphens only'),
  
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email too long'),
  
  url: z
    .string()
    .url('Invalid URL format')
    .max(2048, 'URL too long'),
  
  nonEmptyString: z
    .string()
    .min(1, 'Cannot be empty')
    .trim(),
  
  positiveInt: z
    .number()
    .int('Must be an integer')
    .positive('Must be positive'),
  
  nonNegativeInt: z
    .number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative'),
} as const;

/**
 * User-related validation schemas
 */
export const UserSchemas = {
  createUser: z.object({
    walletAddress: BaseSchemas.walletAddress,
    email: BaseSchemas.email.optional(),
    displayName: z.string().max(100, 'Display name too long').optional(),
  }),
  
  updateUser: z.object({
    email: BaseSchemas.email.optional(),
    displayName: z.string().max(100, 'Display name too long').optional(),
    privacyPolicyAccepted: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
  }),
} as const;

/**
 * Progress tracking validation schemas
 */
export const ProgressSchemas = {
  updateProgress: z.object({
    walletAddress: BaseSchemas.walletAddress,
    lessonId: BaseSchemas.cuid,
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
      errorMap: () => ({ message: 'Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED' }),
    }),
    secondsSpent: BaseSchemas.nonNegativeInt.max(86400, 'Seconds spent cannot exceed 24 hours').optional(),
  }),
  
  getProgress: z.object({
    walletAddress: BaseSchemas.walletAddress,
    courseId: BaseSchemas.cuid.optional(),
    lessonId: BaseSchemas.cuid.optional(),
  }),
} as const;

/**
 * Course-related validation schemas
 */
export const CourseSchemas = {
  createCourse: z.object({
    title: BaseSchemas.nonEmptyString.max(200, 'Title too long'),
    subtitle: z.string().max(500, 'Subtitle too long').optional(),
    slug: BaseSchemas.slug,
    categoryId: BaseSchemas.cuid.optional(),
    levelId: BaseSchemas.cuid.optional(),
    coverUrl: BaseSchemas.url.optional(),
    promoVideoUrl: BaseSchemas.url.optional(),
    durationHours: BaseSchemas.positiveInt.max(1000, 'Duration hours too large').optional(),
    isFree: z.boolean().default(true),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    visibility: z.enum(['PUBLIC', 'LOGGED_IN', 'WALLET']).default('PUBLIC'),
    instructorId: BaseSchemas.cuid.optional(),
    modules: z.array(z.object({
      title: BaseSchemas.nonEmptyString.max(200, 'Module title too long'),
      summary: z.string().max(1000, 'Module summary too long').optional(),
      lessons: z.array(z.object({
        title: BaseSchemas.nonEmptyString.max(200, 'Lesson title too long'),
        summary: z.string().max(1000, 'Lesson summary too long').optional(),
        contentMdx: z.string().max(50000, 'Lesson content too long').optional(),
      })).min(1, 'Module must have at least one lesson'),
    })).min(1, 'Course must have at least one module'),
  }),
  
  updateCourse: z.object({
    title: BaseSchemas.nonEmptyString.max(200, 'Title too long').optional(),
    subtitle: z.string().max(500, 'Subtitle too long').optional(),
    categoryId: BaseSchemas.cuid.optional(),
    levelId: BaseSchemas.cuid.optional(),
    coverUrl: BaseSchemas.url.optional(),
    promoVideoUrl: BaseSchemas.url.optional(),
    durationHours: BaseSchemas.positiveInt.max(1000, 'Duration hours too large').optional(),
    isFree: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    visibility: z.enum(['PUBLIC', 'LOGGED_IN', 'WALLET']).optional(),
  }),
  
  getCourses: z.object({
    page: BaseSchemas.positiveInt.max(1000, 'Page number too large').optional(),
    limit: BaseSchemas.positiveInt.max(100, 'Limit too large').optional(),
    categoryId: BaseSchemas.cuid.optional(),
    levelId: BaseSchemas.cuid.optional(),
    search: z.string().max(100, 'Search query too long').optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
} as const;

/**
 * Admin-related validation schemas
 */
export const AdminSchemas = {
  createCategory: z.object({
    name: BaseSchemas.nonEmptyString.max(100, 'Category name too long'),
    slug: BaseSchemas.slug,
  }),
  
  createLevel: z.object({
    name: BaseSchemas.nonEmptyString.max(100, 'Level name too long'),
    slug: BaseSchemas.slug,
  }),
  
  createInstructor: z.object({
    name: BaseSchemas.nonEmptyString.max(100, 'Instructor name too long'),
    title: z.string().max(200, 'Title too long').optional(),
    avatarUrl: BaseSchemas.url.optional(),
    bio: z.string().max(2000, 'Bio too long').optional(),
  }),
  
  updateInstructor: z.object({
    name: BaseSchemas.nonEmptyString.max(100, 'Instructor name too long').optional(),
    title: z.string().max(200, 'Title too long').optional(),
    avatarUrl: BaseSchemas.url.optional(),
    bio: z.string().max(2000, 'Bio too long').optional(),
  }),
} as const;

/**
 * Contact and subscription schemas
 */
export const ContactSchemas = {
  contactForm: z.object({
    name: BaseSchemas.nonEmptyString.max(100, 'Name too long'),
    email: BaseSchemas.email,
    subject: BaseSchemas.nonEmptyString.max(200, 'Subject too long'),
    message: BaseSchemas.nonEmptyString.max(2000, 'Message too long'),
    honeypot: z.string().max(0, 'Spam detected').optional(), // Anti-spam honeypot
  }),
  
  subscribe: z.object({
    email: BaseSchemas.email,
    source: z.string().max(50, 'Source too long').optional(),
  }),
} as const;

/**
 * File upload validation schemas
 */
export const FileSchemas = {
  imageUpload: z.object({
    file: z.any()
      .refine((file) => file instanceof File, 'Must be a file')
      .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        'File must be JPEG, PNG, or WebP'
      ),
    folder: z.enum(['courses', 'instructors', 'avatars']).default('courses'),
  }),
} as const;

/**
 * NFT and certificate schemas
 */
export const NFTSchemas = {
  createNFTConfig: z.object({
    courseId: BaseSchemas.cuid,
    standard: z.enum(['ERC721', 'ERC1155']).default('ERC721'),
    chainId: z.number().int().positive(),
    contractAddress: BaseSchemas.walletAddress,
    metadataBaseUri: BaseSchemas.url.optional(),
    autoIssueOnComplete: z.boolean().default(false),
  }),
  
  issueCertificate: z.object({
    userId: BaseSchemas.cuid,
    courseId: BaseSchemas.cuid,
    chainId: z.number().int().positive(),
    contractAddress: BaseSchemas.walletAddress,
    tokenId: z.string().min(1, 'Token ID required'),
    txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  }),
} as const;

/**
 * Audit and logging schemas
 */
export const AuditSchemas = {
  logDataAccess: z.object({
    userId: BaseSchemas.cuid,
    accessType: z.enum(['read', 'write', 'delete']),
    resourceType: z.string().max(50, 'Resource type too long'),
    resourceId: BaseSchemas.cuid.optional(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().max(500, 'User agent too long').optional(),
    details: z.record(z.any()).optional(),
  }),
} as const;

/**
 * Feature flag schemas
 */
export const FeatureFlagSchemas = {
  checkFlag: z.object({
    flagName: z.string().regex(/^[A-Z_]+$/, 'Flag name must be uppercase with underscores'),
    userId: BaseSchemas.cuid.optional(),
    context: z.record(z.any()).optional(),
  }),
} as const;

/**
 * Health check schemas
 */
export const HealthSchemas = {
  healthCheck: z.object({
    service: z.enum(['database', 'redis', 'external-api']).optional(),
  }),
} as const;

/**
 * Validation helper functions
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate data against a schema and return parsed result
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      const message = `${context ? `${context}: ` : ''}${firstError.message}`;
      
      throw new ValidationError(message, field, firstError.code);
    }
    throw error;
  }
}

/**
 * Validate data with safe parsing (returns result object)
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      const validationError = new ValidationError(
        firstError.message,
        field,
        firstError.code
      );
      return { success: false, error: validationError };
    }
    
    return {
      success: false,
      error: new ValidationError('Unknown validation error', 'unknown'),
    };
  }
}

/**
 * Create a validation middleware for API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown, context?: string): T => {
    return validateData(schema, data, context);
  };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Rate limiting validation
 */
export const RateLimitSchemas = {
  request: z.object({
    ip: z.string().ip(),
    userAgent: z.string().max(500),
    endpoint: z.string().max(100),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  }),
} as const;

/**
 * Export all schemas for convenience
 */
export const ValidationSchemas = {
  ...BaseSchemas,
  ...UserSchemas,
  ...ProgressSchemas,
  ...CourseSchemas,
  ...AdminSchemas,
  ...ContactSchemas,
  ...FileSchemas,
  ...NFTSchemas,
  ...AuditSchemas,
  ...FeatureFlagSchemas,
  ...HealthSchemas,
  ...RateLimitSchemas,
} as const;