

// test.ts
import { inspect } from "util";
import { map } from "rxjs/operators";

import { TestLog, NameTyp } from "myy-common";

import { ObservablesHandler } from "../observables-handler";

import { SourcesSingleTyp } from "../sources-handler";

function test_ObservablesHandler(): ObservablesHandler {
	let testLog = TestLog.i('Observables Handler');

	var observablesHandler: ObservablesHandler = new ObservablesHandler();

		// option prop way.
	observablesHandler.subscribeGeneral(
			({ name: dataName, value: { name: changeName, value: newValue } }: NameTyp<NameTyp<any>>) => { 
				console.log('subscribeGeneral detailed {' + dataName + '}: ', { changeName, newValue })
			}
		);
	
	let propertyName1 = 'name 1 - will be number';
	console.log('-----' + propertyName1 + '-----');

	// trigger, update data
	observablesHandler.sourcesHandler.init(propertyName1, 2);

	let propertyName2 = 'name 2 - will be string';
	console.log('-----' + propertyName2 + '-----');

	// trigger, update data
	observablesHandler.sourcesHandler.init(propertyName2, 'some str');

	let propertyName_combines = 'combines';

	let combines = observablesHandler.combineLatest([propertyName1, propertyName2], propertyName_combines);

	// single level
	//([timerValOne, timerValTwo]) => {}
	combines.pipe(map((arr: SourcesSingleTyp<any>[]) => {
		return inspect(arr);
	})).subscribe(
		(inspectStr: string) => {
			console.log('combineLatest: inspectStr', inspectStr);
		});

	
	observablesHandler.sourcesHandler.trigger(propertyName1, 3);

	testLog.end();
	return observablesHandler;
}

test_ObservablesHandler();
