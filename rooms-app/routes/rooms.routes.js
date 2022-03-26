const isLoggedIn = require("../middleware/isLoggedIn");
const Rooms = require("../models/Room.model");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Rooms.find().populate("owner");
    res.render("rooms/rooms", { rooms });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/create", (req, res, next) => {
  const data = {
    formTitle: 'Create a new room',
    formAction: '/rooms/create',
    formButton: 'Create'
  }
  res.render("rooms/room-form", data);
});

router.post("/create", (req, res, next) => {
  const {
    name,
    description,
    imageUrl } = req.body;
  try {
    const newRoom = new Rooms({
      name,
      description,
      imageUrl,
      owner: req.user
    });
    newRoom.save();
    res.redirect("/rooms");
  } catch (error) {
    next(error);
  }
});


router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("User not found");
    }
    const rooms = await Rooms.find({ owner: req.user });
    console.log('ROONS', rooms);
    res.render("rooms/me-rooms", { rooms });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
