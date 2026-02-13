
-- Create game_sessions table to store user info and mental health records
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  player_age INTEGER NOT NULL,
  player_institution TEXT NOT NULL,
  ocean_scores JSONB,
  mental_health_level INTEGER,
  confidence_level INTEGER,
  stress_resilience INTEGER,
  emotional_intelligence INTEGER,
  urgency_level TEXT,
  full_report JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required for this game)
CREATE POLICY "Anyone can insert game sessions"
  ON public.game_sessions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own sessions (by name lookup)
CREATE POLICY "Anyone can read game sessions"
  ON public.game_sessions
  FOR SELECT
  USING (true);
