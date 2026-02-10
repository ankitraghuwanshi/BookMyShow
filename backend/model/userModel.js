const mongoose = require("mongoose")

const userSchemaRules = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLenth: 5 
    },
    // isAdmin: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // }
    role:{
        type: String,
        required: false,
        default: "User"  //Partner, Admin, user
    }
}

const userSchema = new mongoose.Schema(userSchemaRules)

const UserModel = mongoose.model("users", userSchema)

module.exports = UserModel