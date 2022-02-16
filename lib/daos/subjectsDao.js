import { subjects, users } from 'models';
import sequelize from 'sequelize';
import { badRequest } from 'utils/responseInterceptors';

const attributes = ['id', 'name'];
export const findOneSubject = id =>
    subjects.findOne({ where: { id }, attributes });

export const findAllSubjects = async (where, page, limit) => {
    const totalCount = await subjects.count({ where });
    const allSubjects = await subjects.findAll({
        where,
        attributes,
        order: sequelize.literal('id ASC'),
        limit,
        offset: (page - 1) * limit,
        include: [
            {
                model: users,
                attributes: ['firstName']
            }
        ]
    });
    return {
        allSubjects,
        totalCount
    };
};

export const updateOneSubject = async (id, subject) => {
    await subjects.update(subject, {
        where: {
            id
        }
    });
    const get = await findOneSubject(id);

    if (get) {
        return findOneSubject(id);
    } else {
        return badRequest('Did not update anything, please check the Id');
    }
};

export const addOneSubject = async subject => {
    try {
        const added = await subjects.create(subject);
        return added;
    } catch (e) {
        return badRequest('Name already exists');
    }
};

export const deleteOneSubject = async id => {
    await subjects.destroy({ where: { id } });
    if (await findOneSubject(id)) {
        return `Deleted item by id ${id}`;
    } else {
        return badRequest('Did not delete anything, please check the Id');
    }
};
