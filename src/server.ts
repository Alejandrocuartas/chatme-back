const cors = require("cors");
import express from "express";
const fileUpload = require("express-fileupload");
import router from "./rest/router";
import middlewares from "./rest/middlewares";

const app = express();

app.use(cors());
app.use(express.json());
app.use(middlewares.authMiddleware);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use("/api", router);

export default app;
