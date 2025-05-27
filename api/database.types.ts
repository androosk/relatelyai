export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'chat_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      checkins: {
        Row: {
          created_at: string | null;
          id: string;
          mood_score: number;
          notes: string | null;
          tags: string[] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          mood_score: number;
          notes?: string | null;
          tags?: string[] | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          mood_score?: number;
          notes?: string | null;
          tags?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age: number | null;
          anniversary_date: string | null;
          bio: string | null;
          created_at: string | null;
          device_token: string | null;
          email_notifications: boolean | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          love_languages: string[] | null;
          partner_birthdate: string | null;
          partner_name: string | null;
          phone_number: string | null;
          profile_picture_url: string | null;
          push_notifications: boolean | null;
          relationship_goals: Json | null;
          relationship_start_date: string | null;
          relationship_status: string | null;
          text_notifications: boolean | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          age?: number | null;
          anniversary_date?: string | null;
          bio?: string | null;
          created_at?: string | null;
          device_token?: string | null;
          email_notifications?: boolean | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          love_languages?: string[] | null;
          partner_birthdate?: string | null;
          partner_name?: string | null;
          phone_number?: string | null;
          profile_picture_url?: string | null;
          push_notifications?: boolean | null;
          relationship_goals?: Json | null;
          relationship_start_date?: string | null;
          relationship_status?: string | null;
          text_notifications?: boolean | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          age?: number | null;
          anniversary_date?: string | null;
          bio?: string | null;
          created_at?: string | null;
          device_token?: string | null;
          email_notifications?: boolean | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          love_languages?: string[] | null;
          partner_birthdate?: string | null;
          partner_name?: string | null;
          phone_number?: string | null;
          profile_picture_url?: string | null;
          push_notifications?: boolean | null;
          relationship_goals?: Json | null;
          relationship_start_date?: string | null;
          relationship_status?: string | null;
          text_notifications?: boolean | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          answers: Json | null;
          assessment: string;
          created_at: string | null;
          id: string;
          quiz_type: string;
          recommendation: string | null;
          score: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          answers?: Json | null;
          assessment: string;
          created_at?: string | null;
          id?: string;
          quiz_type?: string;
          recommendation?: string | null;
          score: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          answers?: Json | null;
          assessment?: string;
          created_at?: string | null;
          id?: string;
          quiz_type?: string;
          recommendation?: string | null;
          score?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
