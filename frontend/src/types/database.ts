export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          checked_in_at: string
          hall_qr_session_id: string | null
          id: string
          registration_id: string
          verified_by: string | null
        }
        Insert: {
          checked_in_at?: string
          hall_qr_session_id?: string | null
          id?: string
          registration_id: string
          verified_by?: string | null
        }
        Update: {
          checked_in_at?: string
          hall_qr_session_id?: string | null
          id?: string
          registration_id?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_hall_qr_session_id_fkey"
            columns: ["hall_qr_session_id"]
            isOneToOne: false
            referencedRelation: "hall_qr_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          id: string
          notification_type: string
          recipient_email: string
          recipient_name: string
          recipient_type: string
          registration_id: string | null
          sent_at: string | null
          status: string
          subject: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          id?: string
          notification_type: string
          recipient_email: string
          recipient_name: string
          recipient_type: string
          registration_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_data?: Json
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          id?: string
          notification_type?: string
          recipient_email?: string
          recipient_name?: string
          recipient_type?: string
          registration_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_notifications_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          capacity: number
          category: string
          created_at: string
          description: string
          event_end: string
          event_start: string
          id: string
          organizer_club: string | null
          organizer_id: string
          registration_deadline: string
          short_description: string | null
          status: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          banner_url?: string | null
          capacity: number
          category: string
          created_at?: string
          description: string
          event_end: string
          event_start: string
          id?: string
          organizer_club?: string | null
          organizer_id: string
          registration_deadline: string
          short_description?: string | null
          status?: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          banner_url?: string | null
          capacity?: number
          category?: string
          created_at?: string
          description?: string
          event_end?: string
          event_start?: string
          id?: string
          organizer_club?: string | null
          organizer_id?: string
          registration_deadline?: string
          short_description?: string | null
          status?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_qr_sessions: {
        Row: {
          created_at: string
          event_id: string
          hall_name: string
          id: string
          is_active: boolean
          qr_image_url: string | null
          token_hash: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          event_id: string
          hall_name: string
          id?: string
          is_active?: boolean
          qr_image_url?: string | null
          token_hash: string
          valid_from?: string
          valid_until: string
        }
        Update: {
          created_at?: string
          event_id?: string
          hall_name?: string
          id?: string
          is_active?: boolean
          qr_image_url?: string | null
          token_hash?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "hall_qr_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          email_sent: boolean
          email_sent_at: string | null
          event_id: string
          id: string
          qr_image_url: string | null
          registered_at: string
          status: string
          student_id: string
          ticket_code: string
        }
        Insert: {
          email_sent?: boolean
          email_sent_at?: string | null
          event_id: string
          id?: string
          qr_image_url?: string | null
          registered_at?: string
          status?: string
          student_id: string
          ticket_code: string
        }
        Update: {
          email_sent?: boolean
          email_sent_at?: string | null
          event_id?: string
          id?: string
          qr_image_url?: string | null
          registered_at?: string
          status?: string
          student_id?: string
          ticket_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          created_at: string
          department: string
          full_name: string
          id: string
          phone: string | null
          roll_number: string
          updated_at: string
          user_id: string
          year_of_study: number
        }
        Insert: {
          created_at?: string
          department: string
          full_name: string
          id?: string
          phone?: string | null
          roll_number: string
          updated_at?: string
          user_id: string
          year_of_study: number
        }
        Update: {
          created_at?: string
          department?: string
          full_name?: string
          id?: string
          phone?: string | null
          roll_number?: string
          updated_at?: string
          user_id?: string
          year_of_study?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      register_student_for_event: {
        Args: {
          p_event_id: string
          p_student_id: string
          p_ticket_code: string
        }
        Returns: Json
      }
      verify_hall_qr_attendance: {
        Args: { p_student_id: string; p_token_hash: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
