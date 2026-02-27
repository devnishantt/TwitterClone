import express, { type Request, type Response } from "express";
import apiRouter from "./routes/apiRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

const PORT = 3000;

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is live." });
});

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT}/`);
});
