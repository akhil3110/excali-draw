import "dotenv/config"; // MUST BE FIRST

import express from "express"
import cors from "cors"
import { middleware } from "./middleware";
import { getAllUsersRoute, userSignInRoute, userSignUpRoute } from "./routes/userRoutes";
import { createRoomRoute, getAllRoomsRoute, getRoomRoute } from "./routes/roomRoutes";
import { getRoomChatsRoute } from "./routes/chatRoutes";


const app = express();
const port = 3001;

app.use(cors())
app.use(express.json())


//users routes
app.get("/",getAllUsersRoute)
app.put("/sign-in",userSignInRoute)
app.post("/sign-up",userSignUpRoute)

//rooms routes
app.post("/create-room",middleware,createRoomRoute)
app.get("/rooms", middleware,getAllRoomsRoute)
app.get("/rooms/:roomId",getRoomRoute )


//chat routes
app.get("/chats/:roomId",getRoomChatsRoute)


app.listen(port, () => {
    console.log("Backend App started at port " +port )
})