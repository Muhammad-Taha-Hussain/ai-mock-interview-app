// schema.ts
// import { drizzle } from "drizzle-orm/node-postgres";
import { integer, pgTable, varchar, serial, text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockinterview', {
  id: serial('id').primaryKey(),
  jsonmockresponse: text('jsonmockresponse').notNull(),
  jobposition: varchar('jobposition', { length: 100 }).notNull(),
  jobdesc: varchar('jobdesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdby: varchar('createdby').notNull(),
  createdat: varchar('createdat').notNull(),
  mockid: varchar('mockid').notNull()
})

export const userAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockidRef: varchar('mockid').notNull(),
  question: varchar('question').notNull(),
  correctAnswer: text('correctAnswer'),
  userAnswer: text('userAnswer'),
  feedback: text('feedback'),
  rating: varchar('rating').notNull(),
  userEmail: varchar('userEmail').notNull(),
  createdat: varchar('createdat').notNull(),
})


