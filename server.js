const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConfig = require("./config/db.config");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const Status = db.status;

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB 🍃");
    initial();
  })
  .catch((err) => {
    console.error("Connection error: ", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'admin' to roles collection");
      });
    }
  });

  Status.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Status({
        name: "available",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'available' to status collection");
      });
      new Status({
        name: "reserved",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'reserved' to status collection");
      });
      new Status({
        name: "occupied",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'occupied' to status collection");
      });
    }
  });
}

app.get("/", (req, res) => {
  res.json({
    message:
      "Hello! I am a JSON Message. If you can see me, it means I'm working.",
  });
});

app.use("/public", express.static("./public"));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/graveplot.routes")(app);
require("./routes/deceased.routes")(app);

app.listen(PORT || 5000, () => {
  console.log(`Server is running at port ${PORT} 🚀`);
});
