const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const userSubjects = sequelize.define(
        'user_subjects',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            userId: {
                field: 'user_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            subjectId: {
                field: 'subject_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'subjects',
                    key: 'id'
                }
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
            tableName: 'user_subjects',
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
                    name: 'user_id_2',
                    unique: true,
                    using: 'BTREE',
                    fields: [{ name: 'user_id' }, { name: 'subject_id' }]
                },
                {
                    name: 'user_id',
                    using: 'BTREE',
                    fields: [{ name: 'user_id' }]
                },
                {
                    name: 'subject_id',
                    using: 'BTREE',
                    fields: [{ name: 'subject_id' }]
                }
            ]
        }
    );
    userSubjects.associate = db => {
        userSubjects.belongsTo(db.subjects, {
            as: 'subject',
            foreignKey: 'subject_id'
        });
        userSubjects.belongsTo(db.users, {
            as: 'user',
            foreignKey: 'user_id'
        });
    };
    return userSubjects;
};
