

// SourcesHandler.ts
// node dist\lib\test\SourcesHandler.js

import { TestLog, NameTyp, getLog } from 'myy-common';
import { SourcesHandler, SourcesSingleTyp } from '../sources-handler';
import { combineLatest } from '../observables-handler';
import { map } from 'rxjs/operators';
import { inspect } from 'util';

//let testLog = TestLog.i(testName);
//func();
//testLog.end();

function option1(sourcesHandler: SourcesHandler) {
	// option 1.
	let propertyName1 = 'name 1'
	console.log('-----' + propertyName1 + '-----');

	// trigger General only, no Event Listener, no undo-redo options.
	sourcesHandler.trigger(propertyName1, 'val 1.1'); // actionsName.general

	// not exist, need subscribe || init.
	//sourcesHandler.get(propertyName1);
	//sourcesHandler.undo(propertyName1);

	// subscribe, do with data
	sourcesHandler.subscribe(propertyName1,
		getLog(propertyName1 + ' reg:'),
		1);

	// trigger, update data
	sourcesHandler.trigger(propertyName1, 2);

	// now after subscribe || init we have undo options.
	sourcesHandler.undo(propertyName1);

}

function option2(sourcesHandler: SourcesHandler) {
	// option 2.
	let propertyName2 = 'name 2'
	console.log('-----' + propertyName2 + '-----');

	// subscribe (init val) & complex subscribe & trigger
	sourcesHandler.subscribe(propertyName2,
		getLog(propertyName2 + ' reg:'),
		'init val');

	// subscribe to NameTyp<any>
	// option 1, object way:
	sourcesHandler._subscribe(propertyName2,
		(complex) => console.log(complex.name + ' complex:', complex)
	);

	// option 2, prop way:
	sourcesHandler._subscribe(propertyName2,
		({ name: changeName, value: newValue }) => console.log(changeName + ' complex:', { changeName, newValue })
	);

	// trigger, update data
	sourcesHandler.trigger(propertyName2, 'val 2');

	// todo: track undo/redo.
	sourcesHandler.undo(propertyName2);

}

function option3(sourcesHandler: SourcesHandler) {
	// option 3.
	let propertyName3 = 'name 3'
	console.log('-----' + propertyName3 + '-----');
	// trigger general subscribe, have undo-redo options
	sourcesHandler.init(propertyName3, 'val 1'); // actionsName.ctor
	sourcesHandler.trigger(propertyName3, 'val 1.1'); // actionsName.set

}

function test_SourcesHandler(): SourcesHandler {
	let testLog = TestLog.i('Sources Handler');

	var sourcesHandler = new SourcesHandler();

	// Subscribe General - to all previous && next - dataItems && changes.
	// option object way.
	sourcesHandler.subscribeGeneral(
		(generalData: NameTyp<NameTyp<any>>) => { console.log('subscribeGeneral obj {' + generalData.name + '}: ', generalData.value); }
	);

	// option prop way.
	sourcesHandler.subscribeGeneral(
		({ name: dataName, value: { name: changeName, value: newValue } }: NameTyp<NameTyp<any>>) => { console.log('subscribeGeneral detailed {' + dataName + '}: ', { changeName, newValue }) }
	);

	option1(sourcesHandler);

	option2(sourcesHandler);

	option3(sourcesHandler);
	// todo: combineLatest injection, 

	// 
	function checkSubstrings(string: string, ...keys: string[]) {
		for (var key of keys) {
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

	let combines = combineLatest(
		sourcesHandler.getArray(['name 1', 'name 2'])
			.map(x => x.value)
	);

	/* combines.subscribe(
		//([timerValOne, timerValTwo]) => {
		(arr: StateHistory<any>[]) => {
			console.log('combineLatest: arr', arr);
		}); */

	// single level
	//([timerValOne, timerValTwo]) => {}
	combines.pipe(map((arr: SourcesSingleTyp<any>[]) => {
		return inspect(arr);
	})).subscribe(
		(inspectStr: string) => {
			console.log('combineLatest: inspectStr', inspectStr);
		});

	testLog.end();

	return sourcesHandler;
}

test_SourcesHandler();
