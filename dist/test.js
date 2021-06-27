"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var value_timeline_1 = require("./value-timeline");
var myy_common_1 = require("myy-common");
var value_timeline_2 = require("./value-timeline");
var myy_common_2 = require("myy-common");
var operators_1 = require("rxjs/operators");
function test_ValueTimeLineSimple() {
    var _a;
    // color log
    var testLog = myy_common_1.TestLog.i('Simple');
    //testLog.styleString = 'background: azure;color: blue;';
    // if not undefined => add as first value (last undo is always undefined).
    var stateHistory = new value_timeline_1.ValueTimeLineSimple(undefined);
    // value 1
    stateHistory.value = 1;
    // will add undefined to history(in ctor undefined will not add)
    stateHistory.value = undefined;
    console.log('timeLine, value change', stateHistory.value, stateHistory.timeLine);
    // undo array, add undo options 3, 4.
    (_a = stateHistory.timeLine.past).push.apply(_a, [3, 4]);
    // timeLine change.
    // timeLine.past change => value change.
    console.log('timeLine.past change, value change', stateHistory.value, stateHistory.timeLine);
    // redo array, add redo options, no need to fireEventHandler
    stateHistory.timeLine.future = [5, 6, 7];
    // redo (after undo, or by timeLine.future);
    stateHistory.redo();
    console.log('timeLine.future + redo, value change', stateHistory.value);
    // go back.
    stateHistory.undo();
    //stateHistory.redo();
    console.log('stateHistory.timeLine - past-future', stateHistory.value, stateHistory.timeLine);
    // log end text.
    testLog.end();
    return stateHistory;
}
//test_ValueTimeLineSimple();
function test_ValueTimeLineWrapper() {
    var _a;
    // color log
    var testLog = myy_common_1.TestLog.i('Wrapper');
    //testLog.styleString = 'background: azure;color: blue;';
    // if not undefined => add as first value (last undo is always undefined).
    // trigger 0
    //let stateHistory = new ValueTimeLineWrapper(undefined, val => { getLog('stateHistory.eventHandler init test:')(val); });
    var stateHistory = new value_timeline_2.ValueTimeLineWrapper(undefined, myy_common_2.getLog('stateHistory.eventHandler init test:'));
    // will trigger also on Ctor.
    stateHistory._subscribe(myy_common_2.getLog('stateHistory.eventHandler _subscribe test:'));
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
        .subscribe(myy_common_2.getLog('stateHistory simple pipe test:'));
    stateHistory._e.pipe(operators_1.map(function (x) { return JSON.stringify(x); }))
        .subscribe(myy_common_2.getLog('stateHistory complex pipe test:'));
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
