-- add record to user table
INSERT INTO "user" (first_name, last_name, email, roles, organization_id)
VALUES ('Ben', 'Sparrow', 'ben@sparrow.dev', ARRAY['admin'::user_role], '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16')
