import {email, z} from "zod"

export const CreateUserSchema = z.object({
    email: z.email(),
    password: z.string(),
    name: z.string()
})

export const SignInSchema =  z.object({
    email: z.string(),
    password: z.string()
})

export const CreateRoomSchema =  z.object({
    name: z.string()
})

export const CreateCanvasSchema =  z.object({
    name: z.string()
})

export const AddUsersToCanvasSchema =  z.object({
    memberId: z.string().nullable().default(null),
    email: z.string().nullable().default(null),
})

export type Shapes = {
    id?: string;        // DB id (after save)
  tempId?: string;
    type: 'rectangle' ;
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id:string
    type: 'circle' ;
    x: number;
    y: number;
    radius: number;
} | {
    id:string
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    id:string
    type: "text";
    x: number;
    y: number;
    text: string
    fontSize: number;
} | {
    id: string
    type: "pencil"
    points: { x: number; y: number }[]
}
