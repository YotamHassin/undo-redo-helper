

// common
import { NameTyp } from "myy-common";

export const actionsName = {
	ctor: 'ctor', complete: 'complete',
	set: 'set',
	redo: 'redo', undo: 'undo',

	// no specific listener.
	general: 'general only'
};

// find names in *flat* objects.
export function sortFlat(names: Array<string> = [], ...objects: any[]): NameTyp<any>[] {
	let arr: Array<NameTyp<any>> = [];
	let value: NameTyp<any>;
	// forEach name, create new entry with name.
	names.forEach(name => {
		value = new NameTyp<any>(name);
		// forEach object, update value by current.
		objects.forEach(obj => {
			if (obj[name] != undefined) {
				value.value = obj[name];	
			}
		});
		arr.push(value);
	});

	return arr;

}
