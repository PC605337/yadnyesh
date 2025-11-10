import { z } from 'zod';

// ============= Authentication Schemas =============

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
});

export const signupSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  confirmPassword: z.string(),
  firstName: z.string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "First name can only contain letters, spaces, hyphens, and apostrophes" }),
  lastName: z.string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Last name can only contain letters, spaces, hyphens, and apostrophes" }),
  phone: z.string()
    .trim()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),
  role: z.enum(['patient', 'provider'], { message: "Please select a valid role" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// ============= Children Health Schemas =============

export const symptomLogSchema = z.object({
  headache_level: z.number().int().min(0).max(10),
  dizziness_level: z.number().int().min(0).max(10),
  mood_rating: z.number().int().min(1).max(5),
  memory_issues: z.boolean(),
  notes: z.string()
    .trim()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional()
    .transform(val => val || undefined)
});

export const caregiverMessageSchema = z.object({
  subject: z.string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: "Please select a valid priority" })
});

export const rehabActivitySchema = z.object({
  activity_name: z.string()
    .trim()
    .min(1, { message: "Activity name is required" })
    .max(100, { message: "Activity name must be less than 100 characters" }),
  duration_minutes: z.number()
    .int()
    .min(1, { message: "Duration must be at least 1 minute" })
    .max(480, { message: "Duration must be less than 480 minutes (8 hours)" }),
  difficulty_level: z.enum(['easy', 'medium', 'hard']),
  score: z.number()
    .int()
    .min(0, { message: "Score must be at least 0" })
    .max(100, { message: "Score must be 100 or less" })
    .optional(),
  notes: z.string()
    .trim()
    .max(500, { message: "Notes must be less than 500 characters" })
    .optional()
});

export const schoolAccommodationSchema = z.object({
  accommodation_type: z.string()
    .trim()
    .min(1, { message: "Accommodation type is required" })
    .max(100, { message: "Type must be less than 100 characters" }),
  description: z.string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  status: z.enum(['requested', 'approved', 'implemented', 'rejected'])
});

// ============= Appointment Schemas =============

export const appointmentBookingSchema = z.object({
  provider_id: z.string()
    .uuid({ message: "Please select a valid provider" }),
  appointment_date: z.string()
    .datetime({ message: "Please select a valid date and time" }),
  type: z.enum(['video', 'audio', 'in_person'], { message: "Please select a valid appointment type" }),
  reason: z.string()
    .trim()
    .min(10, { message: "Please provide at least 10 characters describing your reason" })
    .max(500, { message: "Reason must be less than 500 characters" }),
  duration_minutes: z.number()
    .int()
    .min(15, { message: "Appointment must be at least 15 minutes" })
    .max(120, { message: "Appointment cannot exceed 120 minutes" })
});

export const appointmentNotesSchema = z.object({
  notes: z.string()
    .trim()
    .max(2000, { message: "Notes must be less than 2000 characters" })
    .optional()
});

// ============= Health Records Schemas =============

export const healthRecordSchema = z.object({
  type: z.enum([
    'lab_results',
    'imaging',
    'vital_signs',
    'medication_history',
    'consultation_notes',
    'surgical_records',
    'vaccination_records',
    'allergy_information',
    'discharge_summary',
    'other'
  ], { message: "Please select a valid record type" }),
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  recorded_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date (YYYY-MM-DD)" }),
  data: z.record(z.any()).optional().default({})
});

export const vitalSignsSchema = z.object({
  blood_pressure_systolic: z.number()
    .int()
    .min(50, { message: "Systolic BP must be at least 50" })
    .max(250, { message: "Systolic BP must be less than 250" })
    .optional(),
  blood_pressure_diastolic: z.number()
    .int()
    .min(30, { message: "Diastolic BP must be at least 30" })
    .max(150, { message: "Diastolic BP must be less than 150" })
    .optional(),
  heart_rate: z.number()
    .int()
    .min(30, { message: "Heart rate must be at least 30" })
    .max(250, { message: "Heart rate must be less than 250" })
    .optional(),
  temperature: z.number()
    .min(35, { message: "Temperature must be at least 35°C" })
    .max(43, { message: "Temperature must be less than 43°C" })
    .optional(),
  oxygen_saturation: z.number()
    .int()
    .min(50, { message: "Oxygen saturation must be at least 50%" })
    .max(100, { message: "Oxygen saturation cannot exceed 100%" })
    .optional()
});

// ============= Payment Schemas =============

export const paymentSchema = z.object({
  amount: z.number()
    .positive({ message: "Amount must be greater than 0" })
    .max(1000000, { message: "Amount cannot exceed ₹10,00,000" }),
  customer_email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255),
  customer_phone: z.string()
    .trim()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" }),
  description: z.string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional()
});

// ============= Forum/Community Schemas =============

