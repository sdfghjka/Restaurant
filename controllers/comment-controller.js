const { Comment, Users, Restaurant } = require("../models");
const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body;
    const userId = req.user.id;
    if (!text) throw new Error("Comment text is required!");
    return Promise.all([
      Users.findByPk(userId),
      Restaurant.findByPk(restaurantId),
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!");
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        return Comment.create({
          text,
          restaurant_id: restaurantId,
          user_id: userId,
        });
      })
      .then(() => {
        res.redirect(`/restaurants/${restaurantId}`);
      })
      .catch((err) => next(err));
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        if (!comment) throw new Error("Comment didn't exist!");
        return comment.destroy();
      })
      .then(() => {
        req.flash("success_msg", "刪除資料成功!");
        return res.redirect('back');
      })
      .catch((err) => next(err));
  },
};
module.exports = commentController;
