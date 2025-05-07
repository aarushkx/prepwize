import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const interview = pgTable("interview", {
    id: serial("id").primaryKey(),
    jsonResponse: text("jsonResponse").notNull(),
    jobPosition: varchar("jobPosition").notNull(),
    jobDescription: text("jobDescription").notNull(),
    jobExperience: text("jobExperience").notNull(),
    createdBy: varchar("createdBy").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    mockId: varchar("mockId").notNull(),
});

export const userAnswer = pgTable("userAnswer", {
    id: serial("id").primaryKey(),
    mockIdRef: varchar("mockIdRef").notNull(),
    question: varchar("question").notNull(),
    correctAnswer: text("correctAnswer"),
    userAnswer: text("userAnswer"),
    feedback: text("feedback"),
    rating: varchar("rating"),
    userEmail: varchar("userEmail").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});
