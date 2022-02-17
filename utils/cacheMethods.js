import { findOneSubject } from 'daos/subjectsDao';
import { findOneUserSubject } from 'daos/userSubjectsDao';
import { findOneUser } from 'daos/userDao';
import { redisCacheType } from 'utils/cacheConstants';

export const cachedUser = async server => {
    await server.method('findOneUser', findOneUser, {
        generateKey: id => `${id}`,
        cache: redisCacheType
    });
};

export const cachedSubject = async server => {
    await server.method('findOneSubject', findOneSubject, {
        generateKey: id => `${id}`,
        cache: redisCacheType
    });
};
export const cachedUserSubject = async server => {
    await server.method('findOneUserSubject', findOneUserSubject, {
        generateKey: id => `${id}`,
        cache: redisCacheType
    });
};
