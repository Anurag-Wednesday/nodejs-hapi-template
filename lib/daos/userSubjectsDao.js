import { user_subjects as userSubjects } from 'models';
import { get } from 'lodash';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
import sequelize from 'sequelize';
import { badRequest, notFound } from 'utils/responseInterceptors';

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

export const updateOneUserSubject = async (id, newUserSubject) => {
    let userSubject = await findOneUserSubject(id);
    if (userSubject) {
        userSubject = await userSubject
            .update(newUserSubject)
            .catch(() =>
                badRequest('Did not update anything, please check the id')
            );
        return {
            id: userSubject.id,
            userId: userSubject.userId,
            subjectId: userSubject.subjectId
        };
    }
    return badRequest('Did not update anything, please check the id');
};

export const insertUserSubject = async userSubject =>
    userSubjects
        .create(userSubject)
        .catch(() => badRequest('Item already exists'));

export const deleteOneUserSubject = async id => {
    if (await findOneUserSubject(id)) {
        await userSubjects.destroy({ where: { id } });
        return `Deleted item by id ${id}`;
    }
    return badRequest('Did not update anything, please check the id');
};
