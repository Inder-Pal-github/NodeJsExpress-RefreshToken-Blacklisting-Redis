const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const { authRouter } = require("./Routes/Auth.routes");
const { verifyAccessToken, signRefreshToken } = require("./helpers/jwt.mongodb");
require("dotenv").config();
require("./helpers/init_mongodb");
const port = process.env.PORT || 8080;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/",verifyAccessToken, async (req, res) => {
  console.log(req.payload);
  res.send("API");
});

app.use("/auth", authRouter);

// handle errors here
app.use(async (req, res, next) => {
  // creating error manually
  //   const error = new Error("Not found");
  //   error.status = 404;
  //   next(error);
  // creating error using http-errors
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
