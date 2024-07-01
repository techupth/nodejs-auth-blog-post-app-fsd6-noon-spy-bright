import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const userData = { username, password: passwordHash, firstName, lastName };

  const collection = db.collection("users");
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await collection.insertOne(userData);
  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!user) {
    return res.json({
      message: "Invalid username or password",
    });
  }

  const password = await bcrypt.compare(req.body.password, user.password);
  if (!password) {
    return res.json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );
  return res.json({
    message: "login succesfully",
    token,
  });
});

export default authRouter;
