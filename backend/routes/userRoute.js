const express = require("express")
const userRouter = express.Router()

const { handleRegister, handleLogin, handleGetCurrentUser } = require("../controller/userController")
const authMiddleware = require("../middleware/authMiddleware")

userRouter.post("/register", handleRegister)

userRouter.post("/login", handleLogin)

userRouter.get("/get-current-user", authMiddleware, handleGetCurrentUser )


module.exports = userRouter;