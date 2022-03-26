const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reviews: [] // we will update this field a bit later when we create review model
});

const Room = model("Room", roomSchema);

module.exports = Room;
