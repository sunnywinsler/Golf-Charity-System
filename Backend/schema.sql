-- Create Enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE sub_status AS ENUM ('active', 'inactive', 'past_due', 'canceled');
CREATE TYPE sub_tier AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_status AS ENUM ('scheduled', 'simulated', 'published');
CREATE TYPE draw_logic AS ENUM ('random', 'algorithmic');
CREATE TYPE match_type AS ENUM ('5-match', '4-match', '3-match');
CREATE TYPE winner_status AS ENUM ('pending_proof', 'pending_review', 'approved', 'paid', 'rejected');

-- Charities Table (Created first as it's referenced by users)
CREATE TABLE public.charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    total_raised NUMERIC DEFAULT 0.00
);

-- Users Table (Extends Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    full_name TEXT,
    stripe_customer_id TEXT UNIQUE,
    subscription_status sub_status DEFAULT 'inactive',
    subscription_tier sub_tier,
    selected_charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
    charity_contribution_pct NUMERIC DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores Table
CREATE TABLE public.scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 45),
    played_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying recent scores efficiently
CREATE INDEX idx_scores_user_created ON public.scores(user_id, created_at DESC);

-- Draws Table
CREATE TABLE public.draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_year DATE NOT NULL,
    status draw_status DEFAULT 'scheduled',
    logic_used draw_logic DEFAULT 'random',
    total_pool_amount NUMERIC DEFAULT 0.00,
    jackpot_rollover_amount NUMERIC DEFAULT 0.00,
    winning_sequence JSONB, -- stores array of 5 integers e.g. [12, 5, 42, 19, 3]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winners Table
CREATE TABLE public.winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    match_type match_type NOT NULL,
    prize_amount NUMERIC NOT NULL DEFAULT 0.00,
    proof_image_url TEXT,
    status winner_status DEFAULT 'pending_proof',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Charities are viewable by everyone, only admins can manage
CREATE POLICY "Charities are viewable by everyone" ON public.charities FOR SELECT USING (true);

-- Users can view and update their own profiles
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Scores viewing and insertion (users only manage their own)
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Winners and Draws (viewing)
CREATE POLICY "Draws viewable by all" ON public.draws FOR SELECT USING (status = 'published');
CREATE POLICY "Winners viewable by all" ON public.winners FOR SELECT USING (status != 'rejected');
-- Users can potentially update their proof_image_url
CREATE POLICY "Users can update own winner proof" ON public.winners FOR UPDATE USING (auth.uid() = user_id);
