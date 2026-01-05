
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm';

export const user = pgTable('user',{
    id: text('id').primaryKey().$defaultFn(() => createId()),
    email: varchar({length:255}).notNull().unique(),
    name: varchar({length:255}).notNull(),
    password: varchar({length:255}).notNull(),
    photo: varchar({length:255}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})


export const room = pgTable('roon', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar({length:255}).notNull().unique(),
    adminId: text('admin_id').notNull().references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})


export const chat = pgTable('chat', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    message: text('message').notNull(),
    userId: text('user_id').notNull().references(() => user.id),
    roomId: integer('room_id').notNull().references(() => room.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})

export const userRelations = relations(user,({many}) =>({
    rooms: many(room),
    chat: many(chat)
}))

export const roomRelation = relations(room,({one,many}) => ({
    admin: one(user, {
        fields: [room.id],
        references: [user.id]
    }),
    chats: many(chat)
}))

export const chatRelation = relations(chat, ({one,many}) => ({
    user: one(user, {
        fields: [chat.id],
        references: [user.id]
    }),
    room: one(room,{
        fields: [chat.roomId],
        references: [room.id]
    })
}))
