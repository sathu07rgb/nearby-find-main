export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      item_reports: {
        Row: {
          id: string
          reporter_id: string
          report_type: 'lost' | 'found'
          item_name: string
          category: ItemCategory
          description: string
          photo_paths: string[]
          approximate_location: string
          city: string
          campus: string | null
          event_date: string
          status: ReportStatus
          is_demo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          report_type: 'lost' | 'found'
          item_name: string
          category: ItemCategory
          description: string
          photo_paths?: string[]
          approximate_location: string
          city: string
          campus?: string | null
          event_date: string
          status?: ReportStatus
          is_demo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          item_name?: string
          category?: ItemCategory
          description?: string
          photo_paths?: string[]
          approximate_location?: string
          city?: string
          campus?: string | null
          event_date?: string
          status?: ReportStatus
          updated_at?: string
        }
      }
      private_item_details: {
        Row: {
          id: string
          report_id: string
          owner_id: string
          verification_details: string
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          owner_id: string
          verification_details: string
          created_at?: string
        }
        Update: {
          verification_details?: string
        }
      }
      potential_matches: {
        Row: {
          id: string
          lost_report_id: string
          found_report_id: string
          similarity_score: number
          match_explanation: MatchExplanation
          status: MatchStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lost_report_id: string
          found_report_id: string
          similarity_score: number
          match_explanation: MatchExplanation
          status?: MatchStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          similarity_score?: number
          match_explanation?: MatchExplanation
          status?: MatchStatus
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          report_id: string
          claimant_id: string
          evidence_description: string
          verification_status: ClaimStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          claimant_id: string
          evidence_description: string
          verification_status?: ClaimStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          evidence_description?: string
          verification_status?: ClaimStatus
          notes?: string | null
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          related_report_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          related_report_id?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: Record<string, never>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          body: string
          created_at?: string
        }
        Update: Record<string, never>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          related_record_id: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          related_record_id?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          read_at?: string | null
        }
      }
      abuse_reports: {
        Row: {
          id: string
          reporter_id: string
          target_type: string
          target_id: string
          reason: string
          status: 'pending' | 'reviewed' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          target_type: string
          target_id: string
          reason: string
          status?: 'pending' | 'reviewed' | 'resolved'
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'reviewed' | 'resolved'
        }
      }
      moderation_actions: {
        Row: {
          id: string
          moderator_id: string
          target_type: string
          target_id: string
          action: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          moderator_id: string
          target_type: string
          target_id: string
          action: string
          notes?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
  }
}

export type ItemCategory =
  | 'electronics'
  | 'wallets_bags'
  | 'keys'
  | 'id_cards'
  | 'clothing'
  | 'books_stationery'
  | 'jewellery'
  | 'other'

export type ReportStatus = 'open' | 'matched' | 'recovered' | 'closed'
export type MatchStatus = 'suggested' | 'under_review' | 'verified' | 'recovered' | 'rejected'
export type ClaimStatus = 'submitted' | 'awaiting_verification' | 'verified' | 'rejected' | 'handover_arranged' | 'recovered'
export type NotificationType = 'new_match' | 'new_message' | 'claim_submitted' | 'claim_update' | 'item_recovered'

export interface MatchExplanation {
  text_similarity: number
  category_match: boolean
  location_proximity: number
  time_proximity: number
  factors: string[]
  summary: string
}

// Derived types for UI use
export type ItemReport = Database['public']['Tables']['item_reports']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type PotentialMatch = Database['public']['Tables']['potential_matches']['Row']
export type Claim = Database['public']['Tables']['claims']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
