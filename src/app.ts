import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://example.com',
  optionsSuccessStatus: 200 
}))

app.use("/",express.static(path.join(process.cwd(), "public"))); // name must index.html


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
