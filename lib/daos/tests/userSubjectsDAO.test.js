import { mockData } from 'utils/mockData';
describe('userSubject daos', () => {
    const { MOCK_USER_SUBJECTS: mockUserSubject } = mockData;
    describe('findOneUserSubject', () => {
        it('should find a userSubject by ID', async () => {
            const { findOneUserSubject } = require('daos/userSubjectsDao');
            const testSubject = await findOneUserSubject(1);
            expect(testSubject.id).toEqual(mockUserSubject.id);
            expect(testSubject.userId).toEqual(mockUserSubject.userId);
        });
    });
    describe('findAllUserSubjects ', () => {
        it('should find all the usersubjects', async () => {
            const { findAllUserSubjects } = require('daos/userSubjectsDao');
            const { results } = await findAllUserSubjects(1, 10);
            const firstSubject = results[0];
            expect(firstSubject.id).toEqual(mockUserSubject.id);
            expect(firstSubject.user_id).toEqual(mockUserSubject.userId);
        });
    });
});
