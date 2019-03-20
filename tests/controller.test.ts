import { QueryCache } from '../src/controller';
import { expect } from 'chai';
import 'mocha';

describe('Query Cache Controller', () => {

  it('should correctly instantiate the query cache class', () => {
    const cache = new QueryCache({});
    expect(cache).to.be.instanceOf(QueryCache);
  });

  it('should handle not passing an object to the constructor', () => {
    const cache = new QueryCache();
    expect(cache).to.be.instanceOf(QueryCache);
  });

  it('should initialize the global cache object', () => {
    const controller = new QueryCache();
    expect(controller.cache).to.eql({});
  });
});