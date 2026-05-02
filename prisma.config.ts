import "dotenv/config";
import { defineConfig, env } from "prisma/config";

function withSslMode(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  let nextUrl = url;

  if (!nextUrl.includes("sslmode=")) {
    nextUrl = `${nextUrl}${separator}sslmode=require`;
  }

  if (!nextUrl.includes("sslaccept=")) {
    nextUrl = `${nextUrl}${nextUrl.includes("?") ? "&" : "?"}sslaccept=accept_invalid_certs`;
  }

  return nextUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: withSslMode(env("DATABASE_URL")),
    directUrl: withSslMode(env("DIRECT_URL")),
  },
  migrations: {
    path: "prisma/migrations",
  },
});
