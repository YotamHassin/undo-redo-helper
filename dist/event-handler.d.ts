import { Action, NameTyp } from "myy-common";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
export declare class BehaviorSubjectWrapper<Typ> {
    constructor(initVal?: Typ, handler?: Action<Typ>);
    protected eventHandler: BehaviorSubject<NameTyp<Typ>>;
    get _e(): Observable<NameTyp<Typ>>;
    get e(): Observable<Typ>;
    _subscribe(handler: Action<NameTyp<Typ>>): Subscription;
    subscribe(handler: Action<Typ>): Subscription;
    get value(): Typ;
    obj(actionName?: string, val?: Typ): NameTyp<Typ>;
    fireEventHandler(actionName?: string, val?: Typ): void;
    complete(): void;
}
export declare class BehaviorSubjectGetSet<Typ> extends BehaviorSubjectWrapper<Typ> {
    constructor(initVal?: Typ, handler?: Action<Typ>);
    set value(newVal: Typ);
}
