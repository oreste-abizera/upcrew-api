//LOAD ENV VARS
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const path = require("path");
const express = require("express");
require("./config/db");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const ErrorHandler = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(fileupload());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
const UsersRoute = require("./routes/Users");
const AuthRoute = require("./routes/Auth");
const CoursesRoute = require("./routes/Courses");
const ClassesRoute = require("./routes/Classes");
const AssignmentsRoute = require("./routes/Assignments");
const QuestionsRoute = require("./routes/Questions");
const ResultsRoute = require("./routes/Results");
const MessagesRoute = require("./routes/Messages");

app.get("/", (req, res) => {
  res.send("welcome to upcrew_api");
});

app.use("/api/v1/users", UsersRoute);
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/courses", CoursesRoute);
app.use("/api/v1/classes", ClassesRoute);
app.use("/api/v1/assignments", AssignmentsRoute);
app.use("/api/v1/questions", QuestionsRoute);
app.use("/api/v1/results", ResultsRoute);
app.use("/api/v1/messages", MessagesRoute);

app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`${err.name}: ${err.message}`.red);
  // server.close(() => {
  //   process.exit(1)
  // })
});
