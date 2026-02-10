const TheatreModel = require("../model/theatreModel");

const addTheatre=async (req, res) => {
    try{
        const newTheatre = new TheatreModel(req.body);
        await newTheatre.save();
        res.status(200),json({
            success: true,
            message: "New theatre has been added!"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}

const deleteTheatre=async (req, res) => {
    try{
        await TheatreModel.findByIdAndDelete(req.body.theatreId);
        res.status(200).json({
            success: true,
            message: "The theatre has been deleted!"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}

const updateTheatre=async (req, res) => {
    try{
        await TheatreModel.findByIdAndUpdate(req.body.theatreId, req.body);
        // console.log(req.body.theatreId)
        res.status(200).json({
            success: true,
            message: "Theatre has been updated!"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}

const getAllTheatres=async (req, res) => {
    try {
        // This will by default omit all reference fields
        // When we populate the owner, EVERY field from Owner is included
        const allTheatres = await TheatreModel.find().populate("owner")

        res.status(200).json({
            success: true,
            message: "Theatres fetched!",
            allTheatres
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}

const getAllTheatresByOwner=async (req, res) => {
    try {
        const allTheatresByOwner = await TheatreModel.find({
            owner: req.params.ownerID
        })

        res.status(200).json({
            success: true,
            message: "Theatres by owners fetched!",
            allTheatresByOwner
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}

module.exports={
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getAllTheatresByOwner
}