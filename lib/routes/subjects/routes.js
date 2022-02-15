import get from 'lodash/get';
import { findAllSubjects } from 'daos/subjectsDao';
import { notFound, badImplementation } from 'utils/responseInterceptors';
import { server } from 'root/server.js';
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
    }
];
