const isAuth = function(req, res, next) {
  if (req.isAuthenticated()) next();
  res.status(401).json({ message: "You are not a user." })
};

export { isAuth };