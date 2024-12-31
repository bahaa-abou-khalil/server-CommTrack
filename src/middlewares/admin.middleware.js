export const adminMiddleware = async (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
  };