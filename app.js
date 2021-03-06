const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const expAutoSan = require("express-autosanitizer");
const connectToDB = require("./utils/connect_db_middleware");

const apiRouter = require("./routes/apiRoutes");

const app = express();

app.use(connectToDB);

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(expAutoSan.all);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  // res.status(err.status || 500
});

module.exports = app;
