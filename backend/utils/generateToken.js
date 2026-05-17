import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // required for HTTPS (Render + Vercel are both HTTPS)
    sameSite: "none",    // required for cross-domain cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
// import jwt from "jsonwebtoken";

// export const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET);

//   res.cookie("token", token, {
//     httpOnly: true,
//   });
// };