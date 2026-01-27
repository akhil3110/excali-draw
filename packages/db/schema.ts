
import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
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

export const canvas = pgTable('canvas',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length:255}).notNull(),
    usersId: text('user_id').references(() => user.id),
    adminId: text('admin_id').notNull().references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})

export const shapes = pgTable('shapes',{
    id: text("id").primaryKey(),
    canvasId: integer('canvas_id').notNull().references(() => canvas.id,{onDelete:'cascade'}),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    type: varchar({length:255}).notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})
export const canvasUsers = pgTable('canvas_users',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    canvasId: integer('canvas_id').notNull().references(() => canvas.id, { onDelete: 'cascade' }),
    memberId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const userRelations = relations(user,({many}) =>({
    rooms: many(room),
    chat: many(chat)
}))

export const roomRelation = relations(room,({one,many}) => ({
    admin: one(user, {
        fields: [room.adminId],
        references: [user.id]
    }),
    chats: many(chat)
}))

export const chatRelation = relations(chat, ({one,many}) => ({
    user: one(user, {
        fields: [chat.userId],
        references: [user.id]
    }),
    room: one(room,{
        fields: [chat.roomId],
        references: [room.id]
    })
}))



export const canvasRelation = relations(canvas, ({one,many}) => ({
    admin: one(user, {
        fields: [canvas.adminId],
        references: [user.id]
    }),
    canvasUsers: many(canvasUsers)
}))

export const canvasUserRelation = relations(canvasUsers,({one}) => ({
    canvas: one(canvas,{
        fields: [canvasUsers.canvasId],
        references: [canvas.id]
    }),
    user: one(user,{
        fields: [canvasUsers.memberId],
        references: [user.id]
    })
}))

export const shapesRelation = relations(shapes,({one}) => ({
    canvas: one(canvas, {
        fields: [shapes.canvasId],
        references: [canvas.id]
    }),
    user: one(user,{
        fields: [shapes.userId],
        references: [user.id]
    })
}))
