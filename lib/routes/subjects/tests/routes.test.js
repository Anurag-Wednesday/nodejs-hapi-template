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
});
