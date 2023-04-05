const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });
  
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//login
router.post('/login', async (req,res) => {
    try{
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );
        
        !user && res.status(401).json("Wrong username!");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const passwordInDB = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        passwordInDB !== inputPassword && res.status(401).json("Wrong password!");
        
        //this token make sure only the admin can modify or delete the user
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC,
            {expiresIn: "3d"}
        );
        
        //to hide the password in success info from MongoDB
        const {password, ...others} = user._doc;
        res.status(200).json({...others,accessToken});
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;