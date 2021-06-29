const { port } = require("./config");

/* express */
const express = require("express");
const app = express();
app.use(express.json());

/* CORS */
const cors = require("cors");
app.use(cors());

/*express-async-errores*/
require("express-async-errors");

/*import routers */
const categoryRouter = require("./router/category");
const productRouter = require("./router/product");
const userRouter = require("./router/user");

require("./db");

/* product */
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

/* listenning on server */
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// mongodb://localhost:27017/forsage
