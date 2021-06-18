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
const productRouter = require("./router/product");
const userRouter = require("./router/user");

require("./db");

/* product */
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

/* listenning on server */
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
