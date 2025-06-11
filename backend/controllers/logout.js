// controllers/logout.js
export const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(0),
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
