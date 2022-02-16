import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('subjects daos', () => {
    const { MOCK_SUBJECT: mockSubject } = mockData;
    const attributes = ['id', 'name'];
    describe('findOneSubject', () => {
        it('should find a subject by ID', async () => {
            const { findOneSubject } = require('daos/subjectsDAO');
            const testSubject = await findOneSubject(1);
            expect(testSubject.id).toEqual(1);
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
            const { allSubjects } = await findAllSubjects(1, 10);
            const firstSubject = allSubjects[0];
            expect(firstSubject.id).toEqual(1);
            expect(firstSubject.name).toEqual(mockSubject.name);
        });
    });
});
