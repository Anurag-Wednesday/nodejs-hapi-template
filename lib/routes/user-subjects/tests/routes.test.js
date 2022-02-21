import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { MOCK_USER_SUBJECTS: mockUserSubject } = mockData;
const userSubject = {
    userId: 1,
    subjectId: 2
};

describe('/user-subjects route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
        });
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return all the userSubjects ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects'
        });
        expect(res.statusCode).toEqual(200);
        const userSubjectOne = res.result.results[0];
        expect(userSubjectOne.id).toEqual(mockUserSubject.id);
        expect(userSubjectOne.user_id).toEqual(mockUserSubject.userId);
        expect(userSubjectOne.subject_id).toEqual(mockUserSubject.subjectId);
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects/1'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return notFound if findAllUserSubjects fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.user_subjects.findAll = () =>
                new Promise((resolve, reject) => {
                    resolve(null);
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects'
        });
        expect(res.statusCode).toEqual(404);
    });
    it('should return notFound if findOneUserSubject fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.user_subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    resolve(null);
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects/8'
        });
        expect(res.statusCode).toEqual(404);
    });
    it('should return all the subjects with query name if name exists ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects?userId="1'
        });
        expect(res.statusCode).toEqual(200);
        const userSubjectOne = res.result.results[0];
        expect(userSubjectOne.id).toEqual(mockUserSubject.id);
    });
    it('should add one userSubject', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/user-subjects',
            payload: {
                userId: 1,
                subjectId: 3
            }
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return badRequest if userId or subjectId already exists ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
            allDbs.user_subjects.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'PUT',
            url: '/user-subjects',
            payload: {
                userId: 1,
                subjectId: 2
            }
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should delete one userSubject', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/user-subjects/1'
        });
        expect(res.statusCode).toBe(200);
    });
    it('should return badRequest if userSubject already deleted ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
            allDbs.user_subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    resolve(null);
                });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/user-subjects/1'
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should return badRequest if error while deleting subjects', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
            allDbs.user_subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/user-subjects/9'
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should give bad implementation if the cache drop fails while delete ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () =>
                                new Promise((resolve, reject) =>
                                    reject(new Error('e'))
                                )
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/user-subjects/1'
        });
        expect(res.statusCode).toEqual(500);
    });

    it('should return all the userSubjects with query name if name exists ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects?userId=1'
        });
        expect(res.statusCode).toEqual(200);
        const userSubjectOne = res.result.results[0];
        expect(userSubjectOne.id).toEqual(mockUserSubject.id);
    });
    it('should return badImplementation if error in findAllUserSubjects', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.user_subjects.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/user-subjects'
        });
        expect(res.statusCode).toEqual(500);
    });
    it('should update the userSubjects if patch is called ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return mockUserSubject;
                }
            });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/user-subjects/1',
            payload: userSubject
        });
        expect(res.statusCode).toEqual(200);
        expect(res.result.id).toEqual(1);
    });
    it('should return badRequest if patch fails ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.user_subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/user-subjects/1',
            payload: userSubject
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should return badRequest if error while updating userSubjects', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return userSubject;
                }
            });
            allDbs.user_subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/subjects/9',
            payload: userSubject
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should give bad implementation if the cache drop fails while update ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneUserSubject: {
                        cache: {
                            drop: async () =>
                                new Promise((resolve, reject) =>
                                    reject(new Error('e'))
                                )
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.user_subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return mockUserSubject;
                }
            });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/user-subjects/1',
            payload: userSubject
        });
        expect(res.statusCode).toEqual(500);
    });
});
