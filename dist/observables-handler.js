"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservablesHandler = exports.merge = exports.combineLatest = exports.Observable = void 0;
// Subject, no BehaviorSubject
var rxjs_1 = require("rxjs");
Object.defineProperty(exports, "Observable", { enumerable: true, get: function () { return rxjs_1.Observable; } });
Object.defineProperty(exports, "combineLatest", { enumerable: true, get: function () { return rxjs_1.combineLatest; } });
Object.defineProperty(exports, "merge", { enumerable: true, get: function () { return rxjs_1.merge; } });
var operators_1 = require("rxjs/operators");
var myy_common_1 = require("myy-common");
var util_1 = require("util");
var sources_handler_1 = require("./sources-handler");
var common_1 = require("./common");
// *object item{name, value}* source data. (calced data (pipe, ...) will not have undo-redo).
var ObservablesHandler = /** @class */ (function () {
    //constructor(protected sourceHandler: SourcesHandler = SourcesHandler.test()) {
    function ObservablesHandler(observablesObject, sourcesHandler) {
        this.observablesObject = {};
        this.sourcesHandler = new sources_handler_1.SourcesHandler();
        this.generalSubject = new rxjs_1.Subject();
        //super(obj);
        if (observablesObject) {
            this.observablesObject = observablesObject;
        }
        if (sourcesHandler) {
            this.sourcesHandler = sourcesHandler;
        }
    }
    ObservablesHandler.init = function (sourcesHandler) {
        var observablesHandler = new ObservablesHandler();
        if (sourcesHandler) {
            observablesHandler.sourcesHandler = sourcesHandler;
        }
        return observablesHandler;
    };
    Object.defineProperty(ObservablesHandler.prototype, "e", {
        // can be Observed	
        // has propName: string, value: (actionName: string, value: any)
        get: function () {
            return this.generalSubject.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    ObservablesHandler.prototype.subscribeGeneral = function (handler) {
        this.sourcesHandler.subscribeGeneral(handler);
        return this.e.subscribe(handler);
    };
    ObservablesHandler.prototype.hasOwnProperty = function (name) {
        return this.observablesObject.hasOwnProperty(name);
    };
    ObservablesHandler.prototype.get = function (name) {
        if (this.hasOwnProperty(name)) {
            return this.observablesObject[name];
        }
        else {
            return undefined;
        }
    };
    ObservablesHandler.prototype.set = function (name, val) {
        this.observablesObject[name] = val;
    };
    /* getset(name: string, initVal?: any): SourcesSingleTyp<any> {
        let stateHistory = this.get(name);

        // not exist => init & subscribe
        if (!stateHistory) {
            stateHistory = new SourcesSingleTyp<any>(initVal);
            this.set(name, stateHistory);
        }

        return stateHistory;
    } */
    ObservablesHandler.prototype.getArray = function (isAdd) {
        //let sourcesArr: NameTyp<SourcesSingleTyp<any>>[] = this.sourcesHandler.getArray(isAdd);
        //let observablesArr: NameTyp<SourcesSingleTyp<any>>[] = objToArr(this.observablesObject, isAdd);
        //let arr = [...sourcesArr, ...observablesArr];
        var arr = common_1.sortFlat(isAdd, this.observablesObject, this.sourcesHandler.getObj());
        console.log('getArray', arr);
        return arr;
    };
    // get-set as { combineLatest - merge };
    // https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
    // When any observable emits a value, emit the last emitted value from each.
    // combine to array stream
    //_combineLatest = combineLatest.bind(this); // 38 overloads
    ObservablesHandler.prototype.combineLatest = function (isAdd, name) {
        // when one timer emits, emit the latest values from each timer as an array
        var _this = this;
        var tmp = this.getArray(isAdd).map(myy_common_1.NameTyp.valMap).map(function (x) { return x.e; });
        //console.log('SourcesSingleTyp<any>[]', tmp);
        // init
        //let combines: CombineLatestSingleTyp = this._combineLatest(this.getArray(isAdd).map(NameTyp.valMap));
        var combines = rxjs_1.combineLatest(tmp);
        // set
        this.set(name, combines);
        combines.subscribe(function (complex) {
            var eventData = new myy_common_1.NameTyp(name, complex);
            _this.generalSubject.next(eventData);
        });
        return combines;
    };
    // https://www.learnrxjs.io/learn-rxjs/operators/combination/merge
    // Turn multiple observables into a single observable
    ObservablesHandler.prototype.merge = function (name, isAdd) {
        var _this = this;
        var merges = rxjs_1.merge(this.getArray(isAdd).map(myy_common_1.NameTyp.valMap));
        this.set(name, merges);
        merges.subscribe(function (complex) {
            var eventData = new myy_common_1.NameTyp(name, complex);
            _this.generalSubject.next(eventData);
        });
        return merges;
    };
    ObservablesHandler.prototype.pipe = function (name, isAdd) {
        var combines = this.combineLatest(isAdd, name);
        // single level
        //([timerValOne, timerValTwo]) => {}
        combines.pipe(operators_1.map(function (arr) {
            return util_1.inspect(arr);
        })).subscribe(function (inspectStr) {
            console.log('combineLatest: inspectStr', inspectStr);
        });
    };
    return ObservablesHandler;
}());
exports.ObservablesHandler = ObservablesHandler;