export const forumPostSchema = z.object({
  title: z.string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  content: z.string()
    .trim()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(5000, { message: "Content must be less than 5000 characters" }),
  category: z.string()
    .trim()
    .max(50, { message: "Category must be less than 50 characters" })
    .optional()
});

export const forumReplySchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: "Reply cannot be empty" })
    .max(2000, { message: "Reply must be less than 2000 characters" })
});

// ============= Prescription Schemas =============

export const prescriptionSchema = z.object({
  medication_name: z.string()
    .trim()
    .min(1, { message: "Medication name is required" })
    .max(200, { message: "Medication name must be less than 200 characters" }),
  dosage: z.string()
    .trim()
    .min(1, { message: "Dosage is required" })
    .max(100, { message: "Dosage must be less than 100 characters" }),
  frequency: z.string()
    .trim()
    .min(1, { message: "Frequency is required" })
    .max(100, { message: "Frequency must be less than 100 characters" }),
  duration: z.string()
    .trim()
    .max(100, { message: "Duration must be less than 100 characters" })
    .optional(),
  instructions: z.string()
    .trim()
    .max(1000, { message: "Instructions must be less than 1000 characters" })
    .optional()
});

// ============= Insurance Schemas =============

export const insuranceSchema = z.object({
  provider_name: z.string()
    .trim()
    .min(1, { message: "Insurance provider name is required" })
    .max(100, { message: "Provider name must be less than 100 characters" }),
  policy_number: z.string()
    .trim()
    .min(1, { message: "Policy number is required" })
    .max(50, { message: "Policy number must be less than 50 characters" })
    .regex(/^[A-Z0-9-]+$/, { message: "Policy number can only contain uppercase letters, numbers, and hyphens" }),
  coverage_amount: z.number()
    .positive({ message: "Coverage amount must be greater than 0" })
    .max(100000000, { message: "Coverage amount cannot exceed ₹10,00,00,000" }),
  expiry_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date (YYYY-MM-DD)" })
});

export const insuranceClaimSchema = z.object({
  insurance_provider: z.string().min(1, { message: 'Insurance provider is required' }),
  policy_number: z.string().min(3, { message: 'Policy number is required' }).max(50),
  claim_amount: z.number().positive({ message: 'Claim amount must be positive' }).max(10000000),
  appointment_id: z.string().optional(),
  description: z.string().min(10, { message: 'Please provide claim details (min 10 characters)' }).max(1000),
  service_date: z.string().min(1, { message: 'Service date is required' }),
  diagnosis: z.string().min(3, { message: 'Diagnosis is required' }).max(500)
});

// ============= Lab Order Schemas =============

export const labOrderSchema = z.object({
  test_types: z.array(z.string()).min(1, { message: 'Select at least one test' }),
  lab_partner: z.string().min(1, { message: 'Lab partner is required' }),
  preferred_date: z.string().min(1, { message: 'Preferred date is required' }),
  preferred_time: z.string().min(1, { message: 'Preferred time is required' }),
  sample_type: z.enum(['home_collection', 'lab_visit']),
  address: z.string().min(10, { message: 'Full address required for home collection' }).max(500).optional(),
  special_instructions: z.string().max(500).optional()
});

// ============= Pharmacy Order Schemas =============

export const pharmacyOrderSchema = z.object({
  medications: z.array(z.object({
    name: z.string().min(1),
    dosage: z.string().min(1),
    quantity: z.number().int().positive().max(100)
  })).min(1, { message: 'Add at least one medication' }),
  pharmacy_partner: z.string().min(1, { message: 'Select a pharmacy' }),
  delivery_address: z.object({
    street: z.string().min(5, { message: 'Street address is required' }),
    city: z.string().min(2, { message: 'City is required' }),
    state: z.string().min(2, { message: 'State is required' }),
    pincode: z.string().regex(/^\d{6}$/, { message: 'Invalid pincode' })
  }),
  prescription_id: z.string().optional(),
  delivery_instructions: z.string().max(300).optional()
});

// ============= Type Exports =============

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SymptomLogInput = z.infer<typeof symptomLogSchema>;
export type CaregiverMessageInput = z.infer<typeof caregiverMessageSchema>;
export type RehabActivityInput = z.infer<typeof rehabActivitySchema>;
export type SchoolAccommodationInput = z.infer<typeof schoolAccommodationSchema>;
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;
export type HealthRecordInput = z.infer<typeof healthRecordSchema>;
export type VitalSignsInput = z.infer<typeof vitalSignsSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ForumPostInput = z.infer<typeof forumPostSchema>;
export type ForumReplyInput = z.infer<typeof forumReplySchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type InsuranceInput = z.infer<typeof insuranceSchema>;
export type InsuranceClaimInput = z.infer<typeof insuranceClaimSchema>;
export type LabOrderInput = z.infer<typeof labOrderSchema>;
export type PharmacyOrderInput = z.infer<typeof pharmacyOrderSchema>;
