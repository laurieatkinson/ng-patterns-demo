import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalEventsService {
    private routingStartedSource = new Subject<void>();
    routingStarted = this.routingStartedSource.asObservable();
    private routingCompleteSource = new Subject<void>();
    routingComplete = this.routingCompleteSource.asObservable();
    private loadingDataStartedSource = new Subject<void>();
    loadingDataStarted = this.loadingDataStartedSource.asObservable();
    private loadingDataCompleteSource = new Subject<void>();
    loadingDataComplete = this.loadingDataCompleteSource.asObservable();
    private _isBusyRouting = false;

    get isBusyRouting() {
        return this._isBusyRouting;
    }

    startRouting() {
        this._isBusyRouting = true;
        this.routingStartedSource.next();
    }

    completeRouting() {
        this._isBusyRouting = false;
        this.routingCompleteSource.next();
    }

    startLoadingData() {
        this.loadingDataStartedSource.next();
    }

    completeLoadingData() {
        this.loadingDataCompleteSource.next();
    }
}
