# Input Validation Implementation

This document describes the comprehensive input validation system implemented throughout the healthcare platform to prevent injection attacks, data corruption, and ensure data integrity.

## Overview

All user inputs are validated using **Zod schemas** before being submitted to the database. This provides both client-side validation for immediate user feedback and a strong foundation for server-side validation.

## Validation Schemas

All validation schemas are centralized in `src/utils/validationSchemas.ts` for maintainability and reusability.

### Authentication Validation

- **Login**: Email format validation, password length (6-100 characters)
- **Signup**: Email format, password requirements, name validation (letters, spaces, hyphens, apostrophes only), 10-digit phone numbers, role verification

### Children Health Forms

- **Symptom Logs**: Headache/dizziness levels (0-10), mood rating (1-5), notes (max 1000 chars)
- **Caregiver Messages**: Subject (max 200 chars), message (max 2000 chars), priority validation
- **Rehabilitation Activities**: Activity name (max 100 chars), duration (1-480 mins), score (0-100), difficulty level
- **School Accommodations**: Type, description (max 1000 chars), status validation

### Appointment Management

- **Booking**: Provider UUID validation, datetime format, appointment type (video/audio/in_person), reason (10-500 chars), duration (15-120 mins)
- **Notes**: Max 2000 characters

### Health Records

- **Records**: Type validation (lab_results, imaging, etc.), title (max 200 chars), date format (YYYY-MM-DD)
- **Vital Signs**: Blood pressure (50-250/30-150), heart rate (30-250), temperature (35-43°C), oxygen saturation (50-100%)
- **File Uploads**: Size limit 10MB enforced

### Payment Processing

- **Payments**: Amount validation (positive, max ₹10,00,000), email format, 10-digit phone, description (max 500 chars)

### Community Forum

- **Posts**: Title (5-200 chars), content (10-5000 chars), category validation
- **Replies**: Content (1-2000 chars)

### Prescriptions & Insurance

- **Prescriptions**: Medication name, dosage, frequency (all validated for length and format)
- **Insurance**: Provider name, policy number (uppercase letters, numbers, hyphens), coverage amount validation

## Implementation Details

### How Validation Works

1. **Schema Definition**: Each form has a corresponding Zod schema in `validationSchemas.ts`
2. **Validation Call**: Before submitting to Supabase, use `.safeParse()` to validate
3. **Error Handling**: Display the first validation error to the user via toast notification
4. **Type Safety**: TypeScript types are automatically inferred from schemas

### Example Implementation

```typescript
import { symptomLogSchema } from '@/utils/validationSchemas';

const saveLog = async () => {
  // Validate input
  const validation = symptomLogSchema.safeParse({
    headache_level: headache,
    dizziness_level: dizziness,
    mood_rating: mood,
    memory_issues: memoryIssues,
    notes: notes.trim()
  });

  if (!validation.success) {
    const firstError = validation.error.errors[0];
    toast.error(firstError.message);
    return;
  }

  // Use validated data
  await supabase.from('symptom_logs').insert({
    headache_level: validation.data.headache_level,
    // ... rest of validated data
  });
};
```

## Components with Validation

### Completed ✅

- **Authentication** (`src/pages/Auth.tsx`)
  - Login form
  - Signup form
  
- **Children Health** (`src/components/children/`)
  - SymptomTracker.tsx
  - CaregiverHub.tsx (message validation ready)
  - RehabGames.tsx (activity validation ready)
  - SchoolPortal.tsx (accommodation validation ready)

- **Appointments** (`src/components/appointments/AppointmentManagement.tsx`)
  - Appointment booking
  - Appointment notes

- **Health Records** (`src/components/records/HealthRecordsManager.tsx`)
  - Record creation
  - File upload size validation (10MB limit)

- **Community** (`src/components/community/CommunityForum.tsx`)
  - Forum post creation
  - User authentication check

### Security Best Practices

1. **Always trim whitespace** from text inputs before validation
2. **Validate file sizes** before upload (10MB limit implemented)
3. **Use strict regex patterns** for structured data (phone numbers, policy numbers)
4. **Enforce length limits** on all text fields to prevent database issues
5. **Sanitize numeric inputs** with min/max bounds
6. **Validate enum types** for dropdowns and selections
7. **Check authentication** before allowing sensitive operations

## Next Steps

### Additional Security Measures Recommended

1. **Server-Side Validation**: Implement validation in Supabase edge functions
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **HTML Sanitization**: If displaying user-generated content as HTML, use DOMPurify
4. **SQL Injection Prevention**: Supabase client already handles this, but always use parameterized queries
5. **XSS Prevention**: React's JSX already escapes content, but be careful with dangerouslySetInnerHTML
6. **CSRF Protection**: Implement CSRF tokens for state-changing operations
7. **Content Security Policy**: Add CSP headers to prevent XSS attacks

## Testing

### How to Test Validation

1. **Empty Fields**: Try submitting empty required fields
2. **Length Limits**: Try exceeding character limits
3. **Invalid Formats**: Test with invalid emails, phone numbers, dates
4. **Boundary Values**: Test min/max values for numbers
5. **Special Characters**: Test with SQL injection attempts, HTML tags
6. **File Uploads**: Test with files over 10MB

## Error Messages

All error messages are user-friendly and provide clear guidance:

- "Please enter a valid email address"
- "Password must be at least 6 characters"
- "Phone number must be exactly 10 digits"
- "Notes must be less than 1000 characters"
- "File size must be less than 10MB"

## Maintenance

When adding new forms:

1. Define a Zod schema in `validationSchemas.ts`
2. Export the schema and its TypeScript type
3. Implement validation before database operations
4. Display validation errors to users
5. Test thoroughly with invalid inputs
6. Document the new validation rules in this file
