const express = require("express")
const UserModel = require("../model/userModel")
const userRouter = express.Router()

var validator = require("email-validator");

userRouter.post("/register", async (req, res) => {
    try {
        const isEmailValid = validator.validate(req.body.email)

        if (!isEmailValid) {
            res.status(500).json({
                success: false,
                message: "Please enter a valid email"
            })   
        }

        // Create a new User object locally
        const user = new UserModel(req.body)

        // Then save it to Database
        await user.save()

        res.send({
            success: true,
            message: "registration is successful",
            user
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


userRouter.post("/login", async function (req, res){
    try {
        // Create a new User object locally
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            })
        }

        // Checking if password is valid or not
        if(req.body.password !== user.password) {
            return res.status(404).json({
                success: false,
                message: "No user/pass combo found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Successfully logged in!"
        })
    } catch(error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = userRouter;