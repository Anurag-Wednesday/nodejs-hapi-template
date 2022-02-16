import get from 'lodash/get';
import Joi from '@hapi/joi';
import {
    addOneSubject,
    deleteOneSubject,
    findAllSubjects,
    updateOneSubject
} from 'daos/subjectsDao';
import { notFound, badImplementation } from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import { MAX_VALUE_OF_SIGNED_INT } from 'utils/constants';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
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
        handler: async (request, h) => {
            const where = {};
            if (request.query.name) {
                where.name = request.query.name;
            }
            const { page, limit } = request.query;
            return findAllSubjects(where, page, limit)
                .then(subjects => {
                    if (get(subjects.allSubjects, 'length')) {
                        const totalCount = subjects.totalCount;
                        const allSubjects =
                            transformDbArrayResponseToRawResponse(
                                subjects.allSubjects
                            ).map(subject => subject);

                        return h.response({
                            results: allSubjects,
                            totalCount
                        });
                    }
                    return notFound('No subjects found');
                })
                .catch(error => badImplementation(error.message));
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
            return updateOneSubject(subjectId, { name });
        }
    },
    {
        method: 'PUT',
        path: '/',
        options: {
            description: 'add one subject',
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
            return addOneSubject({ name });
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
            return deleteOneSubject(subjectId);
        }
    }
];
