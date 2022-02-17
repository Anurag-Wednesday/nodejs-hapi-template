module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            firstName: {
                field: 'first_name',
                type: DataTypes.STRING(32),
                allowNull: false
            },
            lastName: {
                field: 'last_name',
                type: DataTypes.STRING(32),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }
        },
        {
            tableName: 'users',
            timestamps: true
        }
    );
    users.associate = db => {
        users.hasMany(db.user_subjects, {
            as: 'user_subjects',
            foreignKey: 'user_id'
        });
    };
    return users;
};
