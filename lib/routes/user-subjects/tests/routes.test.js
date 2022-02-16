import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { MOCK_USER_SUBJECTS: userSubject } = mockData;

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
        expect(userSubjectOne.id).toEqual(userSubject.id);
        expect(userSubjectOne.user_id).toEqual(userSubject.userId);
        expect(userSubjectOne.subject_id).toEqual(userSubject.subjectId);
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
        expect(userSubjectOne.id).toEqual(userSubject.id);
    });
});
