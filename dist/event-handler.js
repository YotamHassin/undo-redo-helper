"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorSubjectGetSet = exports.BehaviorSubjectWrapper = void 0;
// event-handler
var myy_common_1 = require("myy-common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var common_1 = require("./common");
//var eventHandler = new BehaviorSubject<string>('');
//export class EventHandler { }
// add fireEventHandler with actionName, option to BehaviorSubject.
var BehaviorSubjectWrapper = /** @class */ (function () {
    function BehaviorSubjectWrapper(initVal, handler) {
        this.eventHandler = new rxjs_1.BehaviorSubject(this.obj('ctor', initVal));
        //this._e = this.eventHandler.asObservable();
        if (handler) {
            this.subscribe(handler);
        }
    }
    Object.defineProperty(BehaviorSubjectWrapper.prototype, "_e", {
        // can be Observed	
        // has name: string, value: Typ
        get: function () {
            return this.eventHandler.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BehaviorSubjectWrapper.prototype, "e", {
        // cannot bind, init in ctor.
        //pipe = this._e.pipe.bind(this);
        get: function () {
            return this._e.pipe(operators_1.map(myy_common_1.NameTyp.valMap));
        },
        enumerable: false,
        configurable: true
    });
    BehaviorSubjectWrapper.prototype._subscribe = function (handler) {
        return this._e.subscribe(handler);
    };
    BehaviorSubjectWrapper.prototype.subscribe = function (handler) {
        return this.e.subscribe(handler);
        //return this.e.subscribe(handler);
    };
    Object.defineProperty(BehaviorSubjectWrapper.prototype, "value", {
        get: function () {
            // last by BehaviorSubject
            return this.eventHandler.value.value;
        },
        enumerable: false,
        configurable: true
    });
    BehaviorSubjectWrapper.prototype.obj = function (actionName, val) {
        if (actionName === void 0) { actionName = ''; }
        return new myy_common_1.NameTyp(actionName, val || this.value);
    };
    ;
    BehaviorSubjectWrapper.prototype.fireEventHandler = function (actionName, val) {
        if (actionName === void 0) { actionName = ''; }
        // fire Event Handler
        // update Observable by arrays
        this.eventHandler.next(this.obj(actionName, val));
    };
    BehaviorSubjectWrapper.prototype.complete = function () {
        this.fireEventHandler(common_1.actionsName.complete);
        this.eventHandler.complete();
    };
    return BehaviorSubjectWrapper;
}());
exports.BehaviorSubjectWrapper = BehaviorSubjectWrapper;
// add get-set options to BehaviorSubject.
var BehaviorSubjectGetSet = /** @class */ (function (_super) {
    __extends(BehaviorSubjectGetSet, _super);
    function BehaviorSubjectGetSet(initVal, handler) {
        return _super.call(this, initVal, handler) || this;
    }
    Object.defineProperty(BehaviorSubjectGetSet.prototype, "value", {
        // new val will remove future
        set: function (newVal) {
            // if new value
            if (this.value !== newVal) {
                // fire Event Handler
                this.fireEventHandler(common_1.actionsName.set, newVal);
            }
        },
        enumerable: false,
        configurable: true
    });
    return BehaviorSubjectGetSet;
}(BehaviorSubjectWrapper));
exports.BehaviorSubjectGetSet = BehaviorSubjectGetSet;
var MyWrapper = /** @class */ (function () {
    function MyWrapper(initVal) {
        this.eventHandler = new rxjs_1.BehaviorSubject(this.obj('ctor', initVal));
    }
    Object.defineProperty(MyWrapper.prototype, "name_value", {
        get: function () {
            return this.eventHandler.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyWrapper.prototype, "value", {
        get: function () {
            return this.name_value.value;
        },
        enumerable: false,
        configurable: true
    });
    MyWrapper.prototype.obj = function (actionName, val) {
        if (actionName === void 0) { actionName = ''; }
        return new myy_common_1.NameTyp(actionName, val || this.value);
    };
    ;
    MyWrapper.prototype.next = function (value) {
        this.eventHandler.next(value);
        return this;
    };
    return MyWrapper;
}());
