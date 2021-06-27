

// ValueTimeLineWrapper.ts
// node dist\lib\test\ValueTimeLineWrapper.js

import { map } from 'rxjs/operators';

import { TestLog, getLog } from 'myy-common';

import { ValueTimeLineSimple, ValueTimeLineWrapper } from '../value-timeline';

function test_ValueTimeLineSimple(): ValueTimeLineSimple<number> {
	// color log
	let testLog = TestLog.i('Simple');
	//testLog.styleString = 'background: azure;color: blue;';
	
	// if not undefined => add as first value (last undo is always undefined).
	// trigger 0
	let stateHistory: ValueTimeLineSimple<number> = new ValueTimeLineSimple<number>(undefined);

	// trigger 1
	stateHistory.value = 1;

	// will add undefined to history(in ctor undefined will not add)
	stateHistory.value = undefined!;

	// not-trigger, undo array, add undo options 3, 4.
	// to trigger 4 (last) use fireEventHandler
	stateHistory.timeLine.past.push(...[3, 4]);

	// timeLine change.
	// timeLine.past change => value change.
	console.log('timeLine.past change, value change', 
		stateHistory.value);

	// redo array, add redo options, no need to fireEventHandler
	stateHistory.timeLine.future = [5, 6, 7];
	
	// redo (after undo, or by timeLine.future);
	stateHistory.redo();

	console.log('timeLine.future + redo, value change', 
		stateHistory.value);

	// go back.
	stateHistory.undo();

	console.log('stateHistory.timeLine - past-future', stateHistory.value, stateHistory.timeLine);
	
	// log end text.
	testLog.end();

	return stateHistory;
}

function test_ValueTimeLineWrapper(): ValueTimeLineWrapper<number> {
	// color log
	let testLog = TestLog.i('Wrapper');
	//testLog.styleString = 'background: azure;color: blue;';
	
	// if not undefined => add as first value (last undo is always undefined).
	// trigger 0
	let stateHistory: ValueTimeLineWrapper<number> = new ValueTimeLineWrapper<number>(undefined, getLog('stateHistory.eventHandler init test:'));

	// will trigger also on Ctor.
	stateHistory._subscribe(getLog('stateHistory.eventHandler _subscribe test:'));
	// line brake
	stateHistory.subscribe(x=> console.log());

	// trigger 1
	stateHistory.value = 1;

	// will add undefined to history(in ctor undefined will not add)
	stateHistory.value = undefined!;

	// trigger custom change.
	stateHistory.fireEventHandler('my custom action', 2);

	// not-trigger, undo array, add undo options 3, 4.
	// to trigger 4 (last) use fireEventHandler
	stateHistory.timeLine.past.push(...[3, 4]);

	// timeLine change => no trigger.
	// timeLine.past change => value change.
	console.log('timeLine.past change, value change, no trigger', 
		stateHistory.value);

	// update Observable by past array, trigger 4 (last from timeLine.past).
	stateHistory.fireEventHandler('past.push');

	// pipe source to make calced data.
	stateHistory.e.pipe(map(x => 'last num is: ' + x))
		.subscribe(getLog('stateHistory simple pipe test:'));

	stateHistory._e.pipe(map(x => JSON.stringify(x)))
		.subscribe(getLog('stateHistory complex pipe test:'));
	// line brake
	stateHistory.subscribe(x=> console.log());

	// redo array, add redo options, no need to fireEventHandler
	stateHistory.timeLine.future = [5, 6, 7];
	
	// redo (after undo, or by timeLine.future);
	stateHistory.redo();

	// go back and trigger all subscribers.
	stateHistory.undo();

	console.log('stateHistory.timeLine - past-future', stateHistory.timeLine);
	
	// log end text.
	testLog.end();

	return stateHistory;
}

function test() {
	let testLog = TestLog.i('History State');

	test_ValueTimeLineSimple();

	test_ValueTimeLineWrapper();

	testLog.end();
}

test();
