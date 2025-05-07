CREATE TABLE "interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonResponse" text NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDescription" text NOT NULL,
	"jobExperience" text NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"mockId" varchar NOT NULL
);
