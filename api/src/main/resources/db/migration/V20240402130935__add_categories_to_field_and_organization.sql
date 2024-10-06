alter table field add column categories json default '[]'::JSON;

alter table organization add column categories json default '[]'::JSON;
