import { QueryCache } from '../src/controller';
import { expect } from 'chai';
import 'mocha';

describe('Query Cache Controller', () => {
    it('should be able to access the global options object', () => {
        const cache = new QueryCache();
        const options = cache.options;
        expect(options).to.eql({
            maxCacheLifeTime: 14400
        });
    });

    it('should be able to set and read the emptyCacheCycle option', () => {
        const cache = new QueryCache({emptyCacheCycle: 100000});
        const cycle = cache.options.emptyCacheCycle;
        expect(cycle).to.equal(100000);
    });
});