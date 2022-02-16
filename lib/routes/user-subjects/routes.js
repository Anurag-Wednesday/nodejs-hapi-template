import { notFound } from '@hapi/boom';
import { subjects } from 'models';
import { get } from 'lodash';
import { server } from 'root/server.js';
import { findAllUserSubjects } from 'daos/userSubjectsDao';
import { transformDbArrayResponseToRawResponse } from 'utils/transformerUtils';
const include = [
    {
        model: subjects,
        as: 'subject'
    }
];
module.exports = [
    {
        method: 'GET',
        path: '/',
        options: {
            description: 'get all details from user_subjects',
            notes: 'GET userSubjects API',
            tags: ['api', 'user-subjects'],
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

            return findAllUserSubjects(where, page, limit, include).then(
                userSubjects => {
                    if (get(userSubjects.allUserSubjects, 'length')) {
                        const totalCount = userSubjects.totalCount;
                        const allUserSubjects =
                            transformDbArrayResponseToRawResponse(
                                userSubjects.allUserSubjects
                            ).map(userSubject => userSubject);

                        return h.response({
                            results: allUserSubjects,
                            totalCount
                        });
                    }
                    return notFound('No userSubjects found');
                }
            );
        }
    },
    {
        method: 'GET',
        path: '/{userSubjectId}',
        options: {
            description: 'get one userSubject by ID',
            notes: 'GET userSubjects API',
            tags: ['api', ' userSubjects'],
            cors: true,
            auth: false
        },
        handler: async request => {
            const userSubjectId = request.params.userSubjectId;
            return server.methods
                .findOneUserSubject(userSubjectId)
                .then(userSubject => {
                    if (!userSubject) {
                        return notFound(
                            `No user-subject was found for id ${userSubjectId}`
                        );
                    }
                    return userSubject;
                });
        }
    }
];
