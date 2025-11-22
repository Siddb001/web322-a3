// ================================================
//  MONGODB (Authentication)
// ================================================
const mongoose = require("mongoose");

function connectMongoDB() {
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("✅ MongoDB Connected"))
        .catch(err => console.error("❌ MongoDB Error:", err));
}

// ================================================
//  POSTGRES (Tasks Storage) - NEON SETUP
// ================================================
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: "postgres",

        // ⭐ REQUIRED FOR NEON DB ⭐
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },

        logging: false
    }
);

// Test connection
async function connectPostgres() {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL Connected");
    } catch (err) {
        console.error("❌ PostgreSQL Error:", err);
    }
}

module.exports = {
    connectMongoDB,
    connectPostgres,
    sequelize
};
