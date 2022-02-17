import { subjects } from 'models';
import get from 'lodash/get';
import sequelize from 'sequelize';
import { badRequest, notFound } from 'utils/responseInterceptors';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';

const attributes = ['id', 'name'];
export const findOneSubject = id =>
    subjects.findOne({ where: { id }, attributes });

export const findAllSubjects = async (where, page, limit, include) => {
    const totalCount = await subjects.count({ where });
    const results = await subjects.findAll({
        where,
        attributes,
        order: sequelize.literal('id ASC'),
        limit,
        offset: (page - 1) * limit,
        include
    });
    if (get(results, 'length')) {
        const allSubjects = transformDbArrayResponseToRawResponse(results).map(
            subject => subject
        );
        return {
            results: allSubjects,
            totalCount
        };
    }
    return notFound('No subjects found');
};

export const updateOneSubject = async (id, subject) => {
    await subjects.update(subject, {
        where: {
            id
        }
    });
    const foundSubject = await findOneSubject(id);

    if (foundSubject) {
        return findOneSubject(id);
    } else {
        return badRequest('Did not update anything, please check the Id');
    }
};

export const insertOneSubject = async subject => {
    try {
        const insertedSubject = await subjects.create(subject);
        return insertedSubject;
    } catch (e) {
        return badRequest('Name already exists');
    }
};

export const deleteOneSubject = async id => {
    if (await findOneSubject(id)) {
        await subjects.destroy({ where: { id } });
        return `Deleted item by id ${id}`;
    } else {
        return badRequest('Did not delete anything, please check the id');
    }
};
