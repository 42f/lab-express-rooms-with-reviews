const Rooms = require("../models/Room.model");

module.exports = async (req, res, next) => {
  //check if the request object contains de required fields
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send("Please provide all the required fields");
  }
  next();
};
