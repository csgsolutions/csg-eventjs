/*
 * csg-event.js
 * Justin R. Buchanan
 * Copyright (c) 2016 Cornerstone Solutions Group, Inc
 * Released under the MIT License
 */

(function (undefined) {
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this');
    (function(factory) {
        // Support three module loading scenarios
        if (typeof define === 'function' && define['amd']) {
            // [1] AMD anonymous module
            define(['exports', 'require'], factory);
        } else if (typeof exports === 'object' && typeof module === 'object') {
            // [2] CommonJS/Node.js
            factory(module['exports'] || exports);  // module.exports is for Node.js
        } else {
            // [3] No module loader (plain <script> tag) - put directly in global namespace
            factory(window['csg'] = window['csg'] || {});
        }
    }(function (exports, amdRequire) {

        function Event(async) {
            /// <param name="async">If true, subscriber callbacks will be run via window.setTimeout()</param>
            this._subscribers = [];
            this.async = (async === true);
        }

        Event.prototype.subscribe = function (callback) {
            /// <summary>Subscribes to the event with the specified callback that will be executed when the event is dispatched.</summary>
            /// <param name="callback" type="Function"></param>
            this._subscribers.push(callback);

            return new EventSubscription(this, callback);
        };

        Event.prototype.unsubscribe = function (callback) {
            for (var i = 0; i < this._subscribers.length; i++) {
                if (this._subscribers[i] === callback) {
                    this._subscribers.splice(i, 1);
                }
            }
        };

        Event.prototype.dispatch = function (thisArg, args) {
            /// <summary>Notifies all subscribers of the event by executing their callback.</summary>
            /// <param name="thisArg" type="Object">An object to use as this.</param>
            /// <param name="args" type="Array">An array of arguments.</param>
            var fireAllCallbacks = function () {
                for (var i = 0; i < this._subscribers.length; i++) {
                    this._subscribers[i].apply(thisArg, args);
                }
            }.bind(this);

            if (this.async === true) {
                window.setTimeout(fireAllCallbacks, 0);
            } else {
                fireAllCallbacks();
            }
        };

        Event.prototype.dispose = function () {
            var s;
            while (s = this._subscribers.pop()) {
            }
        }

        function EventSubscription(event, handler) {
            this.event = event;
            this.handler = handler;
        }

        EventSubscription.prototype.dispose = function () {
            if (this.event && this.handler) {
                this.event.unsubscribe(this.handler);
                delete this.event;
                delete this.handler;
            }
        };
        
        exports.Event = Event;
    }))
})();
