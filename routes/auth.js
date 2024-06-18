const isUser = function(req, res, next) {
  if (req.isAuthenticated() && req.user.status === "user") {
    next();
    return;
  }
  res.status(401).json({ message: "You are not a user." })
};

const isMember = function(req, res, next) {
  if (req.isAuthenticated() && req.user.status === "member") {
    next();
    return;
  }
  res.status(401).json({ message: "You are not a member." });
};

export { isUser, isMember };