

// Subject, no BehaviorSubject
import { Observable, combineLatest, merge, Subscription, Subject } from "rxjs";
export { Observable, combineLatest, merge };

import { map } from "rxjs/operators";
import { NameTyp, Action, objToArr } from "myy-common";

import { inspect } from "util";
import { SourcesSingleTyp } from "./sources-handler";
import { SourcesHandler } from "./sources-handler";
import { sortFlat } from "./common";

//var eventHandler = new BehaviorSubject<string>('');

// EventHandler && ValueHistory

//observables-handler


export type CombineLatestSingleTyp = Observable<[SourcesSingleTyp<any>]>;
export type MergeSingleTyp = Observable<SourcesSingleTyp<any>>;

export type ObservablesSingleTyp = CombineLatestSingleTyp | MergeSingleTyp;

export interface ObservablesGroupeTyp {
	[propName: string]: ObservablesSingleTyp;
}

// *object item{name, value}* source data. (calced data (pipe, ...) will not have undo-redo).
export class ObservablesHandler {
	static init(sourcesHandler?: SourcesHandler) {
		var observablesHandler: ObservablesHandler = new ObservablesHandler();

		if (sourcesHandler) {
			observablesHandler.sourcesHandler = sourcesHandler!;
		}

		return observablesHandler;
	}

	protected observablesObject: ObservablesGroupeTyp = {};
	sourcesHandler: SourcesHandler = new SourcesHandler();

	//constructor(protected sourceHandler: SourcesHandler = SourcesHandler.test()) {
	constructor(observablesObject?: ObservablesGroupeTyp, sourcesHandler?: SourcesHandler) {
		//super(obj);
		if (observablesObject) {
			this.observablesObject = observablesObject!;
		}
		if (sourcesHandler) {
			this.sourcesHandler = sourcesHandler!;
		}
	}

	protected generalSubject = new Subject<NameTyp<NameTyp<any>>>();

	// can be Observed	
	// has propName: string, value: (actionName: string, value: any)
	public get e(): Observable<NameTyp<NameTyp<any>>> {
		return this.generalSubject.asObservable();
	}

	subscribeGeneral(handler: Action<NameTyp<NameTyp<any>>>): Subscription {
		this.sourcesHandler.subscribeGeneral(handler);
		return this.e.subscribe(handler);
	}

	hasOwnProperty(name: string) {
		return this.observablesObject.hasOwnProperty(name);
	}

	get(name: string): ObservablesSingleTyp {
		if (this.hasOwnProperty(name)) {
			return this.observablesObject[name];
		}
		else {
			return undefined!;
		}
	}

	set(name: string, val: ObservablesSingleTyp) {
		this.observablesObject[name] = val;
	}

	/* getset(name: string, initVal?: any): SourcesSingleTyp<any> {
		let stateHistory = this.get(name);

		// not exist => init & subscribe
		if (!stateHistory) {
			stateHistory = new SourcesSingleTyp<any>(initVal);
			this.set(name, stateHistory);
		}

		return stateHistory;
	} */

	getArray(isAdd?: string[]): NameTyp<SourcesSingleTyp<any>>[] {
		//let sourcesArr: NameTyp<SourcesSingleTyp<any>>[] = this.sourcesHandler.getArray(isAdd);
		//let observablesArr: NameTyp<SourcesSingleTyp<any>>[] = objToArr(this.observablesObject, isAdd);
		
		//let arr = [...sourcesArr, ...observablesArr];
		let arr = sortFlat(isAdd, this.observablesObject, this.sourcesHandler.getObj());
		console.log('getArray', arr);
		
		return arr;
	}

	// get-set as { combineLatest - merge };

	// https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
	// When any observable emits a value, emit the last emitted value from each.
	// combine to array stream
	//_combineLatest = combineLatest.bind(this); // 38 overloads
	combineLatest(isAdd: Array<string>, name: string): CombineLatestSingleTyp {
		// when one timer emits, emit the latest values from each timer as an array

		let tmp = this.getArray(isAdd).map(NameTyp.valMap).map(x => x.e);
		//console.log('SourcesSingleTyp<any>[]', tmp);
		
		// init
		//let combines: CombineLatestSingleTyp = this._combineLatest(this.getArray(isAdd).map(NameTyp.valMap));
		let combines: CombineLatestSingleTyp = combineLatest(tmp) as CombineLatestSingleTyp;

		// set
		this.set(name, combines);

		combines.subscribe(complex => {
			let eventData = new NameTyp<any>(name, complex);
			this.generalSubject.next(eventData);
		});

		return combines;

	}

	// https://www.learnrxjs.io/learn-rxjs/operators/combination/merge
	// Turn multiple observables into a single observable
	merge(name: string, isAdd: Array<string>): MergeSingleTyp {
		let merges: MergeSingleTyp = merge(this.getArray(isAdd).map(NameTyp.valMap));

		this.set(name, merges);

		merges.subscribe(complex => {
			let eventData = new NameTyp<any>(name, complex);
			this.generalSubject.next(eventData);
		});

		return merges;

	}

	private pipe(name: string, isAdd: Array<string>) {
		let combines = this.combineLatest(isAdd, name);
		// single level
		//([timerValOne, timerValTwo]) => {}
		combines.pipe(map((arr: SourcesSingleTyp<any>[]) => {
			return inspect(arr);
		})).subscribe(
			(inspectStr: string) => {
				console.log('combineLatest: inspectStr', inspectStr);
			});
	}


}
