-- ==============================================================================
-- FINDIT NEARBY: PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. ITEM REPORTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.item_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'electronics', 'wallets_bags', 'keys', 'id_cards',
        'clothing', 'books_stationery', 'jewellery', 'other'
    )),
    description TEXT NOT NULL,
    photo_paths TEXT[] DEFAULT '{}',
    approximate_location TEXT NOT NULL,
    city TEXT NOT NULL,
    campus TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'recovered', 'closed')),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_item_reports_category ON public.item_reports(category);
CREATE INDEX idx_item_reports_status ON public.item_reports(status);
CREATE INDEX idx_item_reports_city ON public.item_reports(city);
CREATE INDEX idx_item_reports_reporter ON public.item_reports(reporter_id);

ALTER TABLE public.item_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public item reports are viewable by everyone"
    ON public.item_reports FOR SELECT
    USING (status != 'closed');

CREATE POLICY "Authenticated users can create their own reports"
    ON public.item_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can update their own reports"
    ON public.item_reports FOR UPDATE
    USING (auth.uid() = reporter_id);

CREATE POLICY "Reporters can delete their own reports"
    ON public.item_reports FOR DELETE
    USING (auth.uid() = reporter_id);

-- ------------------------------------------------------------------------------
-- 3. PRIVATE ITEM DETAILS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.private_item_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.private_item_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Private details only readable by reporter or authorized claims"
    ON public.private_item_details FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Reporters can insert private verification details"
    ON public.private_item_details FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- ------------------------------------------------------------------------------
-- 4. POTENTIAL MATCHES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.potential_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_report_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    found_report_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    similarity_score INTEGER NOT NULL CHECK (similarity_score BETWEEN 0 AND 100),
    match_explanation JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN (
        'suggested', 'under_review', 'verified', 'recovered', 'rejected'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_match_pair UNIQUE (lost_report_id, found_report_id)
);

CREATE INDEX idx_matches_similarity ON public.potential_matches(similarity_score DESC);

ALTER TABLE public.potential_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches visible to related report owners"
    ON public.potential_matches FOR SELECT
    USING (true);

-- ------------------------------------------------------------------------------
-- 5. CLAIMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.item_reports(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    evidence_description TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'submitted' CHECK (verification_status IN (
        'submitted', 'awaiting_verification', 'verified', 'rejected', 'handover_arranged', 'recovered'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create claims under their identity"
    ON public.claims FOR INSERT
    WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Claims visible to claimant and item reporter"
    ON public.claims FOR SELECT
    USING (
        auth.uid() = claimant_id OR
        auth.uid() IN (SELECT reporter_id FROM public.item_reports WHERE id = report_id)
    );

-- ------------------------------------------------------------------------------
-- 6. CONVERSATIONS & PARTICIPANTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    related_report_id UUID REFERENCES public.item_reports(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can view their conversations"
    ON public.conversations FOR SELECT
    USING (
        id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    );

CREATE POLICY "Participants can view other members of their conversation"
    ON public.conversation_participants FOR SELECT
    USING (
        conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- 7. MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation members can read messages"
    ON public.messages FOR SELECT
    USING (
        conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    );

CREATE POLICY "Conversation members can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    related_record_id TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications read status"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. ABUSE REPORTS & MODERATION ACTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.abuse_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moderator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    action TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert abuse reports"
    ON public.abuse_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);
