require('dotenv').config()

const log = require("debug")("fruits:server")
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const fruitsController = require("./controllers/FruitsController");
const usersController = require("./controllers/UsersController");
const session = require("express-session");
// const Fruit = require("./models/Fruit")


// Configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect( mongoURI, {}, () => {
  log("connected to mongodb")
});

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on( 'open' , () => {
  console.log('Connection made!');
});

const app = express();
const PORT = process.env.PORT ?? 3000;

//? MIDDLEWARE
app.use(morgan("tiny"))

// session //this must be higher up (as it runs top down)

app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
  })
);
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));
app.use("/fruits", fruitsController);
app.use("/users", usersController);

app.get("/", (req, res) => {
  res.send("Connected")}
)
// //? INDEX
// app.get("/fruits", (req, res) =>{
//   Fruit.find({}, (err, fruits) => {
//         log("fruits: %o", fruits)
//         res.render("index.ejs", {fruits})
//     });
// })

// //? SEED

// app.get("/fruits/seed", async (req, res) => {
//   try {
//     // await Fruit.deleteMany({})
//     await Fruit.create([
//       {
//         name: "grapefruit",
//         colour: "pink",
//         readyToEat: true,
//       },
//       {
//         name: "grape",
//         colour: "purple",
//         readyToEat: false,
//       },
//       {
//         name: "avocado",
//         colour: "green",
//         readyToEat: true,
//       },
//     ]);
//     res.redirect("/fruits");
//   } catch (error) {
//     log(error);
//   }
// });



// //? NEW
// app.get("/fruits/new", (req, res) =>{
//   res.render("new.ejs")
// })


// //? CREATE
// app.post("/fruits", (req, res) => {
//   if (req.body.readyToEat === "on") {
//     // if checked, req.body.readyToEat is set to 'on'
//     req.body.readyToEat = true;
//   } else {
//     // if not checked, req.body.readyToEat is undefined
//     req.body.readyToEat = false;
//   }
  
//   const fruit = new Fruit(req.body)
//   fruit.save();
//   res.send(req.body);
// })

// //? SHOW
// app.get("/fruits/:id", (req, res) => {
//     Fruit.findById(req.params.id, (err, fruit) => {
//         res.render("show.ejs" ,  {fruit } );
//     });
// });

// //? DELETE
// app.delete("/fruits/:id", async (req, res) => {
//     try {
//         await Fruit.findByIdAndDelete(req.params.id)
//         res.redirect("/fruits")
//     } catch (error) {
//         res.send(501)
//     }
// })

// //? EDIT
// app.get("/fruits/:id/edit", async (req, res) => {
//   try {
//     const foundFruit = await Fruit.findById(req.params.id);
//     res.render("edit.ejs", {
//       fruit: foundFruit, //pass in found fruit
//     });
//   } catch (error) {
//     console.log(error);
//   };
// });

// app.put("/fruits/:id", async (req, res) => {
//   if (req.body.readyToEat === "on") {
//     req.body.readyToEat = true;
//   } else {
//     req.body.readyToEat = false;
//   }
//   try {
//     const updatedFruit = await Fruit.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true });
//    // res.send(updatedFruit);
//     res.redirect("/fruits")

//   } catch (error) {
//     console.log(error);
//   };
// });

//? LISTEN
app.listen(PORT, () => {
  log("listening");
});