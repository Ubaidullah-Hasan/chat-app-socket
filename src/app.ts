import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://example.com",
    optionsSuccessStatus: 200,
  }),
);

// Static files middleware (public folder)
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});



export default app;
