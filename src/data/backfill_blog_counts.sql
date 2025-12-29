-- Calculate and update comment counts for all blogs
UPDATE blogs b
SET comments_count = (
  SELECT COUNT(*)
  FROM comments c
  WHERE c.blog_id = b.id AND c.is_approved = true
);
