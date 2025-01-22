module.exports = (error, req, res, next)=>{
    console.error(error); 
    req.flash('error', error.message || 'Internal Server Error')
    res.redirect('back');
    next(error);
}