CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE organization (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  phone VARCHAR,
  address VARCHAR
);

CREATE TABLE crop (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'agronomist');

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  roles user_role[] NOT NULL,
  organization_id uuid REFERENCES organization(id)
);

CREATE TABLE field (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  area json NOT NULL,
  planted_at date NOT NULL,
  crop_id VARCHAR REFERENCES crop(id),
  agronomist_id INTEGER REFERENCES "user"(id),
  organization_id uuid REFERENCES organization(id)
);

CREATE TABLE field_status (
  id SERIAL PRIMARY KEY,
  transpiration float NOT NULL,
  soil_water_content float NOT NULL,
  loss_of_nutrients float NOT NULL,
  loss_of_water float NOT NULL,
  date date NOT NULL,
  field_id uuid REFERENCES field(id)
);

CREATE TABLE field_status_forecast (
  id SERIAL PRIMARY KEY,
  transpiration float NOT NULL,
  precipitation float,
  soil_water_content float NOT NULL,
  loss_of_nutrients float NOT NULL,
  loss_of_water float NOT NULL,
  date date NOT NULL,
  field_id uuid REFERENCES field(id)
);
CREATE TYPE field_action_type AS ENUM ('create', 'delete', 'seed', 'irrigate', 'renamed');

CREATE TABLE field_action (
  id SERIAL PRIMARY KEY,
  action_type field_action_type NOT NULL,
  details json,
  date date NOT NULL,
  field_id uuid REFERENCES field(id)
);

CREATE TYPE threshold_type AS ENUM ('critical', 'warning', 'normal', 'surplus');

CREATE TABLE threshold (
  organization_id uuid REFERENCES organization(id),
  type threshold_type NOT NULL,
  transpiration float NOT NULL,
  precipitation float NOT NULL,
  soil_water_content float NOT NULL,
  loss_of_nutrients float NOT NULL,
  loss_of_water float NOT NULL,
  constraint unique_organization_type unique (organization_id, type)

);

