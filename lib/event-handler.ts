

// event-handler
import { Action, NameTyp } from "myy-common";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { actionsName } from "./common";

//var eventHandler = new BehaviorSubject<string>('');
//export class EventHandler { }


// add fireEventHandler with actionName, option to BehaviorSubject.
export class BehaviorSubjectWrapper<Typ> {
	constructor(initVal?: Typ, handler?: Action<Typ>) {
		this.eventHandler = new BehaviorSubject<NameTyp<Typ>>(this.obj('ctor', initVal));

		//this._e = this.eventHandler.asObservable();
		if (handler) {
			this.subscribe(handler);
		}
	}

	//eventHandler = new EventHandler<Typ>();
	//eventHandler = new Observable<Typ>();
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

	get value(): Typ {
		// last by BehaviorSubject
		return this.eventHandler.value.value;
	}

	obj(actionName: string = '', val?: Typ): NameTyp<Typ> { return new NameTyp<Typ>(actionName, val || this.value); };

	fireEventHandler(actionName: string = '', val?: Typ) {
		// fire Event Handler
		// update Observable by arrays
		this.eventHandler.next(this.obj(actionName, val));
	}

	complete() {
		this.fireEventHandler(actionsName.complete);
		this.eventHandler.complete();
	}

}

// add get-set options to BehaviorSubject.
export class BehaviorSubjectGetSet<Typ> extends BehaviorSubjectWrapper<Typ> {
	constructor(initVal?: Typ, handler?: Action<Typ>) {
		super(initVal, handler);
	}

	// new val will remove future
	set value(newVal: Typ) {
		// if new value
		if (this.value !== newVal) {
			// fire Event Handler
			this.fireEventHandler(actionsName.set, newVal);
		}

	}
	
}

class MyWrapper<Typ> {
	public get name_value() : NameTyp<Typ> {
		return this.eventHandler.value;
	}
	public get value() : Typ {
		return this.name_value.value;
	}
	
	protected obj(actionName: string = '', val?: Typ): NameTyp<Typ> { return new NameTyp<Typ>(actionName, val || this.value); };
	
	protected eventHandler: BehaviorSubject<NameTyp<Typ>>;
	constructor(initVal?: Typ) {
		this.eventHandler = new BehaviorSubject<NameTyp<Typ>>(this.obj('ctor', initVal));
	}

	next(value: NameTyp<Typ>): MyWrapper<Typ> {
		this.eventHandler.next(value);
		return this;
	}

}