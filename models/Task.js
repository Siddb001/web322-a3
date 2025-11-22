const { Sequelize, DataTypes } = require("sequelize");

// Use SQLite for WEB322 Assignment
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/tasks.db",
    logging: false
});

const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = { sequelize, Task };
