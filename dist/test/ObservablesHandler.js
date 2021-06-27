"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test.ts
var util_1 = require("util");
var operators_1 = require("rxjs/operators");
var myy_common_1 = require("myy-common");
var observables_handler_1 = require("../observables-handler");
function test_ObservablesHandler() {
    var testLog = myy_common_1.TestLog.i('Observables Handler');
    var observablesHandler = new observables_handler_1.ObservablesHandler();
    // option prop way.
    observablesHandler.subscribeGeneral(function (_a) {
        var dataName = _a.name, _b = _a.value, changeName = _b.name, newValue = _b.value;
        console.log('subscribeGeneral detailed {' + dataName + '}: ', { changeName: changeName, newValue: newValue });
    });
    var propertyName1 = 'name 1 - will be number';
    console.log('-----' + propertyName1 + '-----');
    // trigger, update data
    observablesHandler.sourcesHandler.init(propertyName1, 2);
    var propertyName2 = 'name 2 - will be string';
    console.log('-----' + propertyName2 + '-----');
    // trigger, update data
    observablesHandler.sourcesHandler.init(propertyName2, 'some str');
    var propertyName_combines = 'combines';
    var combines = observablesHandler.combineLatest([propertyName1, propertyName2], propertyName_combines);
    // single level
    //([timerValOne, timerValTwo]) => {}
    combines.pipe(operators_1.map(function (arr) {
        return util_1.inspect(arr);
    })).subscribe(function (inspectStr) {
        console.log('combineLatest: inspectStr', inspectStr);
    });
    observablesHandler.sourcesHandler.trigger(propertyName1, 3);
    testLog.end();
    return observablesHandler;
}
test_ObservablesHandler();
