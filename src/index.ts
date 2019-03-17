declare interface ICacheItem {
    hash: string;
    results: Array<any>;
}

declare interface ICache {
    cachedQueries: Array<ICacheItem>;
}

export class CacheController {
    private static _cache: { [queryKey: string]: ICache };

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