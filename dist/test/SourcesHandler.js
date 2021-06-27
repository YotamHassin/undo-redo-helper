"use strict";
// SourcesHandler.ts
// node dist\lib\test\SourcesHandler.js
Object.defineProperty(exports, "__esModule", { value: true });
var myy_common_1 = require("myy-common");
var sources_handler_1 = require("../sources-handler");
var observables_handler_1 = require("../observables-handler");
var operators_1 = require("rxjs/operators");
var util_1 = require("util");
//let testLog = TestLog.i(testName);
//func();
//testLog.end();
function option1(sourcesHandler) {
    // option 1.
    var propertyName1 = 'name 1';
    console.log('-----' + propertyName1 + '-----');
    // trigger General only, no Event Listener, no undo-redo options.
    sourcesHandler.trigger(propertyName1, 'val 1.1'); // actionsName.general
    // not exist, need subscribe || init.
    //sourcesHandler.get(propertyName1);
    //sourcesHandler.undo(propertyName1);
    // subscribe, do with data
    sourcesHandler.subscribe(propertyName1, myy_common_1.getLog(propertyName1 + ' reg:'), 1);
    // trigger, update data
    sourcesHandler.trigger(propertyName1, 2);
    // now after subscribe || init we have undo options.
    sourcesHandler.undo(propertyName1);
}
function option2(sourcesHandler) {
    // option 2.
    var propertyName2 = 'name 2';
    console.log('-----' + propertyName2 + '-----');
    // subscribe (init val) & complex subscribe & trigger
    sourcesHandler.subscribe(propertyName2, myy_common_1.getLog(propertyName2 + ' reg:'), 'init val');
    // subscribe to NameTyp<any>
    // option 1, object way:
    sourcesHandler._subscribe(propertyName2, function (complex) { return console.log(complex.name + ' complex:', complex); });
    // option 2, prop way:
    sourcesHandler._subscribe(propertyName2, function (_a) {
        var changeName = _a.name, newValue = _a.value;
        return console.log(changeName + ' complex:', { changeName: changeName, newValue: newValue });
    });
    // trigger, update data
    sourcesHandler.trigger(propertyName2, 'val 2');
    // todo: track undo/redo.
    sourcesHandler.undo(propertyName2);
}
function option3(sourcesHandler) {
    // option 3.
    var propertyName3 = 'name 3';
    console.log('-----' + propertyName3 + '-----');
    // trigger general subscribe, have undo-redo options
    sourcesHandler.init(propertyName3, 'val 1'); // actionsName.ctor
    sourcesHandler.trigger(propertyName3, 'val 1.1'); // actionsName.set
}
function test_SourcesHandler() {
    var testLog = myy_common_1.TestLog.i('Sources Handler');
    var sourcesHandler = new sources_handler_1.SourcesHandler();
    // Subscribe General - to all previous && next - dataItems && changes.
    // option object way.
    sourcesHandler.subscribeGeneral(function (generalData) { console.log('subscribeGeneral obj {' + generalData.name + '}: ', generalData.value); });
    // option prop way.
    sourcesHandler.subscribeGeneral(function (_a) {
        var dataName = _a.name, _b = _a.value, changeName = _b.name, newValue = _b.value;
        console.log('subscribeGeneral detailed {' + dataName + '}: ', { changeName: changeName, newValue: newValue });
    });
    option1(sourcesHandler);
    option2(sourcesHandler);
    option3(sourcesHandler);
    // todo: combineLatest injection, 
    // 
    function checkSubstrings(string) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            if (string.indexOf(key) === -1) {
                return false;
            }
        }
        return true;
    }
    //checkSubstrings('this is a string', 'is', 'this');   // true
    // when one timer emits, emit the latest values from each timer as an array
    //let combines = combineLatest(sourcesHandler.getArray());
    /* let combines = combineLatest(
        sourcesHandler.get(eventNames.n1).e,
        sourcesHandler.get(eventNames.n2).e,
    ); */
    var combines = observables_handler_1.combineLatest(sourcesHandler.getArray(['name 1', 'name 2'])
        .map(function (x) { return x.value; }));
    /* combines.subscribe(
        //([timerValOne, timerValTwo]) => {
        (arr: StateHistory<any>[]) => {
            console.log('combineLatest: arr', arr);
        }); */
    // single level
    //([timerValOne, timerValTwo]) => {}
    combines.pipe(operators_1.map(function (arr) {
        return util_1.inspect(arr);
    })).subscribe(function (inspectStr) {
        console.log('combineLatest: inspectStr', inspectStr);
    });
    testLog.end();
    return sourcesHandler;
}
test_SourcesHandler();
