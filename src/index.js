import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import rootRouter from "./routes/rootRouter.js";

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// router
app.use(rootRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
