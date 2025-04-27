import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    if (req.headers.authorization == null)
        return res.sendStatus(401);
    const token = req.headers.authorization;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    jwt.verify(token, TOKEN_SECRET, (error, firstName) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.firstName = firstName;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};