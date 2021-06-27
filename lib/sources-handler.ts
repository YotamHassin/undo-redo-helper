

// Sources-handler
// BehaviorSubject for SingleTyp(ValueHistory), Subject for GroupeTyp(subscribeGeneral)
import { Observable, Subscription, Subject } from "rxjs";
import { NameTyp, Action, Predicate, objToArr } from 'myy-common';
import { actionsName } from "./common";

import { ValueTimeLineWrapper as SourcesSingleTyp } from "./value-timeline";
export { ValueTimeLineWrapper as SourcesSingleTyp } from "./value-timeline";

//var eventHandler = new BehaviorSubject<string>('');

// Sources GroupeTyp
export interface SourcesGroupeTyp {
	[propName: string]: SourcesSingleTyp<any>;
}

export interface MyObj {
	[propName: string]: any;
}

// multy StateHistory for *object item{name, value}* source data. (calced data (pipe, ...) will not have undo-redo).
export class SourcesHandler {
	protected sourcesObject: SourcesGroupeTyp = {};
	constructor(sourcesObject?: SourcesGroupeTyp) {
		//super(sourcesObject);
		if (sourcesObject) {			
			this.sourcesObject = sourcesObject!;
		}
	}

	protected generalSubject = new Subject<NameTyp<NameTyp<any>>>();

	// can be Observed	
	// has propName: string, value: (actionName: string, value: any)
	public get e(): Observable<NameTyp<NameTyp<any>>> {
		return this.generalSubject.asObservable();
	}

	subscribeGeneral(handler: Action<NameTyp<NameTyp<any>>>): Subscription {
		return this.e.subscribe(handler);
	}

	hasOwnProperty(name: string) {
		return this.sourcesObject.hasOwnProperty(name);
	}

	get(name: string): SourcesSingleTyp<any> {
		if (this.hasOwnProperty(name)) {
			return this.sourcesObject[name];
		}
		else {
			return undefined!;
		}
	}

	set(name: string, stateHistory: SourcesSingleTyp<any>) {
		// _subscribe general
		//let eventData: NameTyp<NameTyp<any>>;
		stateHistory._subscribe(complex => {
			let eventData = new NameTyp<NameTyp<any>>(name, complex);
			this.generalSubject.next(eventData);
		});

		this.sourcesObject[name] = stateHistory;
	}

	init(name: string, initVal?: any): SourcesSingleTyp<any> {
		let stateHistory: SourcesSingleTyp<any> = this.get(name);

		// not exist => init & subscribe
		if (!stateHistory) {
			stateHistory = new SourcesSingleTyp<any>(initVal);
			this.set(name, stateHistory);
		}

		return stateHistory;
	}

	undo(name: string) {
		let stateHistory = this.get(name);
		stateHistory.undo();
		return stateHistory;
	}

	redo(name: string) {
		let stateHistory = this.get(name);
		stateHistory.redo();
		return stateHistory;
	}

	_subscribe(name: string, handler: Action<NameTyp<any>>, initVal?: any): Subscription {
		/* let stateHistory = this.get(name);

		// not exist => init & subscribe
		if (!stateHistory) {
			stateHistory = new StateHistory<any>(initVal);
			this.set(name, stateHistory);
		} */

		// get || not exist => init & subscribe
		let stateHistory = this.init(name, initVal);

		// subscribe
		return stateHistory._subscribe(handler);

	}

	subscribe(name: string, handler: Action<any>, initVal?: any): Subscription {
		// get || not exist => init & subscribe
		let stateHistory = this.init(name, initVal);

		// subscribe
		return stateHistory.subscribe(handler);

	}

	trigger(name: string, val: any): SourcesSingleTyp<any> {
		// no such prop, trigger general
		if (!this.hasOwnProperty(name)) {
			let eventData = new NameTyp<any>(actionsName.general, val);
			let triggerData = new NameTyp<NameTyp<any>>(name, eventData);
			this.generalSubject.next(triggerData);
			return undefined!;
		}

		let stateHistory = this.get(name);
		if (stateHistory) {
			stateHistory.value = val;
			return stateHistory;
		}
		else { return undefined!; }

	}

	getObj() {
		return Object.assign({}, this.sourcesObject);
	}

	getArray(isAdd?: Predicate<NameTyp<SourcesSingleTyp<any>>>): NameTyp<SourcesSingleTyp<any>>[];
	getArray(isAdd?: Array<string>): NameTyp<SourcesSingleTyp<any>>[];

	getArray(isAdd?: any): NameTyp<SourcesSingleTyp<any>>[] {
		return objToArr<SourcesSingleTyp<any>>(this.sourcesObject, isAdd);
	}


}

