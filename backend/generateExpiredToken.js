import jwt from "jsonwebtoken";
import "dotenv/config";

const token = jwt.sign(
  {
    userId: "6b001276057fa288602af3d3",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "-1s",
  },
);

console.log(token);
