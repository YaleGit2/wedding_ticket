const required = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  databaseUrl: required("DATABASE_URL"),
  sessionSecret: required("SESSION_SECRET"),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  adminPassword: required("ADMIN_PASSWORD"),
  outsideScannerPassword: required("OUTSIDE_SCANNER_PASSWORD"),
  insideScannerPassword: required("INSIDE_SCANNER_PASSWORD"),
};
