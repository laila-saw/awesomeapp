const Post = require("../models/Post");
const User = require("../models/User");
// to create a router
const router=require("express").Router();
// create a post 

router.post("/",async (req,res)=>{
    const newPost=new Post(req.body)
    try{
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    }catch(e){
        res.status(500).json("erreur : "+e)
    }
});

// update a post 

router.put('/:id',async(req,res)=>{
    try{// hawal dir hadchi li ldakhal dyal try w ila ma9dertich kan chi error hna ma3Arfinoch hawal tbiyno lina f catch 
        const post = await Post.findById(req.params.id); //hawal ta9a lina l post li l id dyalo hwa id li f parametres
        if (post.userId === req.body.userId) { // ila kan l user id dyal had lpost hwa nfsso l userid dyali ya3ni lpost dyal wn9der nmodifier fih 
            await post.updateOne({$set:req.body});//updateOne VS findByIdAndUpdate : tania kanl9aw hadak lmodel wnmodifwh fnfs lw9t lwla hta kanl9awh wnndiro 3li condition 3ad nmodifiwh
            res.status(200).json("Your post has been updated"+req.body.userId);
        } else {
            res.status(403).json("You can update Only your Post");// ila makanch post dyali ya3ni man9derch n modofier fih
        }
    }catch(e){
        res.status(500).json(e)
    }
});

// delete a post 

router.delete('/:id',async(req,res)=>{
    try{// hawal dir hadchi li ldakhal dyal try w ila ma9dertich kan chi error hna ma3Arfinoch hawal tbiyno lina f catch 
        const post = await Post.findById(req.params.id); //hawal ta9a lina l post li l id dyalo hwa id li f parametres
        if (post.userId === req.body.userId) { // ila kan l user id dyal had lpost hwa nfsso l userid dyali ya3ni lpost dyal wn9der nmsho  
            await post.deleteOne();//updateOne VS findByIdAndUpdate : tania kanl9aw hadak lmodel wnmodifwh fnfs lw9t lwla hta kanl9awh wnndiro 3li condition 3ad nmodifiwh
            res.status(200).json("Your post has been deleted");
        } else {
            res.status(403).json("You can delete Only your Post"+req.body.userId);// ila makanch post dyali ya3ni man9derch nmsho 
        }
    }catch(e){
        res.status(500).json(e)
    }
});

// like a post

router.put("/:id/like",async (req,res)=>{
        try{
            const post=await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({ $push: {likes:req.body.userId}});
                res.status(200).json("you like this post with success")
            }else{
                await post.updateOne({ $pull: {likes:req.body.userId}});
                res.status(200).json("you disLike this post with success")
            }
        }catch(e){
            res.status(500).json(e);
        }
    
});

// get a post 
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        const {desc,...other}=post._doc;
        res.status(200).json(post);
    }catch(e){
        res.status(500).json(e);
    }
})
// get timeline posts 
// get -> params 
// put/post -> body
router.get("/timeline/:userId",async(req,res)=>{
    try{
      const currentUser=await User.findById(req.params.userId);
      const userPosts=await Post.find({userId:currentUser._id});
      const friendPosts=await Promise.all(
          currentUser.followings.map((friendId) => {
            return Post.find({userId: friendId});
          })
      );
         res.status(200).json(userPosts.concat(...friendPosts));
        
    }catch(e){
        res.status(500).json("the error is : "+e);
    }
});
// get the user's own posts ghir les postes dyalo 
router.get("/profile/:userId",async(req,res)=>{
    try{
      const currentUser=await User.findById(req.params.userId);
      const userPosts=await Post.find({userId:currentUser._id});
         res.status(200).json(userPosts);
        
    }catch(e){
        res.status(500).json("the error is : "+e);
    }
});

module.exports=router;
// status 400 bad request due to a client's mastake
// The HTTP 403 Forbidden client error status response code indicates that the server understands the request but refuses to authorize it. This status is similar to 401 , but in this case, re-authenticating will make no difference.
// The HTTP 404 Not Found client error response code indicates that the server can't find the requested resource. A 404 status code only indicates that the resource is missing: not whether the absence is temporary or permanent. ... If a resource is permanently removed, use the 410 (Gone) status instead