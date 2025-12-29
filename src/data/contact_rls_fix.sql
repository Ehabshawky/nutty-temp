-- Drop existing policy
drop policy if exists "Anyone can insert messages" on contact_messages;

-- Recreate policy with explicit role
create policy "Enable insert for everyone"
  on contact_messages
  for insert
  to public
  with check (true);

-- Ensure public (anon) has insert permissions
grant insert on table contact_messages to anon;
grant insert on table contact_messages to authenticated;
