const crypto =require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../model/user');
const nodemailer = require('nodemailer');
const user = require('../model/user');
const { validationResult } = require('express-validator');
// const { createTransport } = require('nodemailer');
// const sendinblueTransport = require('nodemailer-sendinblue-transport');
// const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const transporter =nodemailer.createTransport(
{
    service:"gmail",
    auth:
    {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
}
);
// const client = Sib.ApiClient.instance
// const apiKey = client.authentications['api-key']
// apiKey.apiKey='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'
// const transEmailApi = new Sib.TransactionalEmailsApi()


// const transporter = createTransport(
//    new sendinblueTransport({
//       auth: {
//         api_key: process.env.API_KEY
//       }
//     })
//   );



exports.getLogin = (req,res,next) =>
{   
    // const isLoggedIn = req
    // .get('Cookie')
    // .split('=')[1];
    // console.log("ssssscacaccCcCV:",isLoggedIn);
    let message = req.flash('error');
    console.log(message[0]);
    if(message.length > 0){
        message = message[0];

    }
    else
    {
        message=null;
    }
    console.log(req.flash('error')); 

    res.render('./auth/login',{
        path:'/login',
        pageTitle:'Login',
        errorMessage:message,
        oldInput:{email:'',password:''},        
        validationErrors:[]

    });
}


exports.getSignup = (req,res,next) =>
{   
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else
    {
        message=null;
    }

    res.render('./auth/signup',{
        path:'/signup',
        pageTitle:'Signup',
        errorMessage:message,
        oldInput:{email:'',password:'',confirmPassword:''},        
        validationErrors:[]


    });
}

 

exports.postLogin = (req,res,next) =>
{   
//res.setHeader('Set-Cookie','loggedIn=true; Max-Age=3600; HttpOnly');
const email=req.body.email;
const password = req.body.password;
const errors = validationResult(req);
if(!errors.isEmpty()){
    return   res.status(422).render('./auth/login',{
        path:'/login',
        pageTitle:'Login',
        errorMessage:errors.array()[0].msg,
        oldInput:{
            email:email,
            password:password
        },
        validationErrors:errors.array()
    });
}


User.findOne({email:email})
.then((user) => {
    if(!user){
         return   res.status(422).render('./auth/login',{
            path:'/login',
            pageTitle:'Login',
            errorMessage:'Invalid email or password',
            oldInput:{
                email:email,
                password:password
            },
            validationErrors:[]
        });
    }
    bcrypt
    .compare(password,user.password)
    .then((doMatch) => {
        if(doMatch)
        {
            req.session.isLoggedIn = true;
            req.session.user = user;
           return req.session.save((err)=>{
              console.log(err);
              res.redirect('/');
            });
        }
        return   res.status(422).render('./auth/login',{
            path:'/login',
            pageTitle:'Login',
            errorMessage:'Invalid email or password',
            oldInput:{
                email:email,
                password:password
            },
            validationErrors:[]
        });
    }).catch((err) => {
        console.log(err);
    });

 }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);});

}


exports.postLogout = (req,res,next) =>
{   
User.findById('641b02182f60f4c1987ff63f')
    req.session.destroy((err)=>{
        console.log(err);
         res.redirect('/');
    })
}
exports.postSignup = (req,res,next) =>
{   
 const email = req.body.email;
 const password = req.body.password;
 const confirmPassword = req.body.confirmPassword;
 const errors = validationResult(req);
 
 if(!errors.isEmpty()){ 
    console.log(errors.array());
    // Unprocessable Content
    return res.status(422).render('./auth/signup',{
        path:'/signup',
        pageTitle:'Signup',
        errorMessage:errors.array()[0].msg,
        oldInput:{email:email,password:password,confirmPassword: req.body.confirmPassword},
        validationErrors:errors.array()
    });
 }

    bcrypt
   .hash(password,12)
   .then(hashedPassword =>{
    const user = new User({
        email:email,
        password:hashedPassword,
        cart:{item:[]}
    });
    return user.save();
 })
 .then(()=>{
    res.redirect('/login');
    let details={
        from:'kushvarma1999@gmail.com',
        to:email,
        subject:"your account has been successfully signup",
    }
    return transporter.sendMail(details,(err)=>{
        if(err){
            console.log(err);
        }
        else
        {
            console.log('Email sent')
        }
   }) 
   
    
 });
  
 
}

exports.getReset = (req,res,next) =>{
    
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else
    {
        message=null;
    }
    res.render('./auth/reset',{
        path:'/reset',
        pageTitle:'Reset password',
        errorMessage:message
    })
}

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset');
            }
            const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then((user) => {
            if(!user){
                req.flash('error','No Account with that email found')
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration=Date.now() + 3600000;
          return  user.save();
        }).then((result)=>{
            res.redirect('/');
            let details=
            {
                from:'kushvarma1999@gmail.com',
                to:req.body.email,
                subject:"Password Reset",
                html:`
                    <p>You requested a password reset</p>
                    <p>Click this<a href="http://localhost:3000/reset/${token}">Link</a>to set a new password.
                `
             }
            return transporter.sendMail(details,(err)=>{
                if(err){
                    console.log(err);
                }
                else
                {
                    console.log('Password reset')
                }
        }) 

        }).catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    });
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then((user) => {
        let message = req.flash('error');
        if(message.length > 0){
            message = message[0];
        }
        else
        {
            message=null;
        }

        res.render('./auth/new-password',{
            path:'/new-password',
            pageTitle:'New password',
            errorMessage:message,
            userId:user._id.toString(),
            passwordToken:token
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
   
}

exports.postNewPassword = (req,res,next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken:passwordToken,
        resetTokenExpiration:{ $gt:Date.now() } ,
        _id:userId
    })
    .then((user) => {
        resetUser=user;
        return bcrypt.hash(newPassword,12);
    }).then(hashedPassword=>{
        resetUser.password=hashedPassword;
        resetUser.resetToken=undefined;
        resetUser.resetTokenExpiration=undefined;
        return resetUser.save();
    })
    .then((result)=>{
        res.redirect('/login');
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);    });
};



 