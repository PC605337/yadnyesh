export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_triage_sessions: {
        Row: {
          ai_response: Json
          confidence_score: number | null
          created_at: string
          follow_up_recommendations: Json | null
          id: string
          input_data: Json
          language_used: string | null
          patient_id: string | null
          provider_id: string | null
          provider_notes: string | null
          provider_review_required: boolean | null
          recommended_specialty: string | null
          session_type: string | null
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          ai_response?: Json
          confidence_score?: number | null
          created_at?: string
          follow_up_recommendations?: Json | null
          id?: string
          input_data?: Json
          language_used?: string | null
          patient_id?: string | null
          provider_id?: string | null
          provider_notes?: string | null
          provider_review_required?: boolean | null
          recommended_specialty?: string | null
          session_type?: string | null
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          ai_response?: Json
          confidence_score?: number | null
          created_at?: string
          follow_up_recommendations?: Json | null
          id?: string
          input_data?: Json
          language_used?: string | null
          patient_id?: string | null
          provider_id?: string | null
          provider_notes?: string | null
          provider_review_required?: boolean | null
          recommended_specialty?: string | null
          session_type?: string | null
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          duration_minutes: number | null
          fee_amount: number | null
          id: string
          meeting_link: string | null
          notes: string | null
          patient_id: string
          prescription_id: string | null
          provider_id: string
          reason: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          duration_minutes?: number | null
          fee_amount?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          patient_id: string
          prescription_id?: string | null
          provider_id: string
          reason?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          duration_minutes?: number | null
          fee_amount?: number | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          patient_id?: string
          prescription_id?: string | null
          provider_id?: string
          reason?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_forums: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_moderated: boolean | null
          language: string | null
          member_count: number | null
          moderator_id: string | null
          name: string
          post_count: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_moderated?: boolean | null
          language?: string | null
          member_count?: number | null
          moderator_id?: string | null
          name: string
          post_count?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_moderated?: boolean | null
          language?: string | null
          member_count?: number | null
          moderator_id?: string | null
          name?: string
          post_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cost_predictions: {
        Row: {
          condition_or_service: string
          confidence_level: number | null
          cost_breakdown: Json | null
          created_at: string
          factors_considered: Json | null
          id: string
          insurance_coverage: number | null
          out_of_pocket_cost: number
          patient_id: string
          predicted_cost: number
          prediction_type: string | null
          recommendations: Json | null
          timeline_months: number | null
          updated_at: string
        }
        Insert: {
          condition_or_service: string
          confidence_level?: number | null
          cost_breakdown?: Json | null
          created_at?: string
          factors_considered?: Json | null
          id?: string
          insurance_coverage?: number | null
          out_of_pocket_cost: number
          patient_id: string
          predicted_cost: number
          prediction_type?: string | null
          recommendations?: Json | null
          timeline_months?: number | null
          updated_at?: string
        }
        Update: {
          condition_or_service?: string
          confidence_level?: number | null
          cost_breakdown?: Json | null
          created_at?: string
          factors_considered?: Json | null
          id?: string
          insurance_coverage?: number | null
          out_of_pocket_cost?: number
          patient_id?: string
          predicted_cost?: number
          prediction_type?: string | null
          recommendations?: Json | null
          timeline_months?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      digital_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          daily_limit: number | null
          id: string
          kyc_documents: Json | null
          kyc_status: string
          monthly_limit: number | null
          updated_at: string
          user_id: string
          wallet_status: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          daily_limit?: number | null
          id?: string
          kyc_documents?: Json | null
          kyc_status?: string
          monthly_limit?: number | null
          updated_at?: string
          user_id: string
          wallet_status?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          daily_limit?: number | null
          id?: string
          kyc_documents?: Json | null
          kyc_status?: string
          monthly_limit?: number | null
          updated_at?: string
          user_id?: string
          wallet_status?: string
        }
        Relationships: []
      }
      fertility_records: {
        Row: {
          basal_body_temperature: Json | null
          consultation_notes: Json | null
          cost_estimates: Json | null
          created_at: string
          fertility_medications: Json | null
          fertility_status: string | null
          fertility_tests: Json | null
          id: string
          insurance_coverage: Json | null
          ivf_cycles: Json | null
          ovulation_tracking: Json | null
          partner_id: string | null
          patient_id: string
          success_probability: number | null
          treatment_plan: Json | null
          updated_at: string
        }
        Insert: {
          basal_body_temperature?: Json | null
          consultation_notes?: Json | null
          cost_estimates?: Json | null
          created_at?: string
          fertility_medications?: Json | null
          fertility_status?: string | null
          fertility_tests?: Json | null
          id?: string
          insurance_coverage?: Json | null
          ivf_cycles?: Json | null
          ovulation_tracking?: Json | null
          partner_id?: string | null
          patient_id: string
          success_probability?: number | null
          treatment_plan?: Json | null
          updated_at?: string
        }
        Update: {
          basal_body_temperature?: Json | null
          consultation_notes?: Json | null
          cost_estimates?: Json | null
          created_at?: string
          fertility_medications?: Json | null
          fertility_status?: string | null
          fertility_tests?: Json | null
          id?: string
          insurance_coverage?: Json | null
          ivf_cycles?: Json | null
          ovulation_tracking?: Json | null
          partner_id?: string | null
          patient_id?: string
          success_probability?: number | null
          treatment_plan?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          forum_id: string
          id: string
          is_anonymous: boolean | null
          is_locked: boolean | null
          is_pinned: boolean | null
          language: string | null
          post_type: string | null
          reply_count: number | null
          tags: Json | null
          title: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          forum_id: string
          id?: string
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          language?: string | null
          post_type?: string | null
          reply_count?: number | null
          tags?: Json | null
          title: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          forum_id?: string
          id?: string
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          language?: string | null
          post_type?: string | null
          reply_count?: number | null
          tags?: Json | null
          title?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "community_forums"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          is_expert_reply: boolean | null
          post_id: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_expert_reply?: boolean | null
          post_id: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_expert_reply?: boolean | null
          post_id?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          created_at: string
          data: Json
          file_url: string | null
          id: string
          is_verified: boolean | null
          patient_id: string
          provider_id: string | null
          recorded_date: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: Json
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          patient_id: string
          provider_id?: string | null
          recorded_date?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          patient_id?: string
          provider_id?: string | null
          recorded_date?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      healthcare_providers: {
        Row: {
          address: Json
          city: string | null
          contact_info: Json
          country: string | null
          created_at: string
          id: string
          insurance_accepted: Json | null
          is_partner: boolean | null
          location_coords: unknown | null
          name: string
          operating_hours: Json | null
          pricing_info: Json | null
          provider_type: string | null
          rating: number | null
          review_count: number | null
          services: Json | null
          specialties: Json | null
          state: string | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          address: Json
          city?: string | null
          contact_info: Json
          country?: string | null
          created_at?: string
          id?: string
          insurance_accepted?: Json | null
          is_partner?: boolean | null
          location_coords?: unknown | null
          name: string
          operating_hours?: Json | null
          pricing_info?: Json | null
          provider_type?: string | null
          rating?: number | null
          review_count?: number | null
          services?: Json | null
          specialties?: Json | null
          state?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          address?: Json
          city?: string | null
          contact_info?: Json
          country?: string | null
          created_at?: string
          id?: string
          insurance_accepted?: Json | null
          is_partner?: boolean | null
          location_coords?: unknown | null
          name?: string
          operating_hours?: Json | null
          pricing_info?: Json | null
          provider_type?: string | null
          rating?: number | null
          review_count?: number | null
          services?: Json | null
          specialties?: Json | null
          state?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      insurance_claims: {
        Row: {
          appointment_id: string | null
          claim_amount: number
          claim_number: string
          created_at: string
          documents: Json | null
          id: string
          insurance_provider: string
          patient_id: string
          policy_number: string
          processed_date: string | null
          status: string
          submitted_date: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          claim_amount: number
          claim_number: string
          created_at?: string
          documents?: Json | null
          id?: string
          insurance_provider: string
          patient_id: string
          policy_number: string
          processed_date?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          claim_amount?: number
          claim_number?: string
          created_at?: string
          documents?: Json | null
          id?: string
          insurance_provider?: string
          patient_id?: string
          policy_number?: string
          processed_date?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          api_endpoint: string | null
          contact_info: Json | null
          coverage_types: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          network_hospitals: Json | null
          provider_code: string
          supported_services: Json | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          contact_info?: Json | null
          coverage_types?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          network_hospitals?: Json | null
          provider_code: string
          supported_services?: Json | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          contact_info?: Json | null
          coverage_types?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          network_hospitals?: Json | null
          provider_code?: string
          supported_services?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          ai_interpretation: Json | null
          cost: number | null
          created_at: string
          critical_values: Json | null
          id: string
          insurance_covered: boolean | null
          lab_partner: string
          order_date: string
          patient_id: string
          provider_id: string
          recommendations: Json | null
          results_expected_date: string | null
          results_received_date: string | null
          sample_collection_date: string | null
          status: string | null
          test_results: Json | null
          test_types: Json
          updated_at: string
        }
        Insert: {
          ai_interpretation?: Json | null
          cost?: number | null
          created_at?: string
          critical_values?: Json | null
          id?: string
          insurance_covered?: boolean | null
          lab_partner: string
          order_date?: string
          patient_id: string
          provider_id: string
          recommendations?: Json | null
          results_expected_date?: string | null
          results_received_date?: string | null
          sample_collection_date?: string | null
          status?: string | null
          test_results?: Json | null
          test_types?: Json
          updated_at?: string
        }
        Update: {
          ai_interpretation?: Json | null
          cost?: number | null
          created_at?: string
          critical_values?: Json | null
          id?: string
          insurance_covered?: boolean | null
          lab_partner?: string
          order_date?: string
          patient_id?: string
          provider_id?: string
          recommendations?: Json | null
          results_expected_date?: string | null
          results_received_date?: string | null
          sample_collection_date?: string | null
          status?: string | null
          test_results?: Json | null
          test_types?: Json
          updated_at?: string
        }
        Relationships: []
      }
      maternal_records: {
        Row: {
          actual_delivery_date: string | null
          created_at: string
          expected_due_date: string | null
          gestational_week: number | null
          id: string
          lab_results: Json | null
          lactation_data: Json | null
          menstrual_cycle_data: Json | null
          patient_id: string
          postpartum_checkups: Json | null
          pregnancy_complications: Json | null
          pregnancy_stage: string | null
          prenatal_vitamins: Json | null
          ultrasound_reports: Json | null
          updated_at: string
          vital_signs: Json | null
          weight_tracking: Json | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string
          expected_due_date?: string | null
          gestational_week?: number | null
          id?: string
          lab_results?: Json | null
          lactation_data?: Json | null
          menstrual_cycle_data?: Json | null
          patient_id: string
          postpartum_checkups?: Json | null
          pregnancy_complications?: Json | null
          pregnancy_stage?: string | null
          prenatal_vitamins?: Json | null
          ultrasound_reports?: Json | null
          updated_at?: string
          vital_signs?: Json | null
          weight_tracking?: Json | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string
          expected_due_date?: string | null
          gestational_week?: number | null
          id?: string
          lab_results?: Json | null
          lactation_data?: Json | null
          menstrual_cycle_data?: Json | null
          patient_id?: string
          postpartum_checkups?: Json | null
          pregnancy_complications?: Json | null
          pregnancy_stage?: string | null
          prenatal_vitamins?: Json | null
          ultrasound_reports?: Json | null
          updated_at?: string
          vital_signs?: Json | null
          weight_tracking?: Json | null
        }
        Relationships: []
      }
      mental_health_records: {
        Row: {
          anxiety_levels: Json | null
          assessment_type: string | null
          coping_strategies: Json | null
          created_at: string
          crisis_plan: Json | null
          depression_screening: Json | null
          id: string
          medication_response: Json | null
          mood_tracking: Json | null
          patient_id: string
          progress_notes: Json | null
          support_system: Json | null
          therapist_id: string | null
          therapy_sessions: Json | null
          treatment_goals: Json | null
          updated_at: string
        }
        Insert: {
          anxiety_levels?: Json | null
          assessment_type?: string | null
          coping_strategies?: Json | null
          created_at?: string
          crisis_plan?: Json | null
          depression_screening?: Json | null
          id?: string
          medication_response?: Json | null
          mood_tracking?: Json | null
          patient_id: string
          progress_notes?: Json | null
          support_system?: Json | null
          therapist_id?: string | null
          therapy_sessions?: Json | null
          treatment_goals?: Json | null
          updated_at?: string
        }
        Update: {
          anxiety_levels?: Json | null
          assessment_type?: string | null
          coping_strategies?: Json | null
          created_at?: string
          crisis_plan?: Json | null
          depression_screening?: Json | null
          id?: string
          medication_response?: Json | null
          mood_tracking?: Json | null
          patient_id?: string
          progress_notes?: Json | null
          support_system?: Json | null
          therapist_id?: string | null
          therapy_sessions?: Json | null
          treatment_goals?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_insurance: {
        Row: {
          beneficiaries: Json | null
          copay_percentage: number | null
          coverage_amount: number | null
          covered_services: Json | null
          created_at: string
          deductible_amount: number | null
          exclusions: Json | null
          id: string
          is_active: boolean | null
          patient_id: string
          policy_end_date: string
          policy_number: string
          policy_start_date: string
          policy_type: string | null
          premium_amount: number | null
          provider_id: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: Json | null
          copay_percentage?: number | null
          coverage_amount?: number | null
          covered_services?: Json | null
          created_at?: string
          deductible_amount?: number | null
          exclusions?: Json | null
          id?: string
          is_active?: boolean | null
          patient_id: string
          policy_end_date: string
          policy_number: string
          policy_start_date: string
          policy_type?: string | null
          premium_amount?: number | null
          provider_id: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: Json | null
          copay_percentage?: number | null
          coverage_amount?: number | null
          covered_services?: Json | null
          created_at?: string
          deductible_amount?: number | null
          exclusions?: Json | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
          policy_end_date?: string
          policy_number?: string
          policy_start_date?: string
          policy_type?: string | null
          premium_amount?: number | null
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_risk_scores: {
        Row: {
          calculated_at: string
          cardiovascular_risk: number | null
          chronic_disease_risk: number | null
          created_at: string
          diabetes_risk: number | null
          id: string
          maternal_risk: number | null
          mental_health_risk: number | null
          next_assessment_date: string | null
          overall_risk_score: number | null
          patient_id: string
          protective_factors: Json | null
          recommendations: Json | null
          risk_factors: Json | null
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          cardiovascular_risk?: number | null
          chronic_disease_risk?: number | null
          created_at?: string
          diabetes_risk?: number | null
          id?: string
          maternal_risk?: number | null
          mental_health_risk?: number | null
          next_assessment_date?: string | null
          overall_risk_score?: number | null
          patient_id: string
          protective_factors?: Json | null
          recommendations?: Json | null
          risk_factors?: Json | null
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          cardiovascular_risk?: number | null
          chronic_disease_risk?: number | null
          created_at?: string
          diabetes_risk?: number | null
          id?: string
          maternal_risk?: number | null
          mental_health_risk?: number | null
          next_assessment_date?: string | null
          overall_risk_score?: number | null
          patient_id?: string
          protective_factors?: Json | null
          recommendations?: Json | null
          risk_factors?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          expires_at: string
          id: string
          link_id: string
          metadata: Json | null
          patient_id: string | null
          payment_transaction_id: string | null
          provider_id: string
          qr_code_url: string | null
          service_type: string
          status: string
          updated_at: string
          used_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          expires_at: string
          id?: string
          link_id: string
          metadata?: Json | null
          patient_id?: string | null
          payment_transaction_id?: string | null
          provider_id: string
          qr_code_url?: string | null
          service_type: string
          status?: string
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          expires_at?: string
          id?: string
          link_id?: string
          metadata?: Json | null
          patient_id?: string | null
          payment_transaction_id?: string | null
          provider_id?: string
          qr_code_url?: string | null
          service_type?: string
          status?: string
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          metadata: Json | null
          patient_id: string
          payment_gateway: string
          payment_method: string
          provider_id: string | null
          status: string
          transaction_id: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          patient_id: string
          payment_gateway: string
          payment_method: string
          provider_id?: string | null
          status?: string
          transaction_id: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          patient_id?: string
          payment_gateway?: string
          payment_method?: string
          provider_id?: string | null
          status?: string
          transaction_id?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pediatric_records: {
        Row: {
          allergies: Json | null
          behavioral_notes: Json | null
          birth_date: string
          birth_height: number | null
          birth_weight: number | null
          created_at: string
          development_assessments: Json | null
          emergency_contacts: Json | null
          feeding_schedule: Json | null
          growth_milestones: Json | null
          id: string
          medical_conditions: Json | null
          parent_id: string
          patient_id: string
          pediatrician_id: string | null
          sleep_patterns: Json | null
          updated_at: string
          vaccination_schedule: Json | null
        }
        Insert: {
          allergies?: Json | null
          behavioral_notes?: Json | null
          birth_date: string
          birth_height?: number | null
          birth_weight?: number | null
          created_at?: string
          development_assessments?: Json | null
          emergency_contacts?: Json | null
          feeding_schedule?: Json | null
          growth_milestones?: Json | null
          id?: string
          medical_conditions?: Json | null
          parent_id: string
          patient_id: string
          pediatrician_id?: string | null
          sleep_patterns?: Json | null
          updated_at?: string
          vaccination_schedule?: Json | null
        }
        Update: {
          allergies?: Json | null
          behavioral_notes?: Json | null
          birth_date?: string
          birth_height?: number | null
          birth_weight?: number | null
          created_at?: string
          development_assessments?: Json | null
          emergency_contacts?: Json | null
          feeding_schedule?: Json | null
          growth_milestones?: Json | null
          id?: string
          medical_conditions?: Json | null
          parent_id?: string
          patient_id?: string
          pediatrician_id?: string | null
          sleep_patterns?: Json | null
          updated_at?: string
          vaccination_schedule?: Json | null
        }
        Relationships: []
      }
      pharmacy_orders: {
        Row: {
          created_at: string
          delivery_address: Json
          delivery_date: string | null
          delivery_instructions: string | null
          delivery_status: string | null
          discount_amount: number | null
          id: string
          insurance_coverage: number | null
          medications: Json
          order_date: string
          patient_id: string
          payment_status: string | null
          pharmacy_partner: string
          prescription_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_address: Json
          delivery_date?: string | null
          delivery_instructions?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          id?: string
          insurance_coverage?: number | null
          medications?: Json
          order_date?: string
          patient_id: string
          payment_status?: string | null
          pharmacy_partner: string
          prescription_id?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_address?: Json
          delivery_date?: string | null
          delivery_instructions?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          id?: string
          insurance_coverage?: number | null
          medications?: Json
          order_date?: string
          patient_id?: string
          payment_status?: string | null
          pharmacy_partner?: string
          prescription_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string | null
          created_at: string
          diagnosis: string | null
          expiry_date: string | null
          id: string
          instructions: string | null
          issued_date: string
          medications: Json
          patient_id: string
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          diagnosis?: string | null
          expiry_date?: string | null
          id?: string
          instructions?: string | null
          issued_date?: string
          medications: Json
          patient_id: string
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          diagnosis?: string | null
          expiry_date?: string | null
          id?: string
          instructions?: string | null
          issued_date?: string
          medications?: Json
          patient_id?: string
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: Json | null
          first_name: string | null
          gender: string | null
          id: string
          insurance_info: Json | null
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          last_name?: string | null
          phone?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_enrollments: {
        Row: {
          completion_percentage: number | null
          created_at: string
          enrollment_date: string
          feedback: Json | null
          id: string
          patient_id: string
          program_id: string
          progress_data: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          enrollment_date?: string
          feedback?: Json | null
          id?: string
          patient_id: string
          program_id: string
          progress_data?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          enrollment_date?: string
          feedback?: Json | null
          id?: string
          patient_id?: string
          program_id?: string
          progress_data?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "wellness_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_profiles: {
        Row: {
          available_slots: Json | null
          bio: string | null
          certifications: Json | null
          consultation_fee: number | null
          created_at: string
          education: Json | null
          experience_years: number | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          rating: number | null
          specialties: string[] | null
          total_consultations: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_slots?: Json | null
          bio?: string | null
          certifications?: Json | null
          consultation_fee?: number | null
          created_at?: string
          education?: Json | null
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_consultations?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_slots?: Json | null
          bio?: string | null
          certifications?: Json | null
          consultation_fee?: number | null
          created_at?: string
          education?: Json | null
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_consultations?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provider_verification_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          documents: Json | null
          experience_years: number
          id: string
          license_number: string
          medical_college: string
          nmr_id: string
          nmr_response_data: Json | null
          nmr_verification_status: string
          provider_id: string
          specializations: string[]
          updated_at: string
          verification_completed_at: string | null
          verification_status: string
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          documents?: Json | null
          experience_years: number
          id?: string
          license_number: string
          medical_college: string
          nmr_id: string
          nmr_response_data?: Json | null
          nmr_verification_status?: string
          provider_id: string
          specializations?: string[]
          updated_at?: string
          verification_completed_at?: string | null
          verification_status?: string
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          documents?: Json | null
          experience_years?: number
          id?: string
          license_number?: string
          medical_college?: string
          nmr_id?: string
          nmr_response_data?: Json | null
          nmr_verification_status?: string
          provider_id?: string
          specializations?: string[]
          updated_at?: string
          verification_completed_at?: string | null
          verification_status?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          field_name: string
          id: string
          language: string
          translated_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          field_name: string
          id?: string
          language: string
          translated_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          field_name?: string
          id?: string
          language?: string
          translated_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          uploaded_at: string
          verification_request_id: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          verification_request_id: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          verification_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "provider_verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: []
      }
      wellness_programs: {
        Row: {
          content: Json
          cost: number | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_weeks: number
          enrollment_count: number | null
          id: string
          is_corporate_program: boolean | null
          language: string | null
          name: string
          program_type: string | null
          rating: number | null
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          content?: Json
          cost?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks: number
          enrollment_count?: number | null
          id?: string
          is_corporate_program?: boolean | null
          language?: string | null
          name: string
          program_type?: string | null
          rating?: number | null
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          content?: Json
          cost?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number
          enrollment_count?: number | null
          id?: string
          is_corporate_program?: boolean | null
          language?: string | null
          name?: string
          program_type?: string | null
          rating?: number | null
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          max_attempts?: number
          operation_type: string
          time_window?: unknown
        }
        Returns: boolean
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_user_role: {
        Args: { _user_id?: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { event_details?: Json; event_type: string }
        Returns: undefined
      }
      switch_user_role: {
        Args: { target_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "provider" | "corporate" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "provider", "corporate", "admin"],
    },
  },
} as const
