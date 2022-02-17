import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';
describe('subjects daos', () => {
    const { MOCK_SUBJECT: mockSubject } = mockData;
    const attributes = ['id', 'name'];
    let subject = {
        name: 'China'
    };
    let subjectId = 1;
    describe('findOneSubject', () => {
        it('should find a subject by ID', async () => {
            const { findOneSubject } = require('daos/subjectsDAO');
            const testSubject = await findOneSubject(1);
            expect(testSubject.id).toEqual(mockSubject.id);
            expect(testSubject.name).toEqual(mockSubject.name);
        });
    });
    it('should call findOne with the correct parameters', async () => {
        let spy;
        await resetAndMockDB(db => {
            spy = jest.spyOn(db.subjects, 'findOne');
        });
        const { findOneSubject } = require('daos/subjectsDao');

        let subjectId = 1;
        await findOneSubject(subjectId);
        expect(spy).toBeCalledWith({
            attributes,
            where: {
                id: subjectId
            }
        });

        jest.clearAllMocks();
        subjectId = 2;
        await findOneSubject(subjectId);
        expect(spy).toBeCalledWith({
            attributes,
            where: {
                id: subjectId
            }
        });
    });
    describe('findAllSubject ', () => {
        it('should find all the subjects', async () => {
            const { findAllSubjects } = require('daos/subjectsDao');
            const { results } = await findAllSubjects(1, 10);
            const firstSubject = results[0];
            expect(firstSubject.id).toEqual(mockSubject.id);
            expect(firstSubject.name).toEqual(mockSubject.name);
        });
    });
    describe('updateOneSubject ', () => {
        it('should update one subject', async () => {
            const { updateOneSubject } = require('daos/subjectsDao');
            let subjectId = 1;
            const updatedSubject = await updateOneSubject(subjectId, subject);
            expect(updatedSubject.id).toEqual(subjectId);
            expect(updatedSubject.name).toEqual(subject.name);
        });
    });
    describe('insertOneSubject ', () => {
        it('should insert one subject', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'create');
            });
            const { insertSubject } = require('daos/subjectsDao');
            await insertSubject(subject);
            expect(spy).toBeCalledWith(subject);
            jest.clearAllMocks();
            let subject = {
                name: 'MATHS'
            };
        });
    });
    describe('deleteOneSubject ', () => {
        it('should delete one subject', async () => {
            const { deleteOneSubject } = require('daos/subjectsDao');
            const deletedResponse = await deleteOneSubject(subjectId);
            expect(deletedResponse).toBe(`Deleted item by id ${subjectId}`);
        });
    });
});
