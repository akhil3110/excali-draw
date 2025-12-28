import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken";
import { JWT_SECERET } from "./config";
import { middleware } from "./middleware";

const app = express();
const port = 3001;

app.use(express.json())
app.use(cors())

app.get("/",(req,res) => {

    res.send("Hello world")
    
})

app.put("/sign-in",(req,res) => {
    const {email, password} = req.body

    const userId = 1;
    const token  = jwt.sign({
        userId
    },JWT_SECERET)

    res.json({token})
})

app.post("/sign-up",(req,res) => {
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
    console.log("Backend App started at port " +port )
})