# Query Cache
Fast light weight MySQL query cache management tool

[![CircleCI](https://circleci.com/gh/megmut/query-cache.svg?style=svg)](https://circleci.com/gh/megmut/query-cache)

### Recycling Cache
Recycling cache happens in a few different ways.
1. Cycle timer job
2. Max cache items exceeded
3. Max memory exceeded

During the memory cycle timer, the current time is stored temporarily in order to reduce overhead.
Each cache entry's end of life is compared with the 'current time' from the previous step. The frequency of the cycle job depends on configuration, but defaults to 14400 seconds (4 hours).

When the maximum number of cache items has been exceeded, then any new cache can override existing cache. How it does this depends on your configuration. But by default, it will push out the lowest priority or least used cache item. If it's not used, then it will likely be replaced. If it's being used regularly, then it will work it's way up the list to have a much higher priority.

If the maximum memory is exceeded, the steps above in the maximum number of cache items is followed. The logic behind this stays the same.

### Tests
To run all tests, run 
```npm test```

To run a specific testing file, run
```mocha --exit -r ts-node/register tests/specific_file.test.ts```
or
```node_modules/mocha/bin/mocha --exit -r ts-node/register tests/controller.test.ts```
