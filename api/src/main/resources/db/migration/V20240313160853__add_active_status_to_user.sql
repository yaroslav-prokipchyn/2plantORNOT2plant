-- add active and deleted status to users
ALTER TABLE "user"
    ADD COLUMN active BOOLEAN DEFAULT TRUE,
    ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
