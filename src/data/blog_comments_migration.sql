-- Add blog_id to comments table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS blog_id BIGINT REFERENCES blogs(id) ON DELETE CASCADE;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);

-- Update constraint to ensure either article_id or blog_id is present (optional but good practice)
-- ALTER TABLE comments ADD CONSTRAINT check_target CHECK (
--   (article_id IS NOT NULL AND blog_id IS NULL) OR
--   (article_id IS NULL AND blog_id IS NOT NULL)
-- );

-- Ensure RLS allows public to select comments for blogs
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
CREATE POLICY "Public can view approved comments"
  ON comments FOR SELECT
  USING (is_approved = true);

-- Helper function for blog views (optional, mirroring article views)
CREATE OR REPLACE FUNCTION increment_blog_view(blog_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs
  SET views = COALESCE(views, 0) + 1
  WHERE id = blog_id;
END;
$$;
