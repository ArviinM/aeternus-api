const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConfig = require("./config/db.config");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

var corsOptions = {
  origin: "https://aeternus-frontend.onrender.com/",
  credentials: true,
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Block = require("./models/block.model");
const Service = require("./models/service.model");
const Request = require("./models/request.model");
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

  Block.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Block({
        name: "1",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added '1' to Block collection");
      });
      new Block({
        name: "2",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added '2' to Block collection");
      });
      new Block({
        name: "3",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added '3' to Block collection");
      });
      new Block({
        name: "4",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added '4' to Block collection");
      });
    }
  });

  Service.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Service({
        name: "Plot Grass Cutting",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Plot Grass Cutting' to service collection");
      });
      new Service({
        name: "Plot Cleaning",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Plot Cleaning' to service collection");
      });
      new Service({
        name: "Plot Watering",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Plot Watering' to service collection");
      });
    }
  });

  Request.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Request({
        name: "Accepted",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Accepted' to request collection");
      });
      new Request({
        name: "Denied",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Denied' to request collection");
      });
      new Request({
        name: "Waiting",
      }).save((err) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Added 'Waiting' to request collection");
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
require("./routes/service_request.routes")(app);

app.listen(PORT || 5000, () => {
  console.log(`Server is running at port ${PORT} 🚀`);
});
