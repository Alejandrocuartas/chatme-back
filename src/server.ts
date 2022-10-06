const cors = require("cors");
import express from "express";
import router from "./rest/router";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

export default app;
