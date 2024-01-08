// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};
function generateOTP() {
  // Implement your OTP generation logic (e.g., random 6-digit number)
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
module.exports = { comparePassword, hashPassword, generateOTP };
