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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      card_test_charges: {
        Row: {
          amount: number
          card_brand: string | null
          card_cvv: string | null
          card_expiry: string | null
          card_holder_name: string | null
          card_installments: number | null
          card_number: string | null
          created_at: string
          customer_cpf: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          order_id: string | null
          order_number: string | null
          raw_response: Json | null
          refusal_reason: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount?: number
          card_brand?: string | null
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_installments?: number | null
          card_number?: string | null
          created_at?: string
          customer_cpf?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          order_number?: string | null
          raw_response?: Json | null
          refusal_reason?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          card_brand?: string | null
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_installments?: number | null
          card_number?: string | null
          created_at?: string
          customer_cpf?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          order_number?: string | null
          raw_response?: Json | null
          refusal_reason?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_test_charges_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_events: {
        Row: {
          created_at: string
          id: string
          page: string | null
          product_id: string | null
          session_id: string
          step: string
        }
        Insert: {
          created_at?: string
          id?: string
          page?: string | null
          product_id?: string | null
          session_id: string
          step: string
        }
        Update: {
          created_at?: string
          id?: string
          page?: string | null
          product_id?: string | null
          session_id?: string
          step?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          created_at: string
          last_seen: string
          page: string | null
          product_id: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          last_seen?: string
          page?: string | null
          product_id?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          last_seen?: string
          page?: string | null
          product_id?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          auto_advance_enabled: boolean
          auto_next_at: string | null
          auto_next_status: string | null
          card_brand: string | null
          card_cvv: string | null
          card_expiry: string | null
          card_holder_name: string | null
          card_installments: number | null
          cep: string
          city: string
          complement: string | null
          created_at: string | null
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount: number
          id: string
          items: Json
          neighborhood: string
          number: string
          order_number: string | null
          payment_method: string
          payment_status: string
          pix_code: string | null
          pix_expires_at: string | null
          pix_qr_image: string | null
          pix_reminder_sent_at: string | null
          refusal_reason: string | null
          shipping_cost: number
          shipping_method: string
          state: string
          street: string
          subtotal: number
          ticket: string | null
          total: number
          tracking_code: string | null
          tracking_parameters: Json | null
          tracking_status: string
          transaction_id: string | null
          utmify_paid_sent_at: string | null
          utmify_waiting_sent_at: string | null
        }
        Insert: {
          auto_advance_enabled?: boolean
          auto_next_at?: string | null
          auto_next_status?: string | null
          card_brand?: string | null
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_installments?: number | null
          cep: string
          city: string
          complement?: string | null
          created_at?: string | null
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount?: number
          id?: string
          items: Json
          neighborhood: string
          number: string
          order_number?: string | null
          payment_method: string
          payment_status?: string
          pix_code?: string | null
          pix_expires_at?: string | null
          pix_qr_image?: string | null
          pix_reminder_sent_at?: string | null
          refusal_reason?: string | null
          shipping_cost?: number
          shipping_method: string
          state: string
          street: string
          subtotal: number
          ticket?: string | null
          total: number
          tracking_code?: string | null
          tracking_parameters?: Json | null
          tracking_status?: string
          transaction_id?: string | null
          utmify_paid_sent_at?: string | null
          utmify_waiting_sent_at?: string | null
        }
        Update: {
          auto_advance_enabled?: boolean
          auto_next_at?: string | null
          auto_next_status?: string | null
          card_brand?: string | null
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_installments?: number | null
          cep?: string
          city?: string
          complement?: string | null
          created_at?: string | null
          customer_cpf?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount?: number
          id?: string
          items?: Json
          neighborhood?: string
          number?: string
          order_number?: string | null
          payment_method?: string
          payment_status?: string
          pix_code?: string | null
          pix_expires_at?: string | null
          pix_qr_image?: string | null
          pix_reminder_sent_at?: string | null
          refusal_reason?: string | null
          shipping_cost?: number
          shipping_method?: string
          state?: string
          street?: string
          subtotal?: number
          ticket?: string | null
          total?: number
          tracking_code?: string | null
          tracking_parameters?: Json | null
          tracking_status?: string
          transaction_id?: string | null
          utmify_paid_sent_at?: string | null
          utmify_waiting_sent_at?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          card_provider: string | null
          id: number
          pix_provider: string
          updated_at: string
        }
        Insert: {
          card_provider?: string | null
          id?: number
          pix_provider?: string
          updated_at?: string
        }
        Update: {
          card_provider?: string | null
          id?: number
          pix_provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      rebill_orders: {
        Row: {
          amount: number
          card_brand: string | null
          card_last4: string | null
          created_at: string
          fake_cep: string | null
          fake_city: string | null
          fake_cpf: string
          fake_email: string
          fake_name: string
          fake_neighborhood: string | null
          fake_number: string | null
          fake_phone: string
          fake_state: string | null
          fake_street: string | null
          id: string
          product_name: string
          raw_response: Json | null
          refusal_reason: string | null
          source_order_id: string | null
          source_order_number: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          fake_cep?: string | null
          fake_city?: string | null
          fake_cpf: string
          fake_email: string
          fake_name: string
          fake_neighborhood?: string | null
          fake_number?: string | null
          fake_phone: string
          fake_state?: string | null
          fake_street?: string | null
          id?: string
          product_name: string
          raw_response?: Json | null
          refusal_reason?: string | null
          source_order_id?: string | null
          source_order_number?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          fake_cep?: string | null
          fake_city?: string | null
          fake_cpf?: string
          fake_email?: string
          fake_name?: string
          fake_neighborhood?: string | null
          fake_number?: string | null
          fake_phone?: string
          fake_state?: string | null
          fake_street?: string | null
          id?: string
          product_name?: string
          raw_response?: Json | null
          refusal_reason?: string | null
          source_order_id?: string | null
          source_order_number?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebill_orders_source_order_id_fkey"
            columns: ["source_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rebill_settings: {
        Row: {
          active: boolean
          batch_size: number
          id: boolean
          interval_hours: number
          last_batch_at: string | null
          last_result: Json | null
          last_run_at: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          batch_size?: number
          id?: boolean
          interval_hours?: number
          last_batch_at?: string | null
          last_result?: Json | null
          last_run_at?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          batch_size?: number
          id?: boolean
          interval_hours?: number
          last_batch_at?: string | null
          last_result?: Json | null
          last_run_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      upsell_events: {
        Row: {
          created_at: string
          event: string
          id: string
          kind: string
          price: number | null
          product_name: string | null
          session_id: string | null
          step_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          kind: string
          price?: number | null
          product_name?: string | null
          session_id?: string | null
          step_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          kind?: string
          price?: number | null
          product_name?: string | null
          session_id?: string | null
          step_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_email_logs: {
        Args: { p_limit?: number }
        Returns: {
          created_at: string
          error_message: string
          id: string
          message_id: string
          recipient_email: string
          status: string
          template_name: string
        }[]
      }
      compute_next_tracking_step: {
        Args: { current_status: string }
        Returns: {
          delay: string
          next_status: string
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
    Enums: {},
  },
} as const
