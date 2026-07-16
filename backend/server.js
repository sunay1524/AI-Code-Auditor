require("dotenv").config()
const app = require("./app")
const connectDb = require("./database/db")



app.listen(3001,()=>{
    console.log("Listening")
})
connectDb()

