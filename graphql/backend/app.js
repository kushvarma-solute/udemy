const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
 const multer = require('multer');
const  graphqlHttp  = require('express-graphql')
const mongoose = require('mongoose');
// const MONGODB_URI='mongodb+srv://kush:kush123@cluster0.w7jn5ey.mongodb.net/messages';
const auth = require('./middleware/auth')
// const feedRoutes = require('./routes/feed');
// const authRoutes = require('./routes/auth');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const { clearImage } = require('./util/file');
const app = express();


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
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
}) 
app.use(auth);

app.put('/post-image',(req,res,next)=>{
    if(!req.isAuth){
    throw new Error('Not Authenticated!!');
   
    }
    if(!req.file){
        return res.status(200).json({message:"No file provided"})
    }
    console.log("pathhh",req.body.oldPath);
    if(req.body.oldPath){
        
        clearImage(req.body.oldPath);
    }
    return res.status(201)
    .json({message:"file stored",filePath:req.file.path.replace("\\" ,"/")})
})
// app.use('/feed',feedRoutes);
// app.use('/auth',authRoutes)
app.use('/graphql',graphqlHttp.graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true,
    customFormatErrorFn(err){
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred';
        const code = err.originalError.code || 500;
        return{message:message,status:code,data:data};
    }
}));

app.use((error,req,res,next)=>{//error handling middleware
    console.log(error);
    const status =error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,data:data});
})

mongoose
    .connect('mongodb+srv://kush:kush123@cluster0.w7jn5ey.mongodb.net/messages')
    .then(result=>{
       app.listen(8080); 
         console.log('Connected');
    })
    .catch(err=>{
        console.log(err);
    })
    
