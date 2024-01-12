const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const transactions = require("./routes/transactionsRoutes.js");
const user = require("./routes/userRoute.js");
const awsServerlessExpress = require("aws-serverless-express");
const envConfig = require('./envConfig');
//configure env
dotenv.config();
//databse config
connectDB();
//rest object
const app = express();
//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactions);
app.use("/api/v1/user", user);

const PORT = process.env.PORT || 8080;
//run listen
app.listen(PORT, () => {
  const CONFIG = envConfig();
  console.log(CONFIG);
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

const server = awsServerlessExpress.createServer(app);
 
module.exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);