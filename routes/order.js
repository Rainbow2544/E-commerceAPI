const router = require("express").Router();
const Order = require("../models/Order");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

//create
router.post("/", verifyToken, async (req,res)=>{
    const newOrder = new Order(req.body);
    try{
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder);
    }catch(err){
        res.status(500).json(err);
    }
})

//update
router.put("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const updateOrder = Order.findByIdAndUpdate(
            req.params.id,
            {$set: req.body,},
            {new: true}
        );
        res.status(200).json(updateOrder);
    }catch(err){
        res.status(500).json(err);
    }
})
//delete 
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order had been successful deleted!");
    }catch(err){
        res.status(500).json(err);
    }
})
//get user orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const orders = Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
})
//get all orders
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const orders = Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
})

//get monthly income
router.get("/income",verifyTokenAndAdmin, async (req,res) =>{
    //get the last two month
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevDate = new Date();
    const previousMonth = new Date(prevDate.setMonth(lastMonth.getMonth() - 1));

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project:{
                    month:{ $month: "$createdAt" },
                    sales: "$amount",
                },
              },
              {
                $group: {
                  _id: "$month",
                  total: { $sum: "$sales" },
                },
              },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
  }
})

module.exports = router;