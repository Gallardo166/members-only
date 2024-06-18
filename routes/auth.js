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

const isAdmin = function(req, res, next) {
  if (req.isAuthenticated() && req.user.status === "admin") {
    next();
    return;
  }
  res.status(401).json({ message: "You are not an admin." });
};

export { isUser, isMember, isAdmin };