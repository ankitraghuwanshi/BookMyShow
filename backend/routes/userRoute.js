const express = require("express")
const userRouter = express.Router()

const { handleRegister, handleLogin, handleGetCurrentUser, forgetPassword, resetPassword } = require("../controller/userController")
const authMiddleware = require("../middleware/authMiddleware")

userRouter.post("/register", handleRegister)

userRouter.post("/login", handleLogin)

userRouter.get("/get-current-user", authMiddleware, handleGetCurrentUser )

userRouter.post("/forgetpassword", forgetPassword)

userRouter.post("/resetpassword", resetPassword)

module.exports = userRouter;