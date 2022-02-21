import Joi from '@hapi/joi';
import { subjects } from 'models';
import {
    badImplementation,
    notFound,
    badRequest
} from 'utils/responseInterceptors';
import { server } from 'root/server.js';
import {
    findAllUserSubjects,
    insertUserSubject,
    deleteOneUserSubject,
    updateOneUserSubject
} from 'daos/userSubjectsDao';
import { MAX_VALUE_OF_SIGNED_INT } from 'utils/constants';

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
            tags: ['api', 'userSubjects'],
            cors: true,
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
            if (request.query.userId) {
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
            cors: true
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
    },
    {
        method: 'PATCH',
        path: '/{userSubjectId}',
        options: {
            description: 'update one userSubject by ID',
            notes: 'PATCH userSubject API',
            tags: ['api', ' userSubjects'],
            cors: true,
            validate: {
                params: Joi.object({
                    userSubjectId: Joi.number()
                        .min(1)
                        .max(MAX_VALUE_OF_SIGNED_INT)
                }),
                payload: Joi.object({
                    userId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT),
                    subjectId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT)
                })
            }
        },
        handler: async request => {
            const userSubjectId = request.params.userSubjectId;
            const newUserId = request.payload.userId;
            const newSubjectId = request.payload.subjectId;
            const updatedUserSubject = await updateOneUserSubject(
                userSubjectId,
                {
                    newUserId,
                    newSubjectId
                }
            ).catch(error => badRequest(error.message));
            if (!updatedUserSubject.output) {
                return server.methods.findOneUserSubject.cache
                    .drop(userSubjectId)
                    .then(() => updatedUserSubject)
                    .catch(error => {
                        request.log('error', error);
                        return badImplementation(error.message);
                    });
            } else {
                return updatedUserSubject;
            }
        }
    },
    {
        method: 'PUT',
        path: '/',
        options: {
            description: 'add one userSubject',
            notes: 'PUT userSusbject API',
            tags: ['api', ' userSubjects'],
            cors: true,
            validate: {
                payload: Joi.object({
                    userId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT),
                    subjectId: Joi.number().min(1).max(MAX_VALUE_OF_SIGNED_INT)
                })
            }
        },
        handler: async request => {
            const userId = request.payload.userId;
            const subjectId = request.payload.subjectId;
            return insertUserSubject({ userId, subjectId });
        }
    },
    {
        method: 'DELETE',
        path: '/{userSubjectId}',
        options: {
            description: 'delete one userSubject',
            notes: 'DELETE userSubject API',
            tags: ['api', ' userSubjects'],
            cors: true,
            validate: {
                params: Joi.object({
                    userSubjectId: Joi.number()
                        .min(1)
                        .max(MAX_VALUE_OF_SIGNED_INT)
                })
            }
        },
        handler: async request => {
            const userSubjectId = request.params.userSubjectId;
            const deletedUserSubject = await deleteOneUserSubject(
                userSubjectId
            ).catch(error => badRequest(error.message));
            if (!deletedUserSubject.output) {
                return server.methods.findOneUserSubject.cache
                    .drop(userSubjectId)
                    .then(() => deletedUserSubject)
                    .catch(error => {
                        request.log('error', error);
                        return badImplementation(error.message);
                    });
            } else {
                return deletedUserSubject;
            }
        }
    }
];
