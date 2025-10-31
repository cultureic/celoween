# State Tag Feature

## Overview
Added state/location tagging to submissions to enable filtering submissions by geographic region.

## Features

### 1. State Tags
Submissions can now be tagged with the following locations:
- **SINALOA**
- **MONTERREY**
- **CDMX**
- **COLOMBIA**

### 2. Submission Form
- Added required "State/Location Tag" field to the submission form
- Input automatically converts to uppercase
- Placeholder shows "SINALOA" as an example
- Help text guides users on valid values

### 3. API Changes

#### POST /api/submissions
- Now accepts `stateTag` parameter
- Defaults to "SINALOA" if not provided (for backward compatibility)

#### GET /api/submissions
- Added `stateTag` query parameter for filtering
- Example: `/api/submissions?contestId=xxx&stateTag=MONTERREY`

### 4. Frontend Filtering

#### Contest Submissions Page
- Filter buttons for: ALL, SINALOA, MONTERREY, CDMX, COLOMBIA
- Filters submissions in real-time
- Displays submission count for filtered results

#### Admin Submissions Page
- Two-tier filtering:
  - General filters: all, popular, recent
  - State filters: all, SINALOA, MONTERREY, CDMX, COLOMBIA
- State tag badge displayed on each submission card
- Combined filters work together

## Implementation Details

### Metadata-Based Storage
The `stateTag` is stored in the submission's `metadata` JSON field, not as a separate database column. This approach:
- ✅ Avoids database schema changes
- ✅ Preserves existing metadata
- ✅ Allows flexible tag additions
- ✅ Works seamlessly with existing submissions

The API extracts and returns `stateTag` from metadata for frontend consumption.

## Migration

### Update Existing Submissions

To add the "SINALOA" tag to all existing submissions:

```bash
npm run update:state-tags
```

This script:
1. Updates all submissions with `null` or empty `stateTag` to "SINALOA"
2. Shows a summary of all submissions with their tags
3. Displays a count of submissions per state

## Files Modified

### Backend
- `app/api/submissions/route.ts` - Stores stateTag in metadata JSON, extracts for filtering and returns with submissions

### Frontend
- `components/contest/SubmissionForm.tsx` - Added stateTag input field
- `components/contest/ContestSubmissions.tsx` - Added state filter buttons
- `app/admin/submissions/page.tsx` - Added state filters and tag display

### Scripts
- `scripts/update-state-tags.ts` - Migration script for existing data
- `package.json` - Added `update:state-tags` script

## Usage

### For Users
1. When submitting an entry, fill in the "State/Location Tag" field
2. Enter one of: SINALOA, MONTERREY, CDMX, or COLOMBIA
3. The tag will be displayed on the submission

### For Admins
1. View all submissions in the admin panel
2. Use state filter buttons to view submissions by location
3. Combine with other filters (popular/recent) for advanced filtering

### For Developers
1. Run migration to update existing submissions:
   ```bash
   npm run update:state-tags
   ```

2. The API automatically assigns "SINALOA" as default for backward compatibility

3. Add new state tags by:
   - Adding to `STATE_TAGS` array in `ContestSubmissions.tsx`
   - Adding to filter buttons in admin page
   - Updating this documentation

## Future Enhancements

Potential improvements:
- Dynamic state tag management (admin interface to add/remove tags)
- State-specific leaderboards
- Geographic visualization/map view
- Tag validation against a predefined list
- Multi-tag support (e.g., SINALOA + CULIACAN)
