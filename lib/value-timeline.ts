/* 
npm run dev
node value-timeline
*/

// BehaviorSubject, ValueHistoryWrapper as SourcesSingleTyp
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { NameTyp, Action, TestLog, getLog } from "myy-common";
import { actionsName } from "./common";
//import { BehaviorSubjectWrapper } from "./event-handler";


// StateHistory main saving logic, {past, future}
export class ValueTimeLine<Typ> {
	past: Typ[] = [];
	future: Typ[] = [];
}

// getter-setter - undo-redo.
export class ValueTimeLineSimple<Typ> {
	constructor(initVal?: Typ) {
		if (initVal != undefined) {
			// add initVal to past (for undo option)
			this.timeLine.past.push(initVal);
		}
	}

	timeLine = new ValueTimeLine<Typ>();

	public get isUndo(): boolean {
		return this.timeLine && this.timeLine.past && this.timeLine.past.length > 0;
	}

	undo() {
		if (this.isUndo) {
			// fix history arrays (past, future);
			//const latestPast = this.history.past[this.history.past.length - 1]; // take last one
			const futureWithLatestPast = [this.value, ...this.timeLine.future];
			const pastWithoutLatest = this.timeLine.past.slice(0, -1);

			this.timeLine = {
				past: pastWithoutLatest,
				future: futureWithLatestPast
			};

			// fire Event Handler
			//this.fireEventHandler(actionsName.undo);
		}

	}

	public get isRedo(): boolean {
		return this.timeLine && this.timeLine.future && this.timeLine.future.length > 0;
	}

	redo() {
		if (this.isRedo) {
			// fix history arrays (past, future);
			const [latestFuture, ...futureWithoutLatest] = this.timeLine.future;
			const pastWithLatestFuture = [...this.timeLine.past, latestFuture];

			this.timeLine = {
				//...this.history,
				past: pastWithLatestFuture,
				future: futureWithoutLatest
			};

			// fire Event Handler
			//this.fireEventHandler(actionsName.redo);
		}

	}

	// new val will remove future
	set value(newVal: Typ) {
		// init history arrays (past, future);
		if (!this.timeLine) {
			this.timeLine = new ValueTimeLine<Typ>();
		}

		// if new value
		if (this.value !== newVal) {
			// remove redo option
			this.timeLine.future = [];

			// add currnet value
			this.timeLine.past.push(newVal);

			// fire Event Handler
			//this.fireEventHandler(actionsName.set, newVal);

		}
	}

	get value(): Typ {
		// last by BehaviorSubject
		//return this.eventHandler.value;

		// last by history.past array
		if (!this.timeLine) {
			this.timeLine = new ValueTimeLine<Typ>();
		}

		if (this.timeLine.past) {
			// take last one
			return this.timeLine.past[this.timeLine.past.length - 1];
		}
		else {
			return undefined!;
		}
	}
}


// protected EventHandler: BehaviorSubject<Typ>;

// save history for simple data type
// StateHistory for *single item* source data.
// EventHandler && ValueHistory


// ValueHistoryWrapper
//extends BehaviorSubjectWrapper<Typ>
export class ValueTimeLineWrapper<Typ> {
	constructor(initVal?: Typ, handler?: Action<Typ>) {
		if (initVal != undefined) {
			// add initVal to past (for undo option)
			this.timeLine.past.push(initVal);
			this.eventHandler = new BehaviorSubject<NameTyp<Typ>>(this.obj('ctor', initVal));
		}
		else {
			this.eventHandler = new BehaviorSubject<NameTyp<Typ>>(this.obj('ctor'));
		}

		//this._e = this.eventHandler.asObservable();
		if (handler) {
			this.subscribe(handler);
		}
	}

	timeLine = new ValueTimeLine<Typ>();

	// can be updated privately
	protected eventHandler: BehaviorSubject<NameTyp<Typ>>;

	// can be Observed	
	// has name: string, value: Typ
	public get _e(): Observable<NameTyp<Typ>> {
		return this.eventHandler.asObservable();
	}

