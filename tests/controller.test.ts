import { CacheController } from '../src/controller';
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {

  it('should return hello world', () => {
    const result = CacheController.helloWorld();
    expect(result).to.equal('Hello world!');
  });

});