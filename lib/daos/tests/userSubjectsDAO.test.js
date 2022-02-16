import { mockData } from 'utils/mockData';
describe('userSubject daos', () => {
    const { MOCK_USER_SUBJECTS: mockUserSubjects } = mockData;
    describe('findOneUserSubject', () => {
        it('should find a userSubject by ID', async () => {
            const { findOneUserSubject } = require('daos/userSubjectsDao');
            const testSubject = await findOneUserSubject(1);
            expect(testSubject.id).toEqual(1);
            expect(testSubject.userId).toEqual(mockUserSubjects.userId);
        });
    });
    describe('findAllUserSubjects ', () => {
        it('should find all the usersubjects', async () => {
            const { findAllUserSubjects } = require('daos/userSubjectsDao');
            const { allUserSubjects } = await findAllUserSubjects(1, 10);
            const firstSubject = allUserSubjects[0];
            expect(firstSubject.id).toEqual(1);
            expect(firstSubject.userId).toEqual(mockUserSubjects.userId);
        });
    });
});
