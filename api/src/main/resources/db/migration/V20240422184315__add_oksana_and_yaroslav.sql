ALTER TABLE "user"
    ADD CONSTRAINT unique_email UNIQUE (email);

INSERT INTO "user" (first_name, last_name, email, roles)
VALUES
    ('Oksana', 'Mardak', 'oksana.mardak@vitechteam.com', ARRAY['super_admin'::user_role]),
    ('Yaroslav', 'Prokipchyn', 'yaroslav.prokipchyn@vitechteam.com', ARRAY['super_admin'::user_role])
ON CONFLICT (email) DO NOTHING;
