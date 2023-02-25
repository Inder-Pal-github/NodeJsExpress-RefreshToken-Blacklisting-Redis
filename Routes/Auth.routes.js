const express = require("express");
const {
  register,
  login,
  refresh_token,
  logout,
} = require("../Controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/refresh-token", refresh_token);

authRouter.delete("/logout", logout);

module.exports = { authRouter };
