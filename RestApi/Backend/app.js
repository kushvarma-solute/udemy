const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const MONGODB_URI='mongodb+srv://kush:kush123@cluster0.w7jn5ey.mongodb.net/messages';

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

//  const fileStoreage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//       cb(null,'images');
//     },
//     filename:(req,file,cb)=>{
//       const currentDate = new Date().toISOString().slice(0,10);
//       cb(null, currentDate +'-'+file.originalname);  }
//   });

  
 
  const { v4: uuidv4 } = require('uuid');

  const fileStoreage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'images');
      },
      filename: (req, file, cb) => {
          const uniqueId = uuidv4();
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${uniqueId}.${fileExtension}`);
      }
  });
  
 
  const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg')
    {
        cb(null,true);
    }
    else
    {
        cb(null,false);
    }
  }


app.use(bodyParser.json());//application/json
app.use(
    multer({storage:fileStoreage,fileFilter: fileFilter}).single('image')
)
app.use('/images',express.static(path.join(__dirname,'images')))


// To remove Cross-orgin-access-error
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
}) 

app.use('/feed',feedRoutes);
app.use('/auth',authRoutes)


app.use((error,req,res,next)=>{//error handling middleware
    console.log(error);
    const status =error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,data:data});
})

mongoose
    .connect(MONGODB_URI)
    .then(result=>{
        app.listen(8080); 
        console.log('connected');
    })
    .catch(err=>{
        console.log(err);
    })
