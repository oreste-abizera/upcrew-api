//LOAD ENV VARS
const dotenv = require("dotenv")
dotenv.config({ path: "./config/config.env" })

const express = require("express")
require("./config/db")
const morgan = require("morgan")
const colors = require("colors")
const cors = require("cors")
const ErrorHandler = require("./middlewares/error")

const app = express()


//middlewares
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

//routes
const UsersRoute = require('./routes/Users')

app.get("/", (req, res) => {
  res.send("welcome to upcrew_api")
})

app.use("/api/v1/users", UsersRoute)


app.use(ErrorHandler)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))


//handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`${err.name}: ${err.message}`.red)
  // server.close(() => {
  //   process.exit(1)
  // })
})