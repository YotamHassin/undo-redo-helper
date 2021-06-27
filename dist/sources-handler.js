"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourcesHandler = void 0;
// Sources-handler
// BehaviorSubject for SingleTyp(ValueHistory), Subject for GroupeTyp(subscribeGeneral)
var rxjs_1 = require("rxjs");
var myy_common_1 = require("myy-common");
var common_1 = require("./common");
var value_timeline_1 = require("./value-timeline");
var value_timeline_2 = require("./value-timeline");
Object.defineProperty(exports, "SourcesSingleTyp", { enumerable: true, get: function () { return value_timeline_2.ValueTimeLineWrapper; } });
// multy StateHistory for *object item{name, value}* source data. (calced data (pipe, ...) will not have undo-redo).
var SourcesHandler = /** @class */ (function () {
    function SourcesHandler(sourcesObject) {
        this.sourcesObject = {};
        this.generalSubject = new rxjs_1.Subject();
        //super(sourcesObject);
        if (sourcesObject) {
            this.sourcesObject = sourcesObject;
        }
    }
    Object.defineProperty(SourcesHandler.prototype, "e", {
        // can be Observed	
        // has propName: string, value: (actionName: string, value: any)
        get: function () {
            return this.generalSubject.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    SourcesHandler.prototype.subscribeGeneral = function (handler) {
        return this.e.subscribe(handler);
    };
    SourcesHandler.prototype.hasOwnProperty = function (name) {
        return this.sourcesObject.hasOwnProperty(name);
    };
    SourcesHandler.prototype.get = function (name) {
        if (this.hasOwnProperty(name)) {
            return this.sourcesObject[name];
        }
        else {
            return undefined;
        }
    };
    SourcesHandler.prototype.set = function (name, stateHistory) {
        var _this = this;
        // _subscribe general
        //let eventData: NameTyp<NameTyp<any>>;
        stateHistory._subscribe(function (complex) {
            var eventData = new myy_common_1.NameTyp(name, complex);
            _this.generalSubject.next(eventData);
        });
        this.sourcesObject[name] = stateHistory;
    };
    SourcesHandler.prototype.init = function (name, initVal) {
        var stateHistory = this.get(name);
        // not exist => init & subscribe
        if (!stateHistory) {
            stateHistory = new value_timeline_1.ValueTimeLineWrapper(initVal);
            this.set(name, stateHistory);
        }
        return stateHistory;
    };
    SourcesHandler.prototype.undo = function (name) {
        var stateHistory = this.get(name);
        stateHistory.undo();
        return stateHistory;
    };
    SourcesHandler.prototype.redo = function (name) {
        var stateHistory = this.get(name);
        stateHistory.redo();
        return stateHistory;
    };
    SourcesHandler.prototype._subscribe = function (name, handler, initVal) {
        /* let stateHistory = this.get(name);

        // not exist => init & subscribe
        if (!stateHistory) {
            stateHistory = new StateHistory<any>(initVal);
            this.set(name, stateHistory);
        } */
        // get || not exist => init & subscribe
        var stateHistory = this.init(name, initVal);
        // subscribe
        return stateHistory._subscribe(handler);
    };
    SourcesHandler.prototype.subscribe = function (name, handler, initVal) {
        // get || not exist => init & subscribe
        var stateHistory = this.init(name, initVal);
        // subscribe
        return stateHistory.subscribe(handler);
    };
    SourcesHandler.prototype.trigger = function (name, val) {
        // no such prop, trigger general
        if (!this.hasOwnProperty(name)) {
            var eventData = new myy_common_1.NameTyp(common_1.actionsName.general, val);
            var triggerData = new myy_common_1.NameTyp(name, eventData);
            this.generalSubject.next(triggerData);
            return undefined;
        }
        var stateHistory = this.get(name);
        if (stateHistory) {
            stateHistory.value = val;
            return stateHistory;
        }
        else {
            return undefined;
        }
    };
    SourcesHandler.prototype.getObj = function () {
        return Object.assign({}, this.sourcesObject);
    };
    SourcesHandler.prototype.getArray = function (isAdd) {
        return myy_common_1.objToArr(this.sourcesObject, isAdd);
    };
    return SourcesHandler;
}());
exports.SourcesHandler = SourcesHandler;
