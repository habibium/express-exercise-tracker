const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const {
  createUser,
  findAllUsers,
  findByIdAndUpdate,
  findById,
} = require("./db");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.route("/api/users").get(async (_req, res) => {
  const users = await findAllUsers();
  res.json(users);
});

app.route("/api/users").post(async (req, res) => {
  const username = req.body?.username;
  const newUser = await createUser(username);
  res.json({
    username: newUser?.username,
    _id: newUser?._id,
  });
});

app.route("/api/users/:_id/exercises").post(async (req, res) => {
  const _id = req?.params?._id;
  const { description, duration, date } = req.body;
  const userDate = new Date(date || Date.now());

  const updatedUser = await findByIdAndUpdate(_id, {
    $push: {
      log: { description, duration: +duration, date: userDate },
    },
  });

  res.json({
    _id,
    username: updatedUser?.username,
    date: userDate?.toDateString(),
    duration: +duration,
    description,
  });
});

app.route("/api/users/:_id/logs").get(async (req, res) => {
  const _id = req.params?._id;
  const user = await findById(_id, {
    limit: req.query?.limit,
    from: req.query?.from,
    to: req.query?.to,
  });
  res.json(user);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Your app is listening on http://localhost:${process.env.port ?? 3000}`
  );
});
