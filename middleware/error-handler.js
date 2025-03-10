module.exports = {
  generalErrorHandler(err, req, res, next) {
    console.log(err);
    if (err instanceof Error) {
      req.flash("error_msg", `${err.name}: ${err.message}`);
    } else {
      req.flash("error_msg", `${err}`);
    }
    res.redirect("back");
    next(err);
  },
};
