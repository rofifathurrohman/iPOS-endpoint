const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;  // Get the role from the token

    // If allowedRoles is an array, check if the role is in the array
    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: "Access denied" });
      }
    } else {
      // If allowedRoles is a single role string
      if (role !== allowedRoles) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    next();  // Allow access
  };
};

module.exports = authorizeRole;
