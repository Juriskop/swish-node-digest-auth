import * as crypto from 'crypto';

export const getNonceFromMessageString = (message: string): string => {
    const regexp = /nonce="(?<value>.+?)"/;
    const match = regexp.exec(message);

    if (!match || !match.groups) {
        throw new Error('Nonce value not found.');
    }

    return match.groups.value;
};

export const getRealmFromMessageString = (message: string): string => {
    const regexp = /realm="(?<value>.+?)"/;
    const match = regexp.exec(message);

    if (!match || !match.groups) {
        throw new Error('Realm value not found.');
    }
    return match.groups.value;
};

const md5Hex = (input: string): string => {
    const md5Hasher = crypto.createHash('md5');
    return md5Hasher.update(input).digest('hex');
};

export const generateHA1 = (username: string, realm: string, password: string): string => {
    return md5Hex(`${username}:${realm}:${password}`);
};

export const generateHA2 = (method: string, digestURI: string): string => {
    return md5Hex(`${method}:${digestURI}`);
};

export const generateResponse = (ha1: string, ha2: string, nonce: string, nonceCount: number, cNonce: string, qop: string): string => {
    const paddedCount = nonceCount.toString(10).padStart(8, '0');
    return md5Hex(`${ha1}:${nonce}:${paddedCount}:${cNonce}:${qop}:${ha2}`);
};

export const generateClientNonce = (): string => {
    return '501eb5c18eea6d9a';
};
