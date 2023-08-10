
const categoryRoutes=require("./routes/categoryRoutes.js");
const productRoutes =require("./routes/productRoutes.js");
const express=require('express');
const dotenv=require('dotenv')
const morgan=require('morgan')
const connectDB=require('./config/db.js')
const cors=require('cors')
const authRoutes=require('./routes/authRoute.js')

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
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
