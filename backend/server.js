require("dotenv").config()
const app = require("./app")
const connectDb = require("./database/db")



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
connectDb()
