const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USERNAME,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: "postgres",
        port: process.env.PG_PORT,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    }
);

const Task = sequelize.define("Task", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dueDate: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    userId: { type: DataTypes.STRING, allowNull: false }
});

module.exports = { Task, sequelize };
