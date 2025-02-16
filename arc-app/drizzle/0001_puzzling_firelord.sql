ALTER TABLE "arc-app_nfc_cards" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "arc-app_transactions" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "arc-app_users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "arc-app_wallet" ALTER COLUMN "id" SET DATA TYPE serial;