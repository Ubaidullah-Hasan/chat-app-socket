import dotenv from "dotenv";

dotenv.config(); // find .env in the root by default

interface IConfig {
  port: number;
  NODE_ENV: string;
  DATABASEURL: string;
}

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASEURL: String(process.env.DATABASEURL),
};

export default config;
