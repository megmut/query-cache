import { QueryCache } from './controller';

export class CacheItem {
    private controller: QueryCache;
    private _endOfLife: number;

    constructor(controller: QueryCache, lifespan: number = controller.options.maxCacheLifeTime) {
        this.controller = controller;
        // inherit the date now from the create hash function to avoid Date.now call twice
        this._endOfLife = lifespan + Date.now();
    }

    public hasExpired(comparisonDate: number): Boolean {
        if(this._endOfLife <= comparisonDate) {
            return true;
        } else {
            return false;
        }
    }

    public get endOfLife(): number {
        return this._endOfLife;
    }
}