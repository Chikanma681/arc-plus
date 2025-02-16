CREATE TABLE IF NOT EXISTS "arc-app_nfc_cards" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer,
	"card_number" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "arc-app_nfc_cards_card_number_unique" UNIQUE("card_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "arc-app_transactions" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer,
	"card_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar,
	"stripe_payment_id" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "arc-app_users" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"email" varchar(256),
	"first_name" varchar(256),
	"last_name" varchar(256),
	CONSTRAINT "arc-app_users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "arc-app_wallet" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer,
	"balance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arc-app_nfc_cards" ADD CONSTRAINT "arc-app_nfc_cards_user_id_arc-app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."arc-app_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arc-app_transactions" ADD CONSTRAINT "arc-app_transactions_user_id_arc-app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."arc-app_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arc-app_transactions" ADD CONSTRAINT "arc-app_transactions_card_id_arc-app_nfc_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."arc-app_nfc_cards"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arc-app_wallet" ADD CONSTRAINT "arc-app_wallet_user_id_arc-app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."arc-app_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "arc-app_nfc_cards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "card_number_idx" ON "arc-app_nfc_cards" USING btree ("card_number");