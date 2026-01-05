import "dotenv/config"; // MUST BE FIRST

import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECERET, SALT_ROUNDS, Plain_Text_Secret} from "@repo/backend-common/secret"
import {CreateUserSchema, CreateRoomSchema, SignInSchema} from "@repo/common/types"
import {db} from "@repo/db/db"
import {user, room} from "@repo/db/schema"
import bcrypt from "bcryptjs";
import { use } from "react";
import { da, id } from "zod/locales";


const app = express();
const port = 3001;

app.use(cors())
app.use(express.json())


app.get("/",async(req,res) => {

   try {
    
    //  const data = await prisma.user.findMany()

    const users = await db.select().from(user);

    return res.json({
        users,
        message: "Data"
    })
   } catch (error) {
    console.log(error)
   }
    
})

app.put("/sign-in",async(req,res) => {
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
})

app.post("/sign-up",async(req,res) => {

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
})


app.post("/create-room",middleware,async(req,res) => {
    //db  call create a room

    const data = CreateRoomSchema.safeParse(req.body)

    if(!req.userId){
        return res.json({
            message: "Unauthorized access"
        }).status(403)
    }

    if(!data.success){
        return res.json({
            message: "Invalid inputs"
        }).status(403)
    }

    const roomExist = await db.query.room.findFirst({
        where: (room, {eq}) => eq(room.slug, data.data.name)
    })

    if(roomExist){
        return res.json({
            mesaage: "A room with this name already exist try with some other name",
            roomId: roomExist.id
        }).status(403)
    }

    const newRoom = await db.insert(room).values({
        slug: data.data.name,
        adminId: req.userId
    })

    return res.json({
        roomId: newRoom.oid
    })
})



app.listen(port, () => {
    console.log("Backend App started at port " +port )
})