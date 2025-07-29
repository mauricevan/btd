require('dotenv').config();

module.exports = {
  database: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_QTM5bS7mRGnj@ep-quiet-violet-a2yacqbv-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "btd-dordrecht-secret-key-2024"
  },
  server: {
    port: process.env.PORT || 4000
  }
}; 