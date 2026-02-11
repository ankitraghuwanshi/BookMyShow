const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const UserModel = require("../model/userModel")
const validator = require("email-validator")
const emailHelper = require('../config/emailHelper')

const SALT_ROUNDS=10

//90000-99999
const otpGenerator = function () {
    return Math.floor((Math.random() * 10000) + 90000);
}

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
            token,
            role: user.role
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

const forgetPassword=async function (req, res) {
    try {
        if (req.body.email == undefined) {
            return res.status(401).json({
                status: "failure",
                message: "Please enter the email for forget Password"
            })
        }
        // find the user -> going db -> getting it for the server
        let user = await UserModel.findOne({ email: req.body.email });

        // If user is not present, then we can't reset password
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "user not found for this email"
            })
        }
        // got the user -> on your server
        const otp = otpGenerator();

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; //10 minute

        // those updates will be send to the db
        await user.save();

        res.status(200).json({
            status: "success",
            message: "otp sent to your email",
        });

        // send the mail to there email -> otp
        await emailHelper(
            "otp.html",
            user.email,
            {
                name: user.name,
                otp: otp
            }
        );
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
}

const resetPassword=async function (req, res) {
    try {
        let resetDetails = req.body;

        // required fields are there or not 
        if (!resetDetails.password == true || !resetDetails.otp == true) {
            return res.status(401).json({
                status: "failure",
                message: "invalid request"
            })
        }

        // it will serach with the id -> user
        const user = await UserModel.findOne({ otp: req.body.otp });

        // if user is not present
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "OTP is wrong"
            })
        }

        // if otp is expired
        if (Date.now() > user.otpExpiry) {
            return res.status(401).json({
                status: "failure",
                message: "otp expired"
            })
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        user.password = hashedPassword

        // remove the otp from the user
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "password reset successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
}

module.exports={
    handleRegister,
    handleLogin,
    handleGetCurrentUser,
    forgetPassword,
    resetPassword
}