import { CacheController } from './controller';

export class CacheItem {
    private controller: CacheController;
    private _endOfLife: number;

    constructor(controller: CacheController, lifespan: number) {
        this.controller = controller;
        this._endOfLife = lifespan + Date.now();
    }

    private checkLifeSpan() {
        if(this._endOfLife <= Date.now()) {
            this.controller.recycleItem(this);
        }
    }
}