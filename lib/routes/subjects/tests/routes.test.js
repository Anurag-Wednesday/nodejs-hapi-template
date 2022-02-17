import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { MOCK_SUBJECT: subject } = mockData;

describe('/subjects route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
        });
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/subjects/1'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 404 if subject is not found by Id', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/subjects/2'
        });
        expect(res.statusCode).toEqual(404);
        expect(res.result.message).toEqual('No subject was found for id 2');
    });
    it('should return all the subjects ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/subjects'
        });
        expect(res.statusCode).toEqual(200);
        const subjectOne = res.result.results[0];
        expect(subjectOne.id).toEqual(subject.id);
        expect(subjectOne.name).toEqual(subject.name);
        expect(res.result.total_count).toEqual(1);
    });
    it('should return all the subjects with query name if name exists ', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/subjects?name="MATHS'
        });
        expect(res.statusCode).toEqual(200);
        const subjectOne = res.result.results[0];
        expect(subjectOne.id).toEqual(subject.id);
    });

    it('should return notFound if no subjects are found', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.subjects.findAll = () => null;
        });
        const res = await server.inject({
            method: 'GET',
            url: '/subjects'
        });
        expect(res.statusCode).toEqual(404);
    });

    it('should return badImplementation if findAllSubjects fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.subjects.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/subjects'
        });
        expect(res.statusCode).toEqual(500);
    });

    it('should update the subjects if patch is called ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/subjects/1',
            payload: {
                name: 'China'
            }
        });
        expect(res.statusCode).toEqual(200);
        expect(res.result.id).toEqual(1);
    });
    it('should return badRequest if patch fails ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    resolve(null);
                });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/subjects/1',
            payload: {
                name: 'China'
            }
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should add one subject', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/subjects',
            payload: {
                name: 'China'
            }
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return badRequest if name already exists ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'PUT',
            url: '/subjects',
            payload: {
                name: 'MATHS'
            }
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should delete one subject', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.create = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/subjects/1'
        });
        expect(res.statusCode).toBe(200);
    });
    it('should return badRequest if subject already deleted ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    resolve(null);
                });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/subjects/1'
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should return badRequest if error while updating subjects', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/subjects/9',
            payload: {
                name: 'China'
            }
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should return badRequest if error while deleting subjects', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
                        cache: {
                            drop: async () => jest.fn()
                        }
                    }
                }
            }
        }));
        server = await resetAndMockDB(async allDbs => {
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
            allDbs.subjects.findOne = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/subjects/9'
        });
        expect(res.statusCode).toEqual(400);
    });
    it('should give bad implementation if the cache drop fails while update ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
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
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
        });
        const res = await server.inject({
            method: 'PATCH',
            url: '/subjects/1',
            payload: {
                name: 'China'
            }
        });
        expect(res.statusCode).toEqual(500);
    });
    it('should give bad implementation if the cache drop fails while delete ', async () => {
        jest.doMock('root/server', () => ({
            server: {
                ...server,
                methods: {
                    findOneSubject: {
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
            allDbs.subjects.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return subject;
                }
            });
        });
        const res = await server.inject({
            method: 'DELETE',
            url: '/subjects/1'
        });
        expect(res.statusCode).toEqual(500);
    });
});
