import { JWT_SECERET, SALT_ROUNDS } from "@repo/backend-common/secret";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { user } from "@repo/db/schema";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function getAllUsersRoute(req: Request, res: Response) {
    try {
        const users = await db.select().from(user);
    
        return res.json({
            users,
            message: "Data"
        })
       } catch (error) {
        console.log(error)
       }
}

export async function userSignInRoute(req: Request, res: Response){
    const userDetails = SignInSchema.safeParse(req.body)
        
        if(!userDetails.success){
            return res.json({
                message: "Invalid inputs"
            }).status(403)
        }
    
        const UserExist = await db.query.user.findFirst({
            where: (user, {eq}) => eq(user.email,userDetails.data.email,)
        })
    
        if(!UserExist){
            return res.json({
                message: "User Does not exist. Please signup !"
            }).status(403)
        }
    
        const passwordCompare = bcrypt.compare(userDetails.data.password,UserExist.password)
    
        if(!passwordCompare){
            return res.json({
                message: "Incorect password! please enter correct password"
            })
        }
        
        
    
        // check user password and get userId   
        const token = jwt.sign(UserExist.id,JWT_SECERET)
    
        return res.json({
            token
        })
}

export async function userSignUpRoute(req: Request, res: Response){
    try {
        const userDetails = CreateUserSchema.safeParse(req.body)
    
        if(!userDetails.success){
            return res.json({
                message: "invalid inputs"
            }).status(403)
        }
    
        const userExist = await db.query.user.findFirst({
           where: (user, {eq}) => eq(user.email,userDetails.data.email)
        })
    
        if(userExist){
            return res.json({
                message: "User already exists"
            }).status(403)
        }
    
        const bcryptPassword = await bcrypt.hash(userDetails.data.password,SALT_ROUNDS)
    
        const NewUser =  await db.insert(user).values({
            email: userDetails.data.email,
            name: userDetails.data.name,
            password: bcryptPassword
        })
    
        
        const token = jwt.sign(NewUser.oid.toString(),JWT_SECERET)
    
        return res.json({
            token: token
        })
       } catch (error) {
        console.log(error)
       }
}