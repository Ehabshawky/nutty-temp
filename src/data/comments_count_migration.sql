-- Computed column for comment count
CREATE OR REPLACE FUNCTION comments_count(article_row articles)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)
  FROM comments
  WHERE article_id = article_row.id
  AND is_approved = true;
$$;
