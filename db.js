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
  log: {
    type: [
      {
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date, default: Date.now() },
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model("user", UserSchema);

const createUser = async (username) => await UserModel.create({ username });

const findAllUsers = async () => await UserModel.find({});

const findById = async (_id, { limit, from, to } = {}) => {
  let user = await UserModel.findById(_id, { "log._id": 0, __v: 0 });

  if (!user) return null;

  user = user.toObject();
  // Filter the log based on date range
  if (from || to) {
    user.log = user.log.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (from && entryDate < new Date(from)) return false;
      if (to && entryDate > new Date(to)) return false;
      return true;
    });
  }

  // Apply limit
  if (limit && !isNaN(+limit)) {
    user.log = user.log.slice(0, +limit);
  }

  // Update count and format dates
  user.count = user.log.length;
  user.log = user.log.map((l) => ({
    ...l,
    date: new Date(l.date).toDateString(),
  }));

  return user;
};

const findByIdAndUpdate = async (_id, update) =>
  await UserModel.findByIdAndUpdate(_id, update, { new: true });

module.exports = { createUser, findAllUsers, findByIdAndUpdate, findById };
