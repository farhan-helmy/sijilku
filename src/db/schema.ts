import { text, timestamp, pgTable, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export const userType = pgEnum("user_type", ["ADMIN", "USER"]);

export const userSubscriptionTier = pgEnum("user_subscription_tier", [
  "FREE",
  "BASIC",
  "PREMIUM",
]);

export const user = pgTable("user", {
  id: text("id")
    .$defaultFn(() => ulid())
    .primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  profile_picture: text("profile_picture"),
  type: userType("user_type"),
  subscriptionTier: userSubscriptionTier("user_subscription_tier"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const template = pgTable("template", {
  id: text("id")
    .$defaultFn(() => ulid())
    .primaryKey(),
  userId: text("user_id").references(() => user.id),
  name: text("name").notNull(),
  backgroundTemplate: text("background_template").notNull(),
  textElements: jsonb("text_elements").notNull(),
  imageDimensions: jsonb("image_dimensions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Template = typeof template.$inferSelect;
export type NewTemplate = typeof template.$inferInsert;