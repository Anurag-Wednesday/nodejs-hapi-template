import { mockData } from 'utils/mockData';
import { resetAndMockDB } from 'utils/testUtils';
describe('userSubject daos', () => {
    const { MOCK_USER_SUBJECTS: mockUserSubject } = mockData;
    const userSubject = {
        userId: 1,
        subjectId: 2
    };
    const userSubjectId = 1;
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
    describe('insertOneUserSubject ', () => {
        it('should insert one userSubject', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.user_subjects, 'create');
            });
            const { insertUserSubject } = require('daos/userSubjectsDao');
            await insertUserSubject(userSubject);
            expect(spy).toBeCalledWith(userSubject);
        });
    });
    describe('deleteOneUserSubject ', () => {
        it('should delete one UserSubject', async () => {
            const { deleteOneUserSubject } = require('daos/userSubjectsDao');
            const deletedResponse = await deleteOneUserSubject(userSubjectId);
            expect(deletedResponse).toBe(`Deleted item by id ${userSubjectId}`);
        });
    });
    describe('updateOneUserSubject ', () => {
        it('should update one userSubject', async () => {
            const { updateOneUserSubject } = require('daos/userSubjectsDao');
            let userSubjectId = 1;
            const updatedUserSubject = await updateOneUserSubject(
                userSubjectId,
                userSubject
            );
            expect(updatedUserSubject.id).toEqual(userSubjectId);
            expect(updatedUserSubject.userId).toEqual(mockUserSubject.userId);
        });
    });
});
