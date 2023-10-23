import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.jwtoken;
    if (!token) {
      return res.status(403).send({ message: "No Token Provided" });
    }
    const decoded = jwt.verify(token.toString(), process.env.TOKEN_KEY);
    req.user=decoded
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default verifyToken;
