import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';
describe('subjects daos', () => {
    const { MOCK_SUBJECT: mockSubject } = mockData;
    const attributes = ['id', 'name'];
    let subject = {
        name: 'China'
    };
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
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'update');
            });
            const { updateOneSubject } = require('daos/subjectsDao');
            let subjectId = 1;

            await updateOneSubject(subjectId, subject);
            expect(spy).toBeCalledWith(subject, {
                where: {
                    id: subjectId
                }
            });
            jest.clearAllMocks();
            subjectId = 100;
        });
    });
    describe('insertOneSubject ', () => {
        it('should insert one subject', async () => {
            let spy;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'create');
            });
            const { insertOneSubject } = require('daos/subjectsDao');
            await insertOneSubject(subject);
            expect(spy).toBeCalledWith(subject);
            jest.clearAllMocks();
            let subject = {
                name: 'MATHS'
            };
        });
    });
    describe('deleteOneSubject ', () => {
        it('should delete one subject', async () => {
            let spy;
            const subjectId = 1;
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.subjects, 'destroy');
            });
            const { deleteOneSubject } = require('daos/subjectsDao');
            await deleteOneSubject(subjectId);
            expect(spy).toBeCalledWith({
                where: {
                    id: subjectId
                }
            });
        });
    });
});
