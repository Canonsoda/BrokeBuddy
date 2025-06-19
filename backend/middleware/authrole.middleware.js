export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    // get role from header first (for switched UI role), fallback to user.roles
    const activeRole = req.headers["x-active-role"] || req.user?.roles;

    // Convert to array safely, even if it's just a string like "lender"
    const userRoles = Array.isArray(activeRole) ? activeRole : [activeRole];

    const hasAccess = userRoles.some(role => allowedRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }

    next();
  };
};
