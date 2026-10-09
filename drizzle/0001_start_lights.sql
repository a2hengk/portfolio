CREATE TABLE "reaction_rate_limits" (
	"ip_hash" text PRIMARY KEY NOT NULL,
	"last_submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reaction_scores" (
	"id" text PRIMARY KEY NOT NULL,
	"name_key" varchar(32) NOT NULL,
	"display_name" varchar(16) NOT NULL,
	"reaction_ms" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reaction_scores_name_key_unique" UNIQUE("name_key")
);
--> statement-breakpoint
CREATE INDEX "reaction_scores_reaction_ms_idx" ON "reaction_scores" USING btree ("reaction_ms");