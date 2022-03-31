const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const { reset } = require("nodemon");


router.get("/seed", async (req, res) => {
    try {
         const saltRounds = 10;
        await User.deleteMany({})
        await User.create([
          {
            username: "wanxuan",
            password: bcrypt.hashSync("12345", saltRounds),
          },
          {
            username: "admin",
            password: bcrypt.hashSync("88888", saltRounds),
          },
        ]);
        res.send("Seed")
      } catch (error) {
      }
})

//* see login form
router.get("/form", (req, res) => {
    res.render("login.ejs");
});

router.get("/secret", (req, res) => {
    const user = req.session.user;

    if (user) {
    res.send(user)
    } else {
        res.send("Access Denied")
    }
})
//? to keep track of user entry
router.get("/secret2", (req, res) => {
  const count = req.session.count;
  req.session.count = req.session.count + 1;
  res.send("count" + count)
})

//* login route
router.post("/login", async (req, res) => {
  const { username, password} = req.body;
    // const hashPassword = bcrypt.hashSync(password, saltRounds);
    const user = await User.findOne({ username });

    if (!user) {
        res.send("User not found");
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user; //this is to set up the session
      res.send("Ok")
    } else {
      res.send("No")
    }

  //* success or failure
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("Logged out")
})

module.exports = router;
