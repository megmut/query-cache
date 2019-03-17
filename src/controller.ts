import { CacheItem } from "./cacheItem";

/**
 * Order Priorities
 * 
 * 1. newest descending
 * 2. highest called descending
 * 3. 
 * 
 * It might be worth having a top x% cache in a separate object / array for the most called query.
 * Manual binary lookup passed from specific routes for single queries
 *  to elaborate, if you have a controller that only ever runs 1 query, you could use that query cache ID passed
 *  in order to order that without needing to hash the query and parameters. 
 * 
 */

declare interface IGlobalOptions {
    enabled: boolean; // is it currently running
    maxCacheLifeTime: number; // how long can each cache item lasts before being nuked
    maxCacheItems: number; // maximum number of items can be stored
    maxMemoryCapacity: number; // maximum amount of memory size before culling cached items from the bottom of the ordered list
    fullClearCycle: number; // how often the whole cache system is emptied
    orderPriority: number; // in which way to order the objects in cache
    reorderCycle: number; // how often to run the re-order cycle
    insertNewFirst: boolean; // insert new cached items on top of the list
    insertNewLast: boolean; // insert new cached items to the bottom of the list
    ignoreEnvironmentVariables: boolean; // if the setup of this module should not look for environment variables
}

declare interface ICacheItem {
    hash: string;
    results: Array<any>;
}

declare interface ICache {
    cachedQueries: Array<ICacheItem>;
}

export class CacheController {
    private static _cache: { [queryKey: string]: ICache };
    private static _totalMemory: number;

    constructor(options: IGlobalOptions) {

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

    public recycleItem(cachedItem: CacheItem) {
        // delete the cached item
    }

    public static init() {
        CacheController._cache = {};
    }

    public static helloWorld(): string {
        return 'Hello world!';
    }

    public static findInCache(queryKey: string, parameters: Array<number | string | string[]>): Array<any> | false | never {
        // check that there is a base instance of a query cache from the query key
        if(CacheController._cache[queryKey]) {
            // store a locally scoped cachedQueries array for faster lookup
            let cachedQueries = CacheController._cache[queryKey].cachedQueries;

            // generate a new hash from the queryKey and the parameters
            let hashLookup = CacheController.generateHash(queryKey, parameters);

            // loop through each cached item of the query
            for(let cacheItem of cachedQueries) {
                // if the new hash is the same as the hash in the cache, then return the cached results
                if(hashLookup === cacheItem.hash) {
                    return cacheItem.results;
                } else {
                    return false;
                }
            }

            // if there are no cachedQueries, but it exists as an empty array, then return null
            return false;
        } else {
            return false;
        }
    }

    public static createCache (queryKey: string, parameters: Array<number | string | string[]>, results: Array<any>): void {
        // if a array entry of cached queries doesn't exist under the query key, then create it
        if(!CacheController._cache[queryKey]) {
            CacheController._cache[queryKey] = { cachedQueries: [] };
        }

        // create a new cache item object with a hash of the query key and parameters
        let cacheItem: ICacheItem = {
            hash: CacheController.generateHash(queryKey, parameters),
            results: results
        };

        // add the new cache item to the array of cached queries
            CacheController._cache[queryKey].cachedQueries.push(cacheItem);
    }

    public static removeFromCache(queryKey: string | string[]): void {
        if(typeof(queryKey) === 'string') {
            delete CacheController._cache[queryKey];
        } else {
            for(let key of queryKey) {
                delete CacheController._cache[key];
            }
        }
    }

    public static nukeCache(): void {
        CacheController._cache = {};
    }

    private static generateHash(queryKey: string, parameters: Array<number | string | string[]>): string {
        // return SHA1.createHash('sha1').update(queryKey + ',' + parameters.concat(',')).digest('base64');
        // need to swap SHA1 for a custom function
        return '';
    }

    public static get cachedItems() {
        return Object.keys(CacheController._cache).length;
    }
}