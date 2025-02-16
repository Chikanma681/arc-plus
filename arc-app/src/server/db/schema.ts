// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  pgEnum,
  timestamp,
  numeric,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `arc-app_${name}`);

export const users = createTable(
  "users",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).unique().notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
  }
);

export const nfcCards = createTable("nfc_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  cardNumber: varchar("card_number", { length: 32 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},
(table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  cardNumberIdx: index("card_number_idx").on(table.cardNumber),
}));

export const transactions = createTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  cardId: integer("card_id").references(() => nfcCards.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status"),
  stripePaymentId: varchar("stripe_payment_id", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wallet = createTable("wallet", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  balance: numeric("balance", { precision: 10, scale: 2 }).default('0').notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = createTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});