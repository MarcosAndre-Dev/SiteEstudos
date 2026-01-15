import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Subject = {
  id: string
  title: string
  description: string
  created_at: string
}

export type Topic = {
  id: string
  subject_id: string
  title: string
  is_completed: boolean
  created_at: string
}

export type StudySession = {
  id: string
  topic_id: string
  duration_minutes: number
  notes: string
  studied_at: string
}
