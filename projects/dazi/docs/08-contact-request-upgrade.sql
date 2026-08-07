-- Dazi MVP: run once after 07-mvp-supabase-upgrade.sql.
-- Makes the "想聊" action idempotent: one request per pair per activity.

CREATE UNIQUE INDEX IF NOT EXISTS chat_requests_unique_sender_receiver_session_idx
  ON public.chat_requests (from_user_id, to_user_id, session_id);
