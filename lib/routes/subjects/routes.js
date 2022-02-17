import Joi from '@hapi/joi';
import { users } from 'models';
import {
    deleteOneSubject,
    findAllSubjects,
    updateOneSubject,
    insertSubject
} from 'daos/subjectsDao';
import {
    notFound,
    badRequest,
    badImplementation
} from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import { MAX_VALUE_OF_SIGNED_INT } from 'utils/constants';

const include = [
    {
        model: users,
        attributes: ['firstName']
    }
];
module.exports = [
    {
        method: 'GET',
        path: '/{subjectId}',
        options: {
            description: 'get one subject by ID',
            notes: 'GET subject API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false
        },
        handler: async request => {
            const subjectId = request.params.subjectId;
            return server.methods.findOneSubject(subjectId).then(subject => {
                if (!subject) {
                    return notFound(`No subject was found for id ${subjectId}`);
                }
                return subject;
            });
        }
    },
    {
        method: 'GET',
        path: '/',
        options: {
            description: 'get all subjects',
            notes: 'GET all subjects API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false,
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        },
        handler: async request => {
            const where = {};
            if (request.query.name) {
                where.name = request.query.name;
            }
            const { page, limit } = request.query;
            return findAllSubjects(where, page, limit, include);
        }
    },
    {
        method: 'PATCH',
        path: '/{subjectId}',
        options: {
            description: 'update one subject by ID',
            notes: 'PATCH subject API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false,
            validate: {
                params: Joi.object({
                    subjectId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT)
                }),
                payload: Joi.object({
                    name: Joi.string().required()
                })
            }
        },
        handler: async request => {
            const subjectId = request.params.subjectId;
            const name = request.payload.name;
            const updatedSubject = await updateOneSubject(subjectId, {
                name
            }).catch(error => badRequest(error.message));
            if (!updatedSubject.output) {
                return server.methods.findOneSubject.cache
                    .drop(subjectId)
                    .then(() => updatedSubject)
                    .catch(error => {
                        request.log('error', error);
                        return badImplementation(error.message);
                    });
            } else {
                return updatedSubject;
            }
        }
    },
    {
        method: 'PUT',
        path: '/',
        options: {
            description: 'insert one subject',
            notes: 'PUT subject API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    name: Joi.string().required()
                })
            }
        },
        handler: async request => {
            const name = request.payload.name;
            return insertSubject({ name });
        }
    },
    {
        method: 'DELETE',
        path: '/{subjectId}',
        options: {
            description: 'delete one subject',
            notes: 'DELETE subject API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false,
            validate: {
                params: Joi.object({
                    subjectId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT)
                })
            }
        },
        handler: async request => {
            const subjectId = request.params.subjectId;
            const deletedSubject = await deleteOneSubject(subjectId).catch(
                error => badRequest(error.message)
            );
            if (!deletedSubject.output) {
                return server.methods.findOneSubject.cache
                    .drop(subjectId)
                    .then(() => deletedSubject)
                    .catch(error => {
                        request.log('error', error);
                        return badImplementation(error.message);
                    });
            } else {
                return deletedSubject;
            }
        }
    }
];
