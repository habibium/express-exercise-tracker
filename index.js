const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { createUser } = require("./db");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.route("/api/users").post(async (req, res) => {
  const username = req.body?.username;
  const newUser = await createUser(username);
  res.json({
    username: newUser?.username,
    _id: newUser?._id,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Your app is listening on http://localhost:${process.env.port ?? 3000}`
  );
});
