const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Anda tidak memiliki izin!" });
    }
    next();
  };
};

module.exports = authorizeRole;
