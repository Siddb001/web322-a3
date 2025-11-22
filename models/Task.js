const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    dueDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Task;
