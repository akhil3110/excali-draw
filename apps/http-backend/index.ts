import dotenv from "dotenv";

import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECERET} from "@repo/backend-common/secret"
import {CreateUserSchema} from "@repo/common/types"
import {db} from "@repo/db/db"
import {user} from "@repo/db/schema"

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

app.put("/sign-in",(req,res) => {
    const {email, password} = req.body



    // check user password and get userId   
    const userId = 1;
    const token  = jwt.sign({
        userId
    },JWT_SECERET)

    res.json({token})
})

app.post("/sign-up",async(req,res) => {

   try {
    const userDetails = CreateUserSchema.safeParse(req.body)

    console.log("b")

    if(!userDetails.success){
        return res.json({
            message: "invalid inputs"
        }).status(403)
    }

    
//    const user = await prisma.user.create({
//         data: {
//             email: userDetails.data.email,
//             password: userDetails.data.password,
//             name: userDetails.data.name
//         }
//    })

    return res.json({
        userId: "user.id"
    })
   } catch (error) {
    console.log(error)
   }
})


app.post("/create-room",middleware,(req,res) => {
    //db  call create a room

    res.json({
        roomId: 1
    })
})



app.listen(port, () => {
    console.log(JWT_SECERET)
    console.log("Backend App started at port " +port )
})