import { CacheItem } from "./cacheItem";

/**
 * Order Priorities
 * 
 * 1. newest descending
 * 2. highest called descending
 * 3. manual priority / priority override
 * 
 * It might be worth having a top x% cache in a separate object / array for the most called query.
 * Manual binary lookup passed from specific routes for single queries
 *  to elaborate, if you have a controller that only ever runs 1 query, you could use that query cache ID passed
 *  in order to order that without needing to hash the query and parameters. 
 * 
 * Creating class objects rather than literal objects is slower. They won't be created all that often,
 *  but it's possible to pre-create empty cache items and store them in a pool to re-use.
 */

declare interface IGlobalOptions {
    enabled?: boolean; // is it currently running
    maxCacheLifeTime?: number; // how long can each cache item lasts before being nuked
    maxCacheItems?: number; // maximum number of items can be stored
    maxMemoryCapacity?: number; // maximum amount of memory size before culling cached items from the bottom of the ordered list
    emptyCacheCycle?: number; // how often the whole cache system is emptied
    orderPriority?: number; // in which way to order the objects in cache
    reorderCycle?: number; // how often to run the re-order cycle
    insertNewFirst?: boolean; // insert new cached items on top of the list
    insertNewLast?: boolean; // insert new cached items to the bottom of the list
    ignoreEnvironmentVariables?: boolean; // if the setup of this module should not look for environment variables
}

declare interface ICacheItem {
    hash: string;
    results: Array<any>;
}
declare interface IGlobalCache { [queryKey: string]: CacheItem };

export class QueryCache {
    private _cache: IGlobalCache;
    private _totalMemory: number;
    private _options: IGlobalOptions;
    private _job: NodeJS.Timeout;

    constructor(options: IGlobalOptions = {}) {
        this._options = options;

        this.init();

        if(options.maxCacheLifeTime) {
            this.initializeFullCacheClearCycle(options.emptyCacheCycle);
        }

        // setup the job to check for expired 
        if(options.maxCacheLifeTime) {
            this._options.maxCacheLifeTime = options.maxCacheLifeTime;
        } else {
            this._options.maxCacheLifeTime = 14400;
        }

        this.createMaxLifeJob();
    }

    private initializeFullCacheClearCycle(interval: number): NodeJS.Timeout {
        if(!interval) {
            throw new Error('No full cache clear cycle interval was provided');
        }

        const timer = setInterval(() => {
            console.log('clear the cache');
        }, interval);

        return timer;
    }

    private createMaxLifeJob() {
        this._job = setInterval(() => {
            this.checkForExpiredCache();
        }, this._options.emptyCacheCycle);
    }

    /**
     * Check for expired cache
     * 
     * Has a time complexity of O(n)
     */
    private checkForExpiredCache() {
        // store this so we don't have to lookup every time. 
        // negative about doing this is the end of life is calculated against when the cache cycle was begun, not the specific time
        const curDate: number = Date.now();
        for(var index in this._cache) {
            const cacheItem = this._cache[index];
            if(cacheItem.hasExpired(curDate)) {
                this.recycleItem(cacheItem);
            }
        }
    }

    public recycleItem(cachedItem: CacheItem) {
        // delete the cached item
    }

    public init(): void {
        this._cache = {};
    }

    /**
     * 
     * @param queryKey 
     * @param parameters 
     * 
     * Has a time complexity of O(1)
     */
    public find(queryKey: string, parameters: Array<number | string | string[]>): CacheItem | never {
        const hash = this.generateHash(queryKey, parameters);
        // check that there is a base instance of a query cache from the query key
        if(this._cache[hash]) {
            return this._cache[hash];
        } else {
            return null;
        }
    }

    public createCache (hash: string | number): CacheItem {
        // if the hash has already been used, then kill that cached item
        if(this._cache[hash]) {
            this.recycleItem(this._cache[hash])
        }

        const newCacheItem = new CacheItem(this);
        this._cache[hash] = newCacheItem
        return newCacheItem;
    }

    public getCacheGroup(key: string | number): CacheItem {
        return this._cache[key] || null;
    }

    public nukeCache(): void {
        this._cache = {};
    }

    private generateHash(queryKey: string, parameters: Array<number | string | string[]>): string {
        // need to bench test the join function
        const parameterString = parameters.join('');
        const hash = `${queryKey}-${parameterString}`;
        return hash;
    }

    public get cache(): IGlobalCache {
        return this._cache;
    }

    public get cachedItems() {
        return Object.keys(this._cache).length;
    }

    public get options() {
        return this._options;
    }
}