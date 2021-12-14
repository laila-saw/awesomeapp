const User = require("../models/User");
// to create a router
const router=require("express").Router();
const bcrypt =require("bcrypt");

// update user
router.put("/:id", async (req, res)=>{
    // i dont't konw what they mean by user in req.user.isAdmin
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password, salt);
            }catch(e){
                return res.status(500).json("err pwd :"+e);
            }
        }
            try{
                // we should use different name of user not User 
                const user=await User.findByIdAndUpdate(req.params.id,{
                    $set: req.body,
                });
                res.status(200).json("Account has been updated")
            }catch(e){
                return res.status(500).json("err general :"+e);
            }
        
    }else{
        return res.status(403).json("You can uapdate only your account");
    }
});
// delete user
router.delete("/:id", async (req, res)=>{
    // i dont't konw what they mean by user in req.user.isAdmin
    if(req.body.userId===req.params.id || req.body.isAdmin){
            try{
                // we should use different name of user not User 
                // to delete an user using id we should findbyIdAndDelete(the id)
                const user=await User.findByIdAndDelete(req.params.id);
                
                res.status(200).json("Account has been deleted")
            }catch(e){
                return res.status(500).json("err general :"+e);
            }
        
    }else{
        return res.status(403).json("You can delete only your account");
    }
});
// get a user 
router.get("/", async (req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    try{
        const user=userId  
        ? await User.findById(userId) 
        : await User.findOne({username:username});
        // if i want show just one proprtie i use this user.proprits
        // if i want hide some proprites and show others i use this const {password,updateAt, ...other} =user._doc;
        // const {password,  ...other} =user._doc;
        res.status(200).json(user);
    }catch(e){
        res.status(500).json("the user not found"+userId)
    }       
   }); 
//    get friends
//  followings 
//  get followings 
router.get("/followings/:userId",async(req,res)=>{
try{
const user= await User.findById(req.params.userId);
// if we have more then wone data to fetch we use promise.all
const followings=await Promise.all(
    user.followings.map((followingId)=>{
        return User.findById(followingId);
    })
)
let followingsList = [];
followings.map((following)=>{
     const {_id, username, profilePicture}=following;
     followingsList.push({_id, username, profilePicture});
})
res.status(200).json(followingsList);
}catch(error){
    res.status(500).json(error);
}
});
//  get followers 
router.get("/followers/:userId",async(req,res)=>{
    try{
    const user= await User.findById(req.params.userId);
    // if we have more then wone data to fetch we use promise.all
    const followers=await Promise.all(
        user.followers.map((followerId)=>{
            return User.findById(followerId);
        })
    )
    let followersList = [];
    followers.map((follower)=>{
         const {_id, username, profilePicture}=follower;
         followersList.push({_id, username, profilePicture});
    })
    res.status(200).json(followersList);
    }catch(error){
        res.status(500).json(error);
    }
    });
          // id of user that i want follow
         //    |
// follow user v 
router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followers:req.body.userId}});
                await currentUser.updateOne({ $push: {followings:req.params.id}});
                res.status(200).json("you follow this user with success")
            }else{
                res.status(403).json("You already follow this user");
            }
        }catch(e){
            res.status(500).json(e);
        }
    }else{
        res.status(403).json("You can't follow your account");
    }
});
// unfolow user 
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers:req.body.userId}});
                await currentUser.updateOne({ $pull: {followings:req.params.id}});
                res.status(200).json("you unfollow this user with success")
            }else{
                res.status(403).json("You didn't follow this user");
            }
        }catch(e){
            res.status(500).json(e);
        }
    }else{
        res.status(403).json("You can't unfollow your account");
    }
});
// to use it we shoulde export it 
module.exports=router