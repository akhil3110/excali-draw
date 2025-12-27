import express from "express"

const app = express();
const port = 3001;

app.use(express.json())

app.get("/",(req,res) => {
    res.send("Hello world")
})

app.listen(port, () => {
    console.log("Backend App started at port " +port )
})