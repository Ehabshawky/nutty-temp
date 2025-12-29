-- Add screenshot_url column to testimonials table
ALTER TABLE testimonials 
ADD COLUMN screenshot_url TEXT;

-- Verify
-- SELECT * FROM testimonials LIMIT 1;
