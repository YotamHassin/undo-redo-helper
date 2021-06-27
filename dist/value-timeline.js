"use strict";
/*
npm run dev
node value-timeline
*/
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueTimeLineWrapper = exports.ValueTimeLineSimple = exports.ValueTimeLine = void 0;
// BehaviorSubject, ValueHistoryWrapper as SourcesSingleTyp
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var myy_common_1 = require("myy-common");
var common_1 = require("./common");
//import { BehaviorSubjectWrapper } from "./event-handler";
// StateHistory main saving logic, {past, future}
var ValueTimeLine = /** @class */ (function () {
    function ValueTimeLine() {
        this.past = [];
        this.future = [];
    }
    return ValueTimeLine;
}());
exports.ValueTimeLine = ValueTimeLine;
// getter-setter - undo-redo.
var ValueTimeLineSimple = /** @class */ (function () {
    function ValueTimeLineSimple(initVal) {
        this.timeLine = new ValueTimeLine();
        if (initVal != undefined) {
            // add initVal to past (for undo option)
            this.timeLine.past.push(initVal);
        }
    }
    Object.defineProperty(ValueTimeLineSimple.prototype, "isUndo", {
        get: function () {
            return this.timeLine && this.timeLine.past && this.timeLine.past.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineSimple.prototype.undo = function () {
        if (this.isUndo) {
            // fix history arrays (past, future);
            //const latestPast = this.history.past[this.history.past.length - 1]; // take last one
            var futureWithLatestPast = __spreadArrays([this.value], this.timeLine.future);
            var pastWithoutLatest = this.timeLine.past.slice(0, -1);
            this.timeLine = {
                past: pastWithoutLatest,
                future: futureWithLatestPast
            };
            // fire Event Handler
            //this.fireEventHandler(actionsName.undo);
        }
    };
    Object.defineProperty(ValueTimeLineSimple.prototype, "isRedo", {
        get: function () {
            return this.timeLine && this.timeLine.future && this.timeLine.future.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineSimple.prototype.redo = function () {
        if (this.isRedo) {
            // fix history arrays (past, future);
            var _a = this.timeLine.future, latestFuture = _a[0], futureWithoutLatest = _a.slice(1);
            var pastWithLatestFuture = __spreadArrays(this.timeLine.past, [latestFuture]);
            this.timeLine = {
                //...this.history,
                past: pastWithLatestFuture,
                future: futureWithoutLatest
            };
            // fire Event Handler
            //this.fireEventHandler(actionsName.redo);
        }
    };
    Object.defineProperty(ValueTimeLineSimple.prototype, "value", {
        get: function () {
            // last by BehaviorSubject
            //return this.eventHandler.value;
            // last by history.past array
            if (!this.timeLine) {
                this.timeLine = new ValueTimeLine();
            }
            if (this.timeLine.past) {
                // take last one
                return this.timeLine.past[this.timeLine.past.length - 1];
            }
            else {
                return undefined;
            }
        },
        // new val will remove future
        set: function (newVal) {
            // init history arrays (past, future);
            if (!this.timeLine) {
                this.timeLine = new ValueTimeLine();
            }
            // if new value
            if (this.value !== newVal) {
                // remove redo option
                this.timeLine.future = [];
                // add currnet value
                this.timeLine.past.push(newVal);
                // fire Event Handler
                //this.fireEventHandler(actionsName.set, newVal);
            }
        },
        enumerable: false,
        configurable: true
    });
    return ValueTimeLineSimple;
}());
exports.ValueTimeLineSimple = ValueTimeLineSimple;
// protected EventHandler: BehaviorSubject<Typ>;
// save history for simple data type
// StateHistory for *single item* source data.
// EventHandler && ValueHistory
// ValueHistoryWrapper
//extends BehaviorSubjectWrapper<Typ>
var ValueTimeLineWrapper = /** @class */ (function () {
    function ValueTimeLineWrapper(initVal, handler) {
        this.timeLine = new ValueTimeLine();
        if (initVal != undefined) {
            // add initVal to past (for undo option)
            this.timeLine.past.push(initVal);
            this.eventHandler = new rxjs_1.BehaviorSubject(this.obj('ctor', initVal));
        }
        else {
            this.eventHandler = new rxjs_1.BehaviorSubject(this.obj('ctor'));
        }
        //this._e = this.eventHandler.asObservable();
        if (handler) {
            this.subscribe(handler);
        }
    }
    Object.defineProperty(ValueTimeLineWrapper.prototype, "_e", {
        // can be Observed	
        // has name: string, value: Typ
        get: function () {
            return this.eventHandler.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueTimeLineWrapper.prototype, "e", {
        // cannot bind, init in ctor.
        //pipe = this._e.pipe.bind(this);
        get: function () {
            return this._e.pipe(operators_1.map(myy_common_1.NameTyp.valMap));
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineWrapper.prototype._subscribe = function (handler) {
        return this._e.subscribe(handler);
    };
    ValueTimeLineWrapper.prototype.subscribe = function (handler) {
        return this.e.subscribe(handler);
        //return this.e.subscribe(handler);
    };
    Object.defineProperty(ValueTimeLineWrapper.prototype, "isUndo", {
        // isInProgress = false;
        get: function () {
            return this.timeLine && this.timeLine.past && this.timeLine.past.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineWrapper.prototype.undo = function () {
        if (this.isUndo) {
            // fix history arrays (past, future);
            //const latestPast = this.history.past[this.history.past.length - 1]; // take last one
            var futureWithLatestPast = __spreadArrays([this.value], this.timeLine.future);
            var pastWithoutLatest = this.timeLine.past.slice(0, -1);
            this.timeLine = {
                past: pastWithoutLatest,
                future: futureWithLatestPast
            };
            // fire Event Handler
            this.fireEventHandler(common_1.actionsName.undo);
        }
    };
    Object.defineProperty(ValueTimeLineWrapper.prototype, "isRedo", {
        get: function () {
            return this.timeLine && this.timeLine.future && this.timeLine.future.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineWrapper.prototype.redo = function () {
        if (this.isRedo) {
            // fix history arrays (past, future);
            var _a = this.timeLine.future, latestFuture = _a[0], futureWithoutLatest = _a.slice(1);
            var pastWithLatestFuture = __spreadArrays(this.timeLine.past, [latestFuture]);
            this.timeLine = {
                //...this.history,
                past: pastWithLatestFuture,
                future: futureWithoutLatest
            };
            // fire Event Handler
            this.fireEventHandler(common_1.actionsName.redo);
        }
    };
    Object.defineProperty(ValueTimeLineWrapper.prototype, "value", {
        get: function () {
            // last by BehaviorSubject
            //return this.eventHandler.value;
            // last by history.past array
            if (!this.timeLine) {
                this.timeLine = new ValueTimeLine();
            }
            if (this.timeLine.past) {
                // take last one
                return this.timeLine.past[this.timeLine.past.length - 1];
            }
            else {
                return undefined;
            }
        },
        // new val will remove future
        set: function (newVal) {
            // init history arrays (past, future);
            if (!this.timeLine) {
                this.timeLine = new ValueTimeLine();
            }
            // if new value
            if (this.value !== newVal) {
                // remove redo option
                this.timeLine.future = [];
                // add currnet value
                this.timeLine.past.push(newVal);
                // fire Event Handler
                this.fireEventHandler(common_1.actionsName.set, newVal);
            }
        },
        enumerable: false,
        configurable: true
    });
    ValueTimeLineWrapper.prototype.obj = function (actionName, val) {
        if (actionName === void 0) { actionName = ''; }
        return new myy_common_1.NameTyp(actionName, val || this.value);
    };
    ;
    ValueTimeLineWrapper.prototype.fireEventHandler = function (actionName, val) {
        if (actionName === void 0) { actionName = ''; }
        // fire Event Handler
        // update Observable by arrays
        this.eventHandler.next(this.obj(actionName, val));
    };
    return ValueTimeLineWrapper;
}());
exports.ValueTimeLineWrapper = ValueTimeLineWrapper;
//export type SourcesSingleTyp = ValueHistoryWrapper<>
function test_ValueTimeLineWrapper() {
    var _a;
    // color log
    var testLog = myy_common_1.TestLog.i('Wrapper');
    //testLog.styleString = 'background: azure;color: blue;';
    // if not undefined => add as first value (last undo is always undefined).
    // trigger 0
    //let stateHistory = new ValueTimeLineWrapper(undefined, val => { getLog('stateHistory.eventHandler init test:')(val); });
    var stateHistory = new ValueTimeLineWrapper(undefined, myy_common_1.getLog('stateHistory.eventHandler init test:'));
    // will trigger also on Ctor.
    stateHistory._subscribe(myy_common_1.getLog('stateHistory.eventHandler _subscribe test:'));
    // line brake
    stateHistory.subscribe(function (x) { return console.log(); });
    // trigger 1
    stateHistory.value = 1;
    // will add undefined to history(in ctor undefined will not add)
    stateHistory.value = undefined;
    // trigger custom change.
    stateHistory.fireEventHandler('my custom action', 2);
    // not-trigger, undo array, add undo options 3, 4.
    // to trigger 4 (last) use fireEventHandler
    (_a = stateHistory.timeLine.past).push.apply(_a, [3, 4]);
    // timeLine change => no trigger.
    // timeLine.past change => value change.
    console.log('timeLine.past change, value change, no trigger', stateHistory.value);
    // update Observable by past array, trigger 4 (last from timeLine.past).
    stateHistory.fireEventHandler('past.push');
    // pipe source to make calced data.
    stateHistory.e.pipe(operators_1.map(function (x) { return 'last num is: ' + x; }))
        .subscribe(myy_common_1.getLog('stateHistory simple pipe test:'));
    stateHistory._e.pipe(operators_1.map(function (x) { return JSON.stringify(x); }))
        .subscribe(myy_common_1.getLog('stateHistory complex pipe test:'));
    // line brake
    stateHistory.subscribe(function (x) { return console.log(); });
    // redo array, add redo options, no need to fireEventHandler
    stateHistory.timeLine.future = [5, 6, 7];
    // redo (after undo, or by timeLine.future);
    stateHistory.redo();
    // go back and trigger all subscribers.
    stateHistory.undo();
    //stateHistory.undo();
    console.log('stateHistory.timeLine - past-future', stateHistory.timeLine);
    // log end text.
    testLog.end();
    return stateHistory;
}
//test_ValueTimeLineWrapper();
