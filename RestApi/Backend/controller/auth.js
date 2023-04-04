const { validationResult } =require('express-validator');
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.signup = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422,
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
try
{
const hashedPW= await bcrypt
    .hash(password,12)
   
        const user = new User({
            email:email,
            password:hashedPW,
            name:name
        });
const result= await user.save();
  
        res.status(201).json({
            message:"User created Sucessfully!",
            userId: result._id
        });}
catch(err){
        if(!err.statuCode){
            err.statuCode = 500;
        }
        next(err);//now eeror will go to next error handling middleware
    };
 }

 exports.login = async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try
    {    
      const user= await User.findOne({email:email})
  
        if(!user){
            const error = new Error('A User with email could not be found');
            error.statuCode = 401;
            throw error;
        }
        loadedUser = user;

     const isEqual= await bcrypt.compare(password,user.password);

        if(!isEqual){
            const error = new Error('Wrang password');
            error.statuCode = 401;
            throw error;
        }
        //this will create an new signature and packs into a new jwt
        const token = jwt.sign({
            email:loadedUser.email,
            userId:loadedUser._id.toString()
        },'somesupersecretsecret',
        {expiresIn: '1h'}
        );
        res.status(200)
        .json({ 
            token:token,
            userId:loadedUser._id.toString()
        })
   }
   catch(err){
    if(!err.statuCode){
        err.statuCode = 500;
    }
    next(err);//now eeror will go to next error handling middleware

   }
   
 }

 exports.getUserStatus = async(req,res,next) =>{
    try
  { 
    const user =await User.findById(req.userId)
     
        if(!user){
            const error = new Error('User not found');
            error.statuCode = 404;
            throw error;
        }
        res.status(200).json({status:user.status})
    }
    catch(err){
        if(!err.statuCode){
            err.statuCode = 500;
        }
        next(err);
    }
    
 }

 exports.updateUserStatus = async(req,res,next)=>{
    const newStatus = req.body.status;
    try
    {  
     const user=await  User.findById(req.userId)
   
        if(!user){
            const error = new Error('User not found');
            error.statuCode = 404;
            throw error;
        }
        user.status = newStatus;
       await user.save();
        res.status(200).json({message:'User Updated'})

    }
    catch(err){
        if(!err.statuCode){
            err.statuCode = 500;
        }
        next(err);
    }
     
 }


