module.exports = (error, req, res, next)=>{
    if(error instanceof Error){
        req.flash("error", `${error.name}: ${error.message}`)
    }
    console.error(error); 
    req.flash('error', error.message || 'Internal Server Error')
    res.redirect('back');
    next(error);
}