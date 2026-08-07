-- Dazi MVP: run once after 09.
-- Lets authenticated users edit only their own profile.

DROP POLICY IF EXISTS users_update_self ON public.users;
CREATE POLICY users_update_self
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
