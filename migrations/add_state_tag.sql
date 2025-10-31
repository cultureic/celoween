-- Add stateTag column to Submission table
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "stateTag" TEXT;

-- Update all existing submissions with SINALOA tag
UPDATE "Submission" SET "stateTag" = 'SINALOA' WHERE "stateTag" IS NULL;

-- Create index for faster filtering by state
CREATE INDEX IF NOT EXISTS "Submission_stateTag_idx" ON "Submission"("stateTag");
