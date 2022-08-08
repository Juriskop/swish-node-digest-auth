import { generateHA1, generateHA2, generateResponse, getNonceFromMessageString, getRealmFromMessageString } from './digest-auth-computation';

describe('Digest Auth Computation', () => {
    describe('info extraction', () => {
        it('getNonceFromMessageString', () => {
            expect(
                getNonceFromMessageString(
                    'Digest realm="SWISH user", nonce="MTY1OTcxNzA5MzgzNDplNDQwMDE2NDI5ZGZjNmQyY2I4MmFlZDI5YjQyMmM0Zg==", qop="auth,auth-int"'
                )
            ).toBe('MTY1OTcxNzA5MzgzNDplNDQwMDE2NDI5ZGZjNmQyY2I4MmFlZDI5YjQyMmM0Zg==');
        });

        it('getRealmFromMessageString', () => {
            expect(
                getRealmFromMessageString(
                    'Digest realm="SWISH user", nonce="MTY1OTcxNzA5MzgzNDplNDQwMDE2NDI5ZGZjNmQyY2I4MmFlZDI5YjQyMmM0Zg==", qop="auth,auth-int"'
                )
            ).toBe('SWISH user');
        });

        it('getNonceFromMessageString throws error for unexpected input', () => {
            expect(() =>
                getNonceFromMessageString(
                    'Nothing with a nonce.'
                )
            ).toThrow();
        });

        it('getRealmFromMessageString', () => {
            expect(() =>
                getRealmFromMessageString(
                    'Nothing with a realm.'
                )
            ).toThrow();
        });
    });

    describe('response', () => {
        it('generates response like postman', () => {
            const digestRelevantPart = '/pengine/create';

            const ha1 = generateHA1('some-user', 'SWISH user', 'secret-password');
            // Maybe do something with casing for method
            const ha2 = generateHA2('POST', digestRelevantPart);

            const response = generateResponse(
                ha1,
                ha2,
                'MTY1OTc2ODAzOTg4NToxZjU3YTAyZWI2NDY4ZDUyZWY0ZDU1NGY4NmY4MTFiYg==',
                1,
                '501eb5c18eea6d9a',
                'auth'
            );

            expect(response).toBe('e06062a571eb113846a063f166867cb3');
        });

        it('generates response like postman when counter is not 1', () => {
            const digestRelevantPart = '/pengine/create';

            const ha1 = generateHA1('some-user', 'SWISH user', 'secret-password');
            // Maybe do something with casing for method
            const ha2 = generateHA2('POST', digestRelevantPart);

            const response = generateResponse(
                ha1,
                ha2,
                'MTY1OTc2ODAzOTg4NToxZjU3YTAyZWI2NDY4ZDUyZWY0ZDU1NGY4NmY4MTFiYg==',
                2,
                '501eb5c18eea6d9a',
                'auth'
            );

            expect(response).toBe('e3204bd2d254a00ce9b0b3cfc0f9460f');
        });
    });
});
