exports.get404=(req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not found',path:'error'});
}
//reason is that path is undefined so in the navigation.ejs can't find path's value so to solve it you should add it in the render function
//shortly, try adding in the 'path' parameter in the function render here: