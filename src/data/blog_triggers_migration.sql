-- Function to update comments count on approval/deletion
CREATE OR REPLACE FUNCTION update_blog_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.is_approved = true AND OLD.is_approved = false) THEN
    -- Comment approved: increment
    UPDATE blogs SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
  ELSIF (TG_OP = 'UPDATE' AND NEW.is_approved = false AND OLD.is_approved = true) THEN
    -- Comment un-approved: decrement
    UPDATE blogs SET comments_count = GREATEST(0, comments_count - 1) WHERE id = NEW.blog_id;
  ELSIF (TG_OP = 'DELETE' AND OLD.is_approved = true) THEN
    -- Approved comment deleted: decrement
    UPDATE blogs SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.blog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_update_blog_comments_count ON comments;
CREATE TRIGGER trg_update_blog_comments_count
AFTER UPDATE OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_comments_count();

-- Grant execute on RPC
GRANT EXECUTE ON FUNCTION increment_blog_view(BIGINT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION increment_blog_view(BIGINT) TO anon;
GRANT EXECUTE ON FUNCTION increment_blog_view(BIGINT) TO authenticated;
