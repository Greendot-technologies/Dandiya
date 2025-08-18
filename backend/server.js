const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bookingRoutes = require("./routes/bookingRoutes");
require("dotenv").config();

const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:3000"], // Adjust this to your frontend's URL
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );
app.use(cors());
app.use(bodyParser.json());
app.use("/api", bookingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
