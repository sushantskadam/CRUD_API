const express = require("express");
const router = express.Router();
const empModel = require("../db/empSchema");
// https://javascript.plainenglish.io/securing-express-js-api-using-jwt-b2834325d2e8
//for validation
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require("express-validator");
const {
  getData,
  postData,
  deleteData,
  updateData,
  loginCheck,
} = require("../controller/empcontroller");
//JWT
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
const authenticateMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    // req.user = user;
    next();
   });
};
router.get("/getdata",authenticateMiddleware, (req, res) => {
  getData();
  res.send("data fetched");
});

router.post("/login", async (req, res) => {
  loginCheck(req.body, req, res);
});

router.post(
  "/postdata",
  urlencodedParser,
  [
    check("fname", "Enter Valid First Name")
      .exists()
      .matches(/^[a-zA-Z ]{2,100}$/),
    check("lname", "Enter Valid Last Name")
      .exists()
      .matches(/^[a-zA-Z ]{2,100}$/),
    check("email", "Please Enter Valid Email")
      .isEmail()
      // .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .normalizeEmail(),
    check("password", "Enter Valid Password").matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
    check('designation', 'Designation length should be 5 to 20 characters')
    .isLength({ min: 5, max: 20 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      let allerrors = " ";
      alert.forEach((val) => {
        console.log(val.msg);
        allerrors = allerrors + "\n" + val.msg;
      });

      res.send(allerrors);
      // res.send(alert)

      // res.render("form", {
      //   alert,
      // });
    } else {
      postData(req.body);
      res.send("Data added");
    }
  }
);
router.delete("/deletedata/:email",authenticateMiddleware, (req, res) => {
  let email = req.params.email;
  deleteData(email);
  res.send("data Deleted");
});

router.put("/updatedata/:email",authenticateMiddleware, (req, res) => {
  let email = req.params.email;
  updateData(email, req.body);
  res.send("Data Updated");
});

module.exports = router;
