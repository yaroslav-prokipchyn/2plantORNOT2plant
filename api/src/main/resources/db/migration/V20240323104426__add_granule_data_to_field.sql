alter table field add column granule json default '{}'::JSON;

alter table organization add column last_import_date date default '1980-01-01'; --some initial past date

drop table field_status;
drop table field_status_forecast;
