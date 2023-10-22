import express from "express";
import jwt from "jsonwebtoken";

const verifyToken =async (req, res, next) => {
 try {
    const token = req.cookies.jwtoken
    if (!token) {
      return res.status(403).send({  message: "No Token Provided" });
    }
      const decoded = jwt.verify(token.toString(), process.env.TOKEN_KEY);
      res.status(200).json(decoded)
      next()
 } catch (err) {
    res.status(500).json({error:err.message})
 }
  
};

export default verifyToken;
