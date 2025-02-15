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
  uuid,
  varchar,
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
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    userId: varchar("user_id", { length: 256 }).unique().notNull(),
    email: varchar("email", { length: 256 }),
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
  }
);
export const nfcCards = createTable("nfc_cards", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  cardNumber: varchar("card_number", { length: 32 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},
(table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  cardNumberIdx: index("card_number_idx").on(table.cardNumber),
}));

const transactionStatus = pgEnum('transaction_status', [
  'pending',
  'completed',
  'failed',
  'refunded'
]);


export const transactions = createTable("transactions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  cardId: uuid("card_id").references(() => nfcCards.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: transactionStatus("status").default('pending'),
  stripePaymentId: varchar("stripe_payment_id", { length: 256 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wallet = createTable("wallet", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  balance: numeric("balance", { precision: 10, scale: 2 }).default('0').notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

