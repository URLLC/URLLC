-- Dazi MVP: run once after 07 and 08.
-- Keeps activity participant counts correct and prevents concurrent overbooking.

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS current_people integer NOT NULL DEFAULT 0;

UPDATE public.sessions AS session
SET current_people = (
  SELECT COUNT(*)::integer
  FROM public.session_members AS member
  WHERE member.session_id = session.id
);

CREATE OR REPLACE FUNCTION public.enforce_session_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  participant_limit integer;
  participant_count integer;
BEGIN
  SELECT max_people, current_people
  INTO participant_limit, participant_count
  FROM public.sessions
  WHERE id = NEW.session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'activity_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF participant_count >= participant_limit THEN
    RAISE EXCEPTION 'activity_full' USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_session_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_session_id uuid;
BEGIN
  target_session_id := COALESCE(NEW.session_id, OLD.session_id);

  UPDATE public.sessions
  SET current_people = (
    SELECT COUNT(*)::integer
    FROM public.session_members
    WHERE session_id = target_session_id
  )
  WHERE id = target_session_id;

  IF TG_OP = 'UPDATE' AND OLD.session_id IS DISTINCT FROM NEW.session_id THEN
    UPDATE public.sessions
    SET current_people = (
      SELECT COUNT(*)::integer
      FROM public.session_members
      WHERE session_id = OLD.session_id
    )
    WHERE id = OLD.session_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS session_members_capacity_guard ON public.session_members;
CREATE TRIGGER session_members_capacity_guard
  BEFORE INSERT ON public.session_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_session_capacity();

DROP TRIGGER IF EXISTS session_members_sync_count ON public.session_members;
CREATE TRIGGER session_members_sync_count
  AFTER INSERT OR DELETE OR UPDATE OF session_id ON public.session_members
  FOR EACH ROW EXECUTE FUNCTION public.sync_session_member_count();
