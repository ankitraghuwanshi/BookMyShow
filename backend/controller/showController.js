const ShowModel = require("../model/showModel");

const addShow=async (req, res) => {
  try {
    const newShow = new ShowModel(req.body);
    await newShow.save();
    res.status(200).json({
      success: true,
      message: "New show has been added!",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

const deleteShow=async (req, res) => {
  try {
    await ShowModel.findByIdAndDelete(req.body.showId);
    res.status(200).json({
      success: true,
      message: "The show has been deleted!"
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
}

const updateShow=async (req, res) => {
  try {
    await ShowModel.findByIdAndUpdate(req.body.showId, req.body);
    res.status(200).json({
      success: true,
      message: "The show has been updated!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

const getAllShowsByTheatre=async (req, res) => {
  try {
    const shows = await ShowModel.find({ theatre: req.body.theatreId }).populate(
      "movie"
    );
    res.status(200).json({
      success: true,
      message: "All shows fetched",
      data: shows,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

const getAllTheatresByMovie=async (req, res) => {
  try {
    const { movie, date } = req.body;
    // First get all the shows of the selected date
    const shows = await ShowModel.find({ movie, date }).populate("theatre");

    // Filter out the unique theatres now
    let uniqueTheatres = [];

    shows.forEach((show) => {
      let isTheatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );
      // If the theatre for this show is not present in unique
      // theatres, ONLY then add it, otherwise, simply ignore this show
      if (!isTheatre) {
        let showsOfThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsOfThisTheatre,
        });
      }
    });
    res.status(200).json({
      success: true,
      message: "All theatres fetched!",
      data: uniqueTheatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

const getShowById=async (req, res) => {
  try {
    const show = await ShowModel.findById(req.body.showId)
      .populate("movie")
      .populate("theatre");
    res.status(200).json({
      success: true,
      message: "Show fetched!",
      data: show,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports={
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getAllTheatresByMovie,
  getShowById
}