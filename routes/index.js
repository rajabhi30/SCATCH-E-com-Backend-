const express=require('express');
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const router=express.Router();

router.get("/", function(req, res) {
    let error=req.flash("error");
    res.render("index", {error, isLoggedin:false});
});




router.get("/shop", isLoggedin, async function(req,res){
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success});
})


router.get("/addtocart/:productid", isLoggedin, async function(req,res){
   let user= await userModel.findOne({email: req.user.email});
   user.cart.push(req.params.productid);
   await user.save();
   req.flash("success", "product added to cart successfully");
   res.redirect("/shop");
})


router.get("/cart", isLoggedin, async function(req,res){
   let user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

   res.render("cart", { user });
});



router.get("/removefromcart/:productid", isLoggedin, async function(req,res){

   let user = await userModel.findOne({ email: req.user.email });

   user.cart = user.cart.filter(
      item => item.toString() !== req.params.productid
   );

   await user.save();

   req.flash("success","Product removed from cart");

   res.redirect("/cart");
});









module.exports=router;