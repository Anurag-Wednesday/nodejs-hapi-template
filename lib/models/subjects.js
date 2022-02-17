const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const subjects = sequelize.define(
        'subjects',
        {
            id: {
                field: 'id',
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                field: 'name',
                type: DataTypes.STRING(255),
                allowNull: true
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
                allowNull: true
            },
            deletedAt: {
                field: 'deleted_at',
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'subjects',
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'id' }]
                },
                {
                    name: 'name',
                    using: 'BTREE',
                    fields: [{ name: 'name' }]
                }
            ]
        }
    );
    subjects.associate = db => {
        subjects.hasMany(db.user_subjects, {
            as: 'userSubjects',
            foreignKey: 'subject_id'
        });
        subjects.belongsToMany(db.users, { through: db.user_subjects });
    };

    return subjects;
};
