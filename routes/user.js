const router = require("express").Router();
const User = require("../models/User");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");


//update
router.put("/:id",verifyTokenAndAuthorization, async (req,res) =>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
          ).toString();
    }

    try{
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body,
            },
            {new: true}
        );
        res.status(200).json(updateUser);
    }catch(err) {
        res.status(500).json(err);
    }
});


//get user
router.put("/find/:id",verifyTokenAndAdmin, async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      } catch (err) {
        res.status(500).json(err);
      }
})

//get all user

module.exports = router;