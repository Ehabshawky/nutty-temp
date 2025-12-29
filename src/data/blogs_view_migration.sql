-- Create a view that returns blogs with dynamic comment counts
CREATE OR REPLACE VIEW public_blogs AS
SELECT
  b.id,
  b.title_en,
  b.title_ar,
  b.excerpt_en,
  b.excerpt_ar,
  b.content_en,
  b.content_ar,
  b.author_en,
  b.author_ar,
  b.category,
  b.image,
  b.featured,
  b.views,
  b.read_time_en,
  b.read_time_ar,
  b.tags_en,
  b.tags_ar,
  b.created_at,
  b.updated_at,
  (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id AND c.is_approved = true) as comments_count
FROM blogs b;

-- Grant access to public (essential since it's a view)
GRANT SELECT ON public_blogs TO anon;
GRANT SELECT ON public_blogs TO authenticated;
GRANT SELECT ON public_blogs TO service_role;
