
alter table field add column attributes json not null default '{}'::json;

alter table field alter column name drop not null;
alter table field alter column planted_at drop not null;
alter table field alter column crop_id drop not null;
alter table field alter column agronomist_id drop not null;

alter table field alter column organization_id set not null;
