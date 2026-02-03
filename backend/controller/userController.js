const bcrypt=require('bcryptjs')
const UserModel = require("../model/userModel")
const validator = require("email-validator")

const SALT_ROUNDS=10

const handleRegister=async (req, res) => {
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
        //salt and hashing password
        const salt=await bcrypt.genSalt(SALT_ROUNDS)
        const hashedPassword=await bcrypt.hash(req.body.password, salt)
        user.password=hashedPassword

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
}

const handleLogin=async(req, res)=>{
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
        const isPasswordValid=await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordValid) {
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
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports={
    handleRegister,
    handleLogin
}