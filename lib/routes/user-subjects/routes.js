import { subjects } from 'models';
import { badImplementation, notFound } from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import { findAllUserSubjects } from 'daos/userSubjectsDao';

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
        handler: async request => {
            const where = {};
            if (request.query.name) {
                where.userId = request.query.userId;
            }
            const { page, limit } = request.query;

            return findAllUserSubjects(where, page, limit, include).catch(
                error => badImplementation(error.message)
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
