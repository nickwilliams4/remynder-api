ALTER TABLE notes 
  DROP COLUMN remynder;

ALTER TABLE notes
  ADD COLUMN remynder TIMESTAMP DEFAULT now() NOT NULL;