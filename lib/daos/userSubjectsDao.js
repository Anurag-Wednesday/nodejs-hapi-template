import { user_subjects as userSubjects } from 'models';
import { get } from 'lodash';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
import sequelize from 'sequelize';
import { notFound } from 'utils/responseInterceptors';
const attributes = ['id', 'userId', 'subjectId'];
export const findAllUserSubjects = async (where, page, limit, include = []) => {
    const totalCount = await userSubjects.count({ where });
    const results = await userSubjects.findAll({
        where,
        order: sequelize.literal('id ASC'),
        limit,
        offset: (page - 1) * limit,
        include
    });
    if (get(results, 'length')) {
        const allUserSubjects = transformDbArrayResponseToRawResponse(
            results
        ).map(userSubject => userSubject);
        return {
            results: allUserSubjects,
            totalCount
        };
    }
    return notFound('No userSubjects found');
};

export const findOneUserSubject = id =>
    userSubjects.findOne({ where: { id }, attributes });
