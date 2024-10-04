const mongoose = require("mongoose");

class DB {
  constructor() {
    this._connect()
      .then(() => {
        console.log("Successfully connected to MongoDB");
      })
      .catch((_e) => {
        console.error("Failed to connect to MongoDB");
      });
  }

  async _connect() {
    await mongoose.connect(process.env.MURI);
  }
}

new DB();

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
});

const UserModel = mongoose.model("user", UserSchema);

const createUser = async (username) => await UserModel.create({ username });

module.exports = { createUser };
