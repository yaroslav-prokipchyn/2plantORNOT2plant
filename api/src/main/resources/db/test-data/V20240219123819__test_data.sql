-- Organization
INSERT INTO organization (id, name, phone, address)
VALUES ('4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16', 'Farmers United', '123-456-7890', '123 Main St, Anytown, USA'),
       ('946c6dbb-d6ba-4b2d-8add-63dfcbd09aaa', 'Green Fields Cooperative', '123-456-7890', '123 Main St, Anytown, USA'),
       ('bf6bd655-a70d-4031-82d5-07b4ca6bdc25', 'AgroTech Solutions', '123-456-7890', '123 Main St, Anytown, USA');


-- User
INSERT INTO "user" (first_name, last_name, email, roles, organization_id)
VALUES ('Yaroslav', 'Prokipchyn', 'yaroslav.prokipchyn@gmail.com', ARRAY['super_admin'::user_role], null),
       ('Anton', 'Nazaruk', 'anton.nazaruk@vitechteam.com', ARRAY['agronomist'::user_role], '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16'),
       ('Bohdan', 'Sava', 'bohdan.sava@vitechteam.com', ARRAY['admin'::user_role], '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16'),
       ('Oksana', 'Mardak', 'oksana.mardak@vitechteam.com', ARRAY['super_admin'::user_role], null),
       ('Oleksandra', 'Makhova', 'oleksandra.makhova@vitechteam.com', ARRAY['admin'::user_role], '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16'),
       ('Sofiia', 'Zahoruiko', 'sofiia.zahoruiko@vitechteam.com', ARRAY['super_admin'::user_role], null),
       ('Taras', 'Seman', 'taras.seman@vitechteam.com', ARRAY['admin'::user_role], '946c6dbb-d6ba-4b2d-8add-63dfcbd09aaa'),
       ('Viktor', 'Vakhramieiev', 'viktor.vakhramieiev@vitechteam.com', ARRAY['agronomist'::user_role], '946c6dbb-d6ba-4b2d-8add-63dfcbd09aaa'),
       ('Yaroslav', 'Prokipchyn', 'yaroslav.prokipchyn@vitechteam.com', ARRAY['agronomist'::user_role], '946c6dbb-d6ba-4b2d-8add-63dfcbd09aaa');

-- Field
INSERT INTO field (id, name, area, planted_at, crop_id, agronomist_id, organization_id)
VALUES ('489d3a71-7732-49bb-88a0-ea48a7d5389c', 'Field A', '[{"lat": 38.17317070597806,"lng": -98.50547790527344},{"lat": 38.15198505312089,"lng": -98.49123001098634},{"lat": 38.16156664168775,"lng": -98.47904205322267},{"lat": 38.17559937187648,"lng": -98.48814010620119}]', '2023-05-10', 'corn', 3, 'bf6bd655-a70d-4031-82d5-07b4ca6bdc25'),
       ('02805360-cef8-4a98-8f87-ee8085963fe1', 'Field B', '[{"lat":38.16645050694775,"lng":-98.36201190948486},{"lat":38.16327948789949,"lng":-98.36214065551759},{"lat":38.163144547859126,"lng":-98.35342884063722},{"lat":38.16658544086895,"lng":-98.35347175598146}]', '2023-04-15', 'soybean', 3, '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16'),
       ('1b8767f0-c824-4c8b-bae4-c8e3ee030913', 'Field C', '[{"lat":38.15180718749814,"lng":-98.34420204162598},{"lat":38.14853430626642,"lng":-98.34415912628175},{"lat":38.148635531598025,"lng":-98.33518981933594},{"lat":38.151874668040165,"lng":-98.33510398864748}]', '2023-06-20', 'beets', 3, '946c6dbb-d6ba-4b2d-8add-63dfcbd09aaa'),
       ('f982eaf5-dccf-49e6-b706-654e13033e56', 'Field D', '[{"lat":38.144552665133475,"lng":-98.36274147033691},{"lat":38.13004145610444,"lng":-98.3630418777466},{"lat":38.13010895677931,"lng":-98.35394382476808},{"lat":38.14445143413631,"lng":-98.35325717926027}]', '2023-05-05', 'cotton', 9, 'bf6bd655-a70d-4031-82d5-07b4ca6bdc25'),
       ('5f2f6eb3-4c14-49f0-b5e8-0cb782cc7dd2', 'Field E', '[{"lat":38.10803290917616,"lng":-98.3767318725586},{"lat":38.10539954062414,"lng":-98.3767318725586},{"lat":38.105298255322616,"lng":-98.37171077728273},{"lat":38.10810043019853,"lng":-98.37162494659425}]', '2023-07-10', 'cereal', 10, '4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16');

