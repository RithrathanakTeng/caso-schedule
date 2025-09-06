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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          hours_per_week: number | null
          id: string
          institution_id: string
          is_active: boolean | null
          name: string
          name_khmer: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          hours_per_week?: number | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          name: string
          name_khmer?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          hours_per_week?: number | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          name?: string
          name_khmer?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          address: string | null
          address_khmer: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          name_khmer: string | null
          phone: string | null
          settings: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          address_khmer?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          name_khmer?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          address_khmer?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          name_khmer?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          first_name_khmer: string | null
          id: string
          institution_id: string
          is_active: boolean | null
          last_name: string
          last_name_khmer: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          first_name_khmer?: string | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          last_name: string
          last_name_khmer?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          first_name_khmer?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          last_name?: string
          last_name_khmer?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_conflicts: {
        Row: {
          conflict_type: string
          created_at: string
          description: string
          entry_ids: string[]
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          schedule_id: string
        }
        Insert: {
          conflict_type: string
          created_at?: string
          description: string
          entry_ids: string[]
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          schedule_id: string
        }
        Update: {
          conflict_type?: string
          created_at?: string
          description?: string
          entry_ids?: string[]
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_conflicts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_entries: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          notes: string | null
          room: string | null
          schedule_id: string
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          notes?: string | null
          room?: string | null
          schedule_id: string
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          notes?: string | null
          room?: string | null
          schedule_id?: string
          start_time?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_entries_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string
          generated_by: string | null
          generation_method: string | null
          id: string
          institution_id: string
          name: string
          status: string | null
          updated_at: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          generated_by?: string | null
          generation_method?: string | null
          id?: string
          institution_id: string
          name: string
          status?: string | null
          updated_at?: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          generated_by?: string | null
          generation_method?: string | null
          id?: string
          institution_id?: string
          name?: string
          status?: string | null
          updated_at?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string | null
          course_id: string
          created_at: string
          hours_per_week: number | null
          id: string
          institution_id: string
          is_active: boolean | null
          name: string
          name_khmer: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          course_id: string
          created_at?: string
          hours_per_week?: number | null
          id?: string
          institution_id: string
          is_active?: boolean | null
          name: string
          name_khmer?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          course_id?: string
          created_at?: string
          hours_per_week?: number | null
          id?: string
          institution_id?: string
          is_active?: boolean | null
          name?: string
          name_khmer?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          institution_id: string
          is_available: boolean | null
          notes: string | null
          start_time: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          institution_id: string
          is_available?: boolean | null
          notes?: string | null
          start_time: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          institution_id?: string
          is_available?: boolean | null
          notes?: string | null
          start_time?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          institution_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          institution_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          institution_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_dev_admin: {
        Args: { dev_email: string; dev_password?: string }
        Returns: Json
      }
      get_user_institution_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_roles: {
        Args: { inst_id: string; user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"][]
      }
      has_role: {
        Args: {
          inst_id: string
          required_role: Database["public"]["Enums"]["user_role"]
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "coordinator" | "teacher"
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
      user_role: ["admin", "coordinator", "teacher"],
    },
  },
} as const
