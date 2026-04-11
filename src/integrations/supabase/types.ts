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
      announcements: {
        Row: {
          announcement_type: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          end_date: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          media_type: string
          media_url: string | null
          priority: number
          start_date: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          announcement_type?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          media_type?: string
          media_url?: string | null
          priority?: number
          start_date?: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          announcement_type?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          media_type?: string
          media_url?: string | null
          priority?: number
          start_date?: string | null
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          error_message: string | null
          id: string
          platform: string
          response: Json | null
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          error_message?: string | null
          id?: string
          platform: string
          response?: Json | null
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string
          response?: Json | null
          status?: string
        }
        Relationships: []
      }
      automation_settings: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_enabled: boolean
          platform: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          is_enabled?: boolean
          platform: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_enabled?: boolean
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          package_price: string | null
          package_title: string
          status: Database["public"]["Enums"]["booking_status"]
          travelers_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          package_price?: string | null
          package_title: string
          status?: Database["public"]["Enums"]["booking_status"]
          travelers_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          package_price?: string | null
          package_title?: string
          status?: Database["public"]["Enums"]["booking_status"]
          travelers_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      external_links: {
        Row: {
          category: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number
          id: string
          is_active: boolean
          thumbnail_url: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          category: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number
          duration_ar: string
          duration_en: string
          duration_fr: string
          features_ar: string[] | null
          features_en: string[] | null
          features_fr: string[] | null
          id: string
          image_url: string
          is_active: boolean
          is_featured: boolean
          price: string
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          duration_ar: string
          duration_en: string
          duration_fr: string
          features_ar?: string[] | null
          features_en?: string[] | null
          features_fr?: string[] | null
          id?: string
          image_url: string
          is_active?: boolean
          is_featured?: boolean
          price: string
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          duration_ar?: string
          duration_en?: string
          duration_fr?: string
          features_ar?: string[] | null
          features_en?: string[] | null
          features_fr?: string[] | null
          id?: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean
          price?: string
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          created_at: string
          currency: string
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number
          id: string
          is_active: boolean
          price: number
          service_id: string | null
          tier_name_ar: string
          tier_name_en: string
          tier_name_fr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          price: number
          service_id?: string | null
          tier_name_ar: string
          tier_name_en: string
          tier_name_fr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          price?: number
          service_id?: string | null
          tier_name_ar?: string
          tier_name_en?: string
          tier_name_fr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      sliders: {
        Row: {
          button_link: string | null
          button_text_ar: string | null
          button_text_en: string | null
          button_text_fr: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          subtitle_ar: string | null
          subtitle_en: string | null
          subtitle_fr: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          button_link?: string | null
          button_text_ar?: string | null
          button_text_en?: string | null
          button_text_fr?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          button_link?: string | null
          button_text_ar?: string | null
          button_text_en?: string | null
          button_text_fr?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          subtitle_ar?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string
          display_order: number
          icon: string
          id: string
          is_active: boolean
          label_ar: string
          label_en: string
          label_fr: string
          suffix_ar: string | null
          suffix_en: string | null
          suffix_fr: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label_ar: string
          label_en: string
          label_fr: string
          suffix_ar?: string | null
          suffix_en?: string | null
          suffix_fr?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          label_ar?: string
          label_en?: string
          label_fr?: string
          suffix_ar?: string | null
          suffix_en?: string | null
          suffix_fr?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content_ar: string
          content_en: string
          content_fr: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          name_fr: string
          rating: number
          role_ar: string
          role_en: string
          role_fr: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          content_ar: string
          content_en: string
          content_fr: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          name_fr: string
          rating?: number
          role_ar: string
          role_en: string
          role_fr: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          content_ar?: string
          content_en?: string
          content_fr?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          name_fr?: string
          rating?: number
          role_ar?: string
          role_en?: string
          role_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      yemenia_flights: {
        Row: {
          arrival_city_ar: string
          arrival_city_en: string
          arrival_city_fr: string
          arrival_time: string
          created_at: string
          currency: string
          days_of_week: string[]
          departure_city_ar: string
          departure_city_en: string
          departure_city_fr: string
          departure_time: string
          display_order: number
          flight_number: string
          id: string
          is_active: boolean
          notes_ar: string | null
          notes_en: string | null
          notes_fr: string | null
          price: number | null
          updated_at: string
        }
        Insert: {
          arrival_city_ar: string
          arrival_city_en: string
          arrival_city_fr: string
          arrival_time: string
          created_at?: string
          currency?: string
          days_of_week?: string[]
          departure_city_ar: string
          departure_city_en: string
          departure_city_fr: string
          departure_time: string
          display_order?: number
          flight_number: string
          id?: string
          is_active?: boolean
          notes_ar?: string | null
          notes_en?: string | null
          notes_fr?: string | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          arrival_city_ar?: string
          arrival_city_en?: string
          arrival_city_fr?: string
          arrival_time?: string
          created_at?: string
          currency?: string
          days_of_week?: string[]
          departure_city_ar?: string
          departure_city_en?: string
          departure_city_fr?: string
          departure_time?: string
          display_order?: number
          flight_number?: string
          id?: string
          is_active?: boolean
          notes_ar?: string | null
          notes_en?: string | null
          notes_fr?: string | null
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      service_pricing_public: {
        Row: {
          created_at: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number | null
          id: string | null
          is_active: boolean | null
          price: number | null
          service_id: string | null
          tier_name_ar: string | null
          tier_name_en: string | null
          tier_name_fr: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number | null
          id?: string | null
          is_active?: boolean | null
          price?: never
          service_id?: string | null
          tier_name_ar?: string | null
          tier_name_en?: string | null
          tier_name_fr?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number | null
          id?: string | null
          is_active?: boolean | null
          price?: never
          service_id?: string | null
          tier_name_ar?: string | null
          tier_name_en?: string | null
          tier_name_fr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      booking_status: "pending" | "confirmed" | "cancelled"
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
      app_role: ["admin", "user"],
      booking_status: ["pending", "confirmed", "cancelled"],
    },
  },
} as const
