const empModel = require("../db/empSchema");
//JWT
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";

const getData = async (req, res) => {
  empModel.find({}, (err, data) => {
    if (err) throw err;
    else {
      console.log(data);
      return data;
      //   res.json({ err: 0, data: data });
    }
  });
};

const postData = async (data) => {
  let ins = await new empModel(data);
  console.log(data);
  ins.save((err) => {
    if (err) throw err;
    // if (err) {
    //   res.json({ err: "already added", message: "already added" });
    // } else {
    //   res.json({ err: 0, msg: "successfully added" });
    // }
  });
};

const deleteData = async (email) => {
   empModel.deleteOne({ email: email }, (err) => {
    if (err) throw err;
    else{
      console.log("Deleted")
    }
  });
};

const updateData = async (email, data) => {
    empModel.updateOne(
        { email: email },
        {
          $set: {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            designation: data.designation,
            salary: data.salary,
            password:data.password
          },
        },
        (err) => {
          if (err) throw err;
          else {
            // res.send(" Updated");
            console.log("updated");
          }
        }
      );

};

const loginCheck=async(body,req,res)=>{
  const {email,password}= body;
  const user = await empModel.findOne({ email: email });
  if (user) {
    // check user password with hashed password stored in the database
    // const validPassword = await bcrypt.compare(password, user.password);
    if (password==user.password) {
      // res.status(200).json({ message: "Valid password" });
      let payload = {
        uid: email,
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 });
      console.log(`login Successfull and Token: ${token}`)
      res.json({ err: 0, msg: "login successfull", token });
    } else {
      console.log("Invalid Password")
      // res.status(400).json({ err: 1, msg: "Invalid Password" });
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    console.log("User Does Not Exist")
    // res.json({ err: 2, msg: "User does not exist" });
    res.status(401).json({ error: "User does not exist" });
  }

}


module.exports = { getData, postData, deleteData, updateData,loginCheck };
