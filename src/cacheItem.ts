import { QueryCache } from './controller';

export class CacheItem {
    private controller: QueryCache;
    private _endOfLife: number;

    constructor(controller: QueryCache, lifespan: number = controller.options.maxCacheLifeTime) {
        this.controller = controller;
        // inherit the date now from the create hash function to avoid Date.now call twice
        this._endOfLife = lifespan + Date.now();
    }

    private checkLifeSpan() {
        if(this._endOfLife <= Date.now()) {
            this.controller.recycleItem(this);
        }
    }

    public get endOfLife(): number {
        return this._endOfLife;
    }
}