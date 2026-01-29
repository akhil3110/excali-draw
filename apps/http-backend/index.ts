import "dotenv/config"; // MUST BE FIRST

import express from "express"
import cors from "cors"
import { middleware } from "./middleware";
import { getAllUsersRoute, userSignInRoute, userSignOutRoute, userSignUpRoute } from "./routes/userRoutes";
import { createRoomRoute, getAllRoomsRoute, getRoomRoute } from "./routes/roomRoutes";
import { getRoomChatsRoute } from "./routes/chatRoutes";
import cookieParser from "cookie-parser";
import { AddUsersToCanvasRoute, createCanvasRoute, deleteCanvasRoute, getAllCanvasRoute, getCanvasByIdRoute } from "./routes/canvasRoutes";
import { createShapesRoute, deleteAllShapesInCanvasRoute, deleteShapesByIdRoute, getAllShapesInCanvasRoute, moveShapeByIdRoute } from "./routes/shapesRoute";


const app = express();
const port = 3001;

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3002",
        "https://ecdraw.akhilparmar.com",
        "http://ecdraw.akhilparmar.com",
        "http://54.83.206.102:3000",
        "https://54.83.206.102:3000",
        "https://backend.ecdraw.akhilparmar.com",
        "http://backend.ecdraw.akhilparmar.com",
        "http://54.83.206.102:3002",
        "https://54.83.206.102:3002",
    ],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())


//users routes
app.get("/",getAllUsersRoute)
app.put("/sign-in",userSignInRoute)
app.post("/sign-up",userSignUpRoute)
app.post("/sign-out", userSignOutRoute)

//rooms routes
app.post("/create-room",middleware,createRoomRoute)
app.get("/rooms", middleware,getAllRoomsRoute)
app.get("/rooms/:roomId",getRoomRoute )


//chat routes
app.get("/chats/:roomId",getRoomChatsRoute)

//canvas routes
app.post("/create-canvas",middleware,createCanvasRoute)
app.get("/canvas", middleware,getAllCanvasRoute)
app.delete("/canvas/:id",middleware,deleteCanvasRoute)
app.put("/canvas/addUser/:id",middleware,AddUsersToCanvasRoute)
app.get("/canvas/:id",middleware,getCanvasByIdRoute)

//shapes routes
app.post("/shapes",middleware,createShapesRoute)
app.get("/shapes/:id",middleware,getAllShapesInCanvasRoute)
app.delete("/shapes/:id",middleware,deleteShapesByIdRoute)
app.put("/shapes/:id",middleware,moveShapeByIdRoute)
app.delete("/shapes/deleteAll/:id",middleware,deleteAllShapesInCanvasRoute)


app.listen(port, () => {
    console.log("Backend App started at port " +port )
})