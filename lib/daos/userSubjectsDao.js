import { user_subjects as userSubjects } from 'models';
import sequelize from 'sequelize';
const attributes = ['id', 'userId', 'subjectId'];
export const findAllUserSubjects = async (where, page, limit, include = []) => {
    const totalCount = await userSubjects.count({ where });
    const allUserSubjects = await userSubjects.findAll({
        where,
        order: sequelize.literal('id ASC'),
        limit,
        offset: (page - 1) * limit,
        include
    });

    return {
        allUserSubjects,
        totalCount
    };
};

export const findOneUserSubject = id =>
    userSubjects.findOne({ where: { id }, attributes });
