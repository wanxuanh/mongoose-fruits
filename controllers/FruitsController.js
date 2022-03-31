const express = require("express");
const log = require("debug")("fruits:controller:fruits")
const router = express.Router();
const Fruit = require("../models/Fruit")


//? INDEX
router.get("/", (req, res) =>{
  Fruit.find({}, (err, fruits) => {
        log("fruits: %o", fruits)
        res.render("index.ejs", {fruits})
    });
})

//? SEED

router.get("/seed", async (req, res) => {
  try {
    // await Fruit.deleteMany({})
    await Fruit.create([
      {
        name: "grapefruit",
        colour: "pink",
        readyToEat: true,
      },
      {
        name: "grape",
        colour: "purple",
        readyToEat: false,
      },
      {
        name: "avocado",
        colour: "green",
        readyToEat: true,
      },
    ]);
    res.redirect("/fruits");
  } catch (error) {
    log(error);
  }
});



//? NEW
router.get("/new", (req, res) =>{
  res.render("new.ejs")
})


//? CREATE
router.post("/fruits", (req, res) => {
  if (req.body.readyToEat === "on") {
    // if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else {
    // if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  
  const fruit = new Fruit(req.body)
  fruit.save();
  res.send(req.body);
})

//? SHOW
router.get("/:id", (req, res) => {
    Fruit.findById(req.params.id, (err, fruit) => {
        res.render("show.ejs" ,  {fruit } );
    });
});

//? DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Fruit.findByIdAndDelete(req.params.id)
        res.redirect("/fruits")
    } catch (error) {
        res.send(501)
    }
})

//? EDIT
router.get("/:id/edit", async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.id);
    res.render("edit.ejs", {
      fruit: foundFruit, //pass in found fruit
    });
  } catch (error) {
    console.log(error);
  };
});

router.put("/:id", async (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  try {
      await Fruit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true });
   // res.send(updatedFruit);
    res.redirect("/fruits")

  } catch (error) {
    console.log(error);
  };
});

module.exports = router;