CREATE TABLE IF NOT EXISTS irrigation (
    id SERIAL PRIMARY KEY,
    field_id UUID NOT NULL,
    date DATE NOT NULL,
    value DOUBLE PRECISION NOT NULL
);

INSERT INTO irrigation (date, field_id, value)
SELECT
    date,
    field_id,
    CAST(REPLACE(json_extract_path_text(details, 'value'), ',', '.') AS double precision) AS value
FROM
    field_action
WHERE
    action_type = 'irrigate'
  AND json_extract_path_text(details, 'value') IS NOT NULL;

drop table field_action;