	// cannot bind, init in ctor.
	//pipe = this._e.pipe.bind(this);

	public get e(): Observable<Typ> {
		return this._e.pipe(map(NameTyp.valMap));
	}

	_subscribe(handler: Action<NameTyp<Typ>>): Subscription {
		return this._e.subscribe(handler);
	}
	subscribe(handler: Action<Typ>): Subscription {
		return this.e.subscribe(handler);
		//return this.e.subscribe(handler);
	}

	// isInProgress = false;

	public get isUndo(): boolean {
		return this.timeLine && this.timeLine.past && this.timeLine.past.length > 0;
	}

	undo() {
		if (this.isUndo) {
			// fix history arrays (past, future);
			//const latestPast = this.history.past[this.history.past.length - 1]; // take last one
			const futureWithLatestPast = [this.value, ...this.timeLine.future];
			const pastWithoutLatest = this.timeLine.past.slice(0, -1);

			this.timeLine = {
				past: pastWithoutLatest,
				future: futureWithLatestPast
			};

			// fire Event Handler
			this.fireEventHandler(actionsName.undo);
		}

	}

	public get isRedo(): boolean {
		return this.timeLine && this.timeLine.future && this.timeLine.future.length > 0;
	}

	redo() {
		if (this.isRedo) {
			// fix history arrays (past, future);
			const [latestFuture, ...futureWithoutLatest] = this.timeLine.future;
			const pastWithLatestFuture = [...this.timeLine.past, latestFuture];

			this.timeLine = {
				//...this.history,
				past: pastWithLatestFuture,
				future: futureWithoutLatest
			};

			// fire Event Handler
			this.fireEventHandler(actionsName.redo);
		}

	}

	// new val will remove future
	set value(newVal: Typ) {
		// init history arrays (past, future);
		if (!this.timeLine) {
			this.timeLine = new ValueTimeLine<Typ>();
		}

		// if new value
		if (this.value !== newVal) {
			// remove redo option
			this.timeLine.future = [];

			// add currnet value
			this.timeLine.past.push(newVal);

			// fire Event Handler
			this.fireEventHandler(actionsName.set, newVal);

		}
	}

	get value(): Typ {
		// last by BehaviorSubject
		//return this.eventHandler.value;

		// last by history.past array
		if (!this.timeLine) {
			this.timeLine = new ValueTimeLine<Typ>();
		}

		if (this.timeLine.past) {
			// take last one
			return this.timeLine.past[this.timeLine.past.length - 1];
		}
		else {
			return undefined!;
		}

	}

	obj(actionName: string = '', val?: Typ): NameTyp<Typ> { return new NameTyp<Typ>(actionName, val || this.value); };

	fireEventHandler(actionName: string = '', val?: Typ) {
		// fire Event Handler
		// update Observable by arrays
		this.eventHandler.next(this.obj(actionName, val));
	}
}

//export type SourcesSingleTyp = ValueHistoryWrapper<>
function test_ValueTimeLineWrapper() {
	// color log
	let testLog = TestLog.i('Wrapper');
	//testLog.styleString = 'background: azure;color: blue;';
	
	// if not undefined => add as first value (last undo is always undefined).
	// trigger 0
	//let stateHistory = new ValueTimeLineWrapper(undefined, val => { getLog('stateHistory.eventHandler init test:')(val); });
	let stateHistory = new ValueTimeLineWrapper(undefined, getLog('stateHistory.eventHandler init test:'));

	// will trigger also on Ctor.
	stateHistory._subscribe(getLog('stateHistory.eventHandler _subscribe test:'));
	// line brake
	stateHistory.subscribe(x => console.log());

	// trigger 1
	stateHistory.value = 1;

	// will add undefined to history(in ctor undefined will not add)
	stateHistory.value = undefined;

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
	//stateHistory.undo();

	console.log('stateHistory.timeLine - past-future', stateHistory.timeLine);
	
	// log end text.
	testLog.end();

	return stateHistory;
}
//test_ValueTimeLineWrapper();