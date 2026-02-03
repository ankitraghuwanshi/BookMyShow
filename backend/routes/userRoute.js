const express = require("express")
const userRouter = express.Router()

const { handleRegister, handleLogin } = require("../controller/userController")

userRouter.post("/register", handleRegister)

userRouter.post("/login", handleLogin)

module.exports = userRouter;