/* global server */
import { init } from './lib/testServer';
import { mockDB } from 'utils/testUtils';
import {
    ONE_USER_DATA,
    ONE_SUBJECT_DATA,
    ONE_USER_SUBJECT_DATA
} from 'utils/constants';

require('jest-extended');

mockDB();

beforeEach(async () => {
    global.server = await init();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
});

beforeAll(() => {
    jest.doMock('root/server', () => ({
        server: {
            ...server,
            methods: {
                findOneUser: id => {
                    if (id === '1') {
                        return new Promise(resolve => resolve(ONE_USER_DATA));
                    } else {
                        return new Promise(resolve => resolve(null));
                    }
                },
                findOneSubject: id => {
                    if (id === '1') {
                        return new Promise(resolve =>
                            resolve(ONE_SUBJECT_DATA)
                        );
                    } else {
                        return new Promise(resolve => resolve(null));
                    }
                },
                findOneUserSubject: id => {
                    if (id === '1') {
                        return new Promise(resolve =>
                            resolve(ONE_USER_SUBJECT_DATA)
                        );
                    } else {
                        return new Promise(resolve => resolve(null));
                    }
                }
            }
        }
    }));
});

afterAll(async () => {
    await server.stop();
});
