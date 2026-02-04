const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const UserModel = require("../model/userModel")
const validator = require("email-validator")

const SALT_ROUNDS=10

const handleRegister=async (req, res) => {
    try {
        //verify email
        const isEmailValid = validator.validate(req.body.email)
        if (!isEmailValid) {
            return res.status(500).json({
                success: false,
                message: "Email is not valid"
            })   
        }

        //check if email is taken?
        const isEmailTaken=await UserModel.findOne({email: req.body.email})
        if (isEmailTaken) {
            return res.status(404).json({
                success: false,
                message: "Email already taken!"
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

        res.status(200).json({
            success: true,
            message: "Registration is successful",
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
                message: "Incorrect Password"
            })
        }

        // Start my JWT Signing process
        const token = jwt.sign(
            // FIrst argument is the extra data stored in JWT
            {
                userId: user._id
            },
            // Second argument is the secret
            process.env.JWT_SECRET
            ,
            // Sets the expiry of the JWT
            {
                expiresIn: "1d"
            }
        )

        res.status(200).json({
            success: true,
            message: "Successfully logged in!",
            token
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const handleGetCurrentUser=async(req, res)=>{
    try {
        // Try to get the req.body.userid from the req object
        const userId = req.user.userId

        if(!userId) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong! Try again"
            })
        }

        const user = await UserModel.findById(userId).select("-password")

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong! Try again"
        })
    }
}

module.exports={
    handleRegister,
    handleLogin,
    handleGetCurrentUser
}