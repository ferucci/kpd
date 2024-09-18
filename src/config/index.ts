export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3003
  },
  database: {
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || "student",
    password: process.env.DB_PASSWORD || "student",
    name: process.env.DB || "kpd"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "super_secret",
    ttl: process.env.JWT_TTL || "30000s",
  }
}) 