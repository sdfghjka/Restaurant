const jwt = require("jsonwebtoken");
const getUser = (req) => {
  if (!req.cookies || !req.cookies.token) return null;

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    return decoded; 
  } catch (err) {
    console.error("驗證失敗:", err.message);
    return null;
  }
};
const ensureAuthenticated = req =>{
  return req.isAuthenticated()
}
  module.exports = {
    getUser,
    ensureAuthenticated,
  }