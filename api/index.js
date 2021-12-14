const express = require("express");
const app=express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users");
const postRoute=require("./routes/posts");
const authRoute=require("./routes/auth");
const multer=require("multer");
const path =require("path");
dotenv.config();
 mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => {
      console.log('Connected to MongoDB');
    }
  );
  const storage=multer.diskStorage({
    destination : (req,file,cb)=>{
      cb(null,"public/images")
    },
    filename:(req, file, cb)=>{
      cb(null, file.originalname);
    }
  });
  const upload=multer({storage:storage});
  
  app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
      return res.status(200).json("file uploaded succefly");
    }catch(err){
      res.status(500).json(err)
      console.log(error)
    }
  });
  app.use("/images", express.static(path.join(__dirname, "public/images")));
// middleware 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/auth", authRoute)

app.listen(8800,()=>{
    console.log('hi laila! backend server is runing yyyyess ');
})