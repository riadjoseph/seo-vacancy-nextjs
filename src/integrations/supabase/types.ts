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
      european_cities: {
        Row: {
          city: string
          country: string
          id: number
          is_capital: boolean | null
        }
        Insert: {
          city: string
          country: string
          id?: number
          is_capital?: boolean | null
        }
        Update: {
          city?: string
          country?: string
          id?: number
          is_capital?: boolean | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          bookmarks: number | null
          category: string
          city: string | null
          company_logo: string | null
          company_name: string
          created_at: string | null
          description: string
          expires_at: string
          featured: boolean | null
          hide_salary: boolean | null
          id: string
          job_url: string
          location: string | null
          posted_date: string | null
          rating: number | null
          reviews: number | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          start_date: string | null
          tags: Database["public"]["Enums"]["seo_specialization"][] | null
          title: string
          user_id: string | null
        }
        Insert: {
          bookmarks?: number | null
          category: string
          city?: string | null
          company_logo?: string | null
          company_name: string
          created_at?: string | null
          description: string
          expires_at: string
          featured?: boolean | null
          hide_salary?: boolean | null
          id?: string
          job_url: string
          location?: string | null
          posted_date?: string | null
          rating?: number | null
          reviews?: number | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          start_date?: string | null
          tags?: Database["public"]["Enums"]["seo_specialization"][] | null
          title: string
          user_id?: string | null
        }
        Update: {
          bookmarks?: number | null
          category?: string
          city?: string | null
          company_logo?: string | null
          company_name?: string
          created_at?: string | null
          description?: string
          expires_at?: string
          featured?: boolean | null
          hide_salary?: boolean | null
          id?: string
          job_url?: string
          location?: string | null
          posted_date?: string | null
          rating?: number | null
          reviews?: number | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          start_date?: string | null
          tags?: Database["public"]["Enums"]["seo_specialization"][] | null
          title?: string
          user_id?: string | null
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
      seo_specialization:
        | "Technical SEO"
        | "Content SEO"
        | "Local SEO"
        | "E-commerce SEO"
        | "International SEO"
        | "Enterprise SEO"
        | "Link Building"
        | "SEO Strategy & Management"
        | "Analytics & Data SEO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
