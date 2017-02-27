/*
 * csg-event.js
 * Justin R. Buchanan
 * Copyright (c) 2017 Cornerstone Solutions Group, Inc
 * Released under the MIT License
 */

export interface IDisposable {
    dispose(): void
}

export interface ISubscribable {
    subscribe(...args: any[]): any;
}

export class Event implements IDisposable {

    /** Initializes a new instance.
     * @param runAsync If true, ensures that event liseners always run async from the dispatch method via setTimeout().
     *
     */
    constructor(runAsync: boolean=false) {
        this._subscribers = [];        
        this.async = (runAsync === true);
    }

    public async: boolean;
    private _subscribers: any[];
    private _isDisposed: boolean = false;

    /** Subscribes to the event with the specified callback that will be executed when the event is dispatched. */
    public subscribe(callback: Function): EventSubscription {
        this._subscribers.push(callback);

        return new EventSubscription(this, callback);
    }

    /** Unsubscribes the given callback from the event. */
    public unsubscribe(callback: Function): void {
        for (let i = 0; i < this._subscribers.length; i++) {
            if (this._subscribers[i] === callback) {
                this._subscribers.splice(i, 1);
            }
        }
    }

    /** Notifies all subscribers of the event by executing their callback. */
    public dispatch(thisArg, args:Array<any>): void {
        var fireAllCallbacks = () => {
            for (let i = 0; i < this._subscribers.length; i++) {
                this._subscribers[i].apply(thisArg, args);
            }
        };

        if (this.async === true) {
            setTimeout(fireAllCallbacks, 1);
        } else {
            fireAllCallbacks();
        }
    }

    public dispose(): void {
        if (this._isDisposed){
            return;
        }
        var s;
        while (s = this._subscribers.pop()) {
        }
    }
};

/** Represents a single subscription to an event. */
export class EventSubscription {
    constructor(event: Event, handler: Function) {
        this.event = event;
        this.handler = handler;
    };

    protected event: Event;
    protected handler: Function;

    /** Unsubscribes the handler from the associated event. */
    public dispose() {
        if (this.event && this.handler) {
            this.event.unsubscribe(this.handler);
            delete this.event;
            delete this.handler;
        }
    };
}

/** Provides a class that manages various event subscriptions that can all be disposed at once. */
export class SubscriptionManager implements IDisposable {
    protected _disposables: IDisposable[] = [];
    protected _isDisposed: boolean = false;

    public subscribe(subscribable: ISubscribable, ...args: any[]){
        var disposable;
        if (this._isDisposed) {
            throw new Error('Invalid operation: The subscription handler has already been disposed.');
        }

        if (subscribable == null) {
            throw new TypeError('The value provided for parameter subscribable must not be null');
        }

        if (typeof subscribable.subscribe !== 'function') {
            throw new TypeError('The subscribable must have a subscribe method that returns a disposable.');
        }

        disposable = subscribable.subscribe.apply(subscribable, Array.prototype.slice.call(arguments, 1));

        if (disposable == null || typeof disposable.dispose !== 'function') {
            throw new TypeError('The return value from the subscribe method is null or not a disposable.');
        }

        this._disposables.push(disposable);

        return disposable;
    }

    public on(elementOrSelector: string|Element, events: string|string[], callback:  (e: any) => void) {
        if (this._isDisposed) {
            throw new Error('Invalid operation: The subscription handler has already been disposed.');
        }

        let element: Element;

        if (typeof elementOrSelector === "string" && /^#/.test(elementOrSelector)){
            element = document.getElementById(elementOrSelector.substring(1));
        } else if (typeof elementOrSelector === "string"){
            element = document.querySelector(elementOrSelector);
        } else {
            element = elementOrSelector;
        }

        if (element == null){
            throw new Error("The given element or selector is not valid.");
        }

        if (typeof events === "string"){
            element.addEventListener(events, callback, false)
            this._disposables.push({
                dispose: () => {
                    element.removeEventListener(events, callback);
                }
            });
        } else if (typeof events === "object" && events.forEach){
            events.forEach(eventName => element.addEventListener(eventName, callback, false));
            this._disposables.push({
                dispose: () => {
                    events.forEach(eventName => element.removeEventListener(eventName, callback));
                }
            });
        }
    };

    public add(disposable: IDisposable) {
        if (this._isDisposed) {
            throw new Error('Invalid operation: The subscription handler has already been disposed.');
        }
        this._disposables.push(disposable);
    };

    public dispose(): void {
        var d;

        if (this._isDisposed) {
            return;
        }

        while (d = this._disposables.pop()) {
            d.dispose();
        }

        this._isDisposed = true;
    };
};