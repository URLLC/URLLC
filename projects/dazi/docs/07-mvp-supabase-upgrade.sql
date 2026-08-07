-- Dazi MVP: run once in Supabase SQL Editor after the base schema.
-- Safe to rerun. This enables the paths used by login, activity publishing,
-- contact-request handling and profile editing.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1)),
    ''
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "chat_update_receiver" ON public.chat_requests;
CREATE POLICY "chat_update_receiver"
ON public.chat_requests FOR UPDATE
USING (auth.uid() = to_user_id)
WITH CHECK (auth.uid() = to_user_id);

CREATE INDEX IF NOT EXISTS sessions_city_created_at_idx
  ON public.sessions (city, created_at DESC);
CREATE INDEX IF NOT EXISTS session_members_session_id_idx
  ON public.session_members (session_id, joined_at);
CREATE INDEX IF NOT EXISTS chat_requests_receiver_created_at_idx
  ON public.chat_requests (to_user_id, created_at DESC);

ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_max_people_check;
ALTER TABLE public.sessions
  ADD CONSTRAINT sessions_max_people_check CHECK (max_people BETWEEN 2 AND 20);
