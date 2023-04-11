const router = require("express").Router();
const Cart = require("../models/Cart");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

//create
router.post("/", verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const saveCart = await newCart.save();
        res.status(500).json(saveCart);
    }catch(err){
        res.status(500).json(err);
    }
});

//update 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {$set: req.body,},
            {new: true}
        );
        res.status(200).json(updateCart);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete
router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart had been deleted successful!");
    } catch (err) {
        res.status(500).json(err);

    }
});

//get user cart
router.get("/find/:userId",verifyTokenAndAuthorization, async (req,res)=>{
    
    try{
        const cart = await Cart.findOne({userId:req.params.userId});

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);

    }
});


//get all user carts
router.get("/", verifyTokenAndAdmin, async (req,res) =>{
    try{
        const carts = await Cart.find();

        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);

    }
});

module.exports = router;