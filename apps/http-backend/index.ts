import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECERET} from "@repo/backend-common/secret"
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/prismaClient"

const app = express();
const port = 3001;

app.use(express.json())
app.use(cors())

app.get("/",(req,res) => {

    res.send("Hello world")
    
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

app.post("/sign-up",(req,res) => {

    const data = CreateUserSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorect inputs"
        })
    }

    res.json({
        userId: 123
    })
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