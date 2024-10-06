-- Crop
INSERT INTO crop (id, name)
VALUES ('corn', 'Corn'),
       ('soybean', 'Soybean'),
       ('beets', 'Beets'),
       ('cotton', 'Cotton'),
       ('cereal', 'Cereal'),
       ('potatoes', 'Potatoes');

-- User
INSERT INTO "user" (first_name, last_name, email, roles)
VALUES ('Val', 'Kovalsky', 'val@naveanalytics.com', ARRAY['super_admin'::user_role]);
