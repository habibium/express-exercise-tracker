const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.route("/api/users").post((req, res) => {
  const username = req.body?.username;
  console.log(username);
  res.send(username);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Your app is listening on http://localhost:${process.env.port ?? 3000}`
  );
});
