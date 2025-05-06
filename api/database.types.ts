export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checkins: {
        Row: {
          created_at: string | null
          id: string
          mood_score: number
          notes: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_score: number
          notes?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_score?: number
          notes?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          anniversary_date: string | null
          bio: string | null
          created_at: string | null
          device_token: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          love_languages: string[] | null
          partner_birthdate: string | null
          partner_name: string | null
          phone_number: string | null
          profile_picture_url: string | null
          push_notifications: boolean | null
          relationship_goals: Json | null
          relationship_start_date: string | null
          relationship_status: string | null
          text_notifications: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          age?: number | null
          anniversary_date?: string | null
          bio?: string | null
          created_at?: string | null
          device_token?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          love_languages?: string[] | null
          partner_birthdate?: string | null
          partner_name?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          relationship_goals?: Json | null
          relationship_start_date?: string | null
          relationship_status?: string | null
          text_notifications?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          age?: number | null
          anniversary_date?: string | null
          bio?: string | null
          created_at?: string | null
          device_token?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          love_languages?: string[] | null
          partner_birthdate?: string | null
          partner_name?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          relationship_goals?: Json | null
          relationship_start_date?: string | null
          relationship_status?: string | null
          text_notifications?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          answers: Json | null
          assessment: string
          created_at: string | null
          id: string
          quiz_type: string
          recommendation: string | null
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment: string
          created_at?: string | null
          id?: string
          quiz_type?: string
          recommendation?: string | null
          score: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment?: string
          created_at?: string | null
          id?: string
          quiz_type?: string
          recommendation?: string | null
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
