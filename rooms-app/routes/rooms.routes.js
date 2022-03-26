const isLoggedIn = require("../middleware/isLoggedIn");
const Rooms = require("../models/Room.model");

const isOwner = require("../middleware/isOwner");
const hasRequiredFields = require("../middleware/hasRequiredFields");

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

router.post("/create", isLoggedIn, hasRequiredFields, (req, res, next) => {
  const {
    name,
    description,
    imageUrl } = req.body;
  try {
    if (!req.user) {
      throw new Error('User is missing');
    }
    const newRoom = new Rooms({
      name,
      description,
      imageUrl,
      owner: req.user
    });
    newRoom.save();
    res.redirect("/rooms/me");
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", isLoggedIn, isOwner, (req, res, next) => {
  const room = req.targetRoom;
  const data = {
    formTitle: `Edit room ${room.name} `,
    formAction: `/rooms/${room.id}/edit`,
    formButton: 'Edit',
    definedValues: {
      name: room.name,
      description: room.description,
      imageUrl: room.imageUrl
    }
  }
  res.render("rooms/room-form", data);
});

router.post("/:id/edit", isLoggedIn, isOwner, hasRequiredFields, async (req, res, next) => {
  const { name, description, imageUrl } = req.body;
  try {
    const room = req.targetRoom;
    await room.update({ name, description, imageUrl });
    res.redirect("/rooms/me");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id/delete", isLoggedIn, isOwner, async (req, res, next) => {
  try {
    const room = req.targetRoom;
    await Rooms.findByIdAndDelete(room.id);
    res.redirect("/rooms/me");
  } catch (error) {
    console.error(error)
    next(error);
  }
});

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const rooms = await Rooms.find({ owner: req.user });
    res.render("rooms/me-rooms", { rooms });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