-- Field Status
INSERT INTO field_status (transpiration, soil_water_content, loss_of_nutrients, loss_of_water, date, field_id)
VALUES (0.8, 0.6, 0.2, 0.4, '2023-07-15', '489d3a71-7732-49bb-88a0-ea48a7d5389c'),
       (0.6, 0.5, 0.3, 0.5, '2023-07-15', '02805360-cef8-4a98-8f87-ee8085963fe1'),
       (0.7, 0.4, 0.4, 0.6, '2023-07-15', '1b8767f0-c824-4c8b-bae4-c8e3ee030913'),
       (0.9, 0.7, 0.1, 0.3, '2023-07-15', 'f982eaf5-dccf-49e6-b706-654e13033e56'),
       (0.5, 0.3, 0.5, 0.7, '2023-07-15', '5f2f6eb3-4c14-49f0-b5e8-0cb782cc7dd2');

-- Field Status Forecast
INSERT INTO field_status_forecast (transpiration, precipitation, soil_water_content, loss_of_nutrients, loss_of_water, date,
                                   field_id)
VALUES (0.7, 0.2, 0.5, 0.4, 0.6, '2023-07-20', '489d3a71-7732-49bb-88a0-ea48a7d5389c'),
       (0.5, 0.4, 0.4, 0.3, 0.7, '2023-07-20', '02805360-cef8-4a98-8f87-ee8085963fe1'),
       (0.6, 0.3, 0.6, 0.5, 0.5, '2023-07-20', '1b8767f0-c824-4c8b-bae4-c8e3ee030913'),
       (0.8, 0.1, 0.7, 0.2, 0.4, '2023-07-20', 'f982eaf5-dccf-49e6-b706-654e13033e56'),
       (0.4, 0.5, 0.3, 0.6, 0.8, '2023-07-20', '5f2f6eb3-4c14-49f0-b5e8-0cb782cc7dd2');

-- Field Action
INSERT INTO field_action (action_type, details, date, field_id)
VALUES ('seed', '{"seed_type": "GMO Corn"}', '2023-05-10', '489d3a71-7732-49bb-88a0-ea48a7d5389c'),
       ('irrigate', '{"value": "5,5"}', '2023-05-15', '02805360-cef8-4a98-8f87-ee8085963fe1'),
       ('irrigate', '{"value": "6,7"}', '2023-05-16', '02805360-cef8-4a98-8f87-ee8085963fe1'),
       ('create', '{"method": "Plowing", "area": "5 acres"}', '2023-06-20', '1b8767f0-c824-4c8b-bae4-c8e3ee030913'),
       ('seed', '{"seed_type": "Rice"}', '2023-05-05', 'f982eaf5-dccf-49e6-b706-654e13033e56'),
       ('renamed', '{"old_name": "Field XYZ", "new_name": "Field E"}', '2023-07-10', '5f2f6eb3-4c14-49f0-b5e8-0cb782cc7dd2');

-- Thresholds for Corn
INSERT INTO threshold (organization_id, type, transpiration, precipitation, soil_water_content, loss_of_nutrients, loss_of_water)
VALUES ('4fc45aea-3fd6-4a1d-aaf1-c3345ea4df16', 'critical', 0.3, 0.1, 0.2, 0.8, 0.9),
       ('bf6bd655-a70d-4031-82d5-07b4ca6bdc25', 'surplus', 0.9, 0.7, 0.8, 0.2, 0.3);
