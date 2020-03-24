DROP TABLE IF EXISTS notes;


CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    created TIMESTAMP DEFAULT now() NOT NULL,
    remynder TEXT NOT NULL
);