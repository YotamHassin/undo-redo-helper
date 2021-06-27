import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { NameTyp, Action } from "myy-common";
export declare class ValueTimeLine<Typ> {
    past: Typ[];
    future: Typ[];
}
export declare class ValueTimeLineSimple<Typ> {
    constructor(initVal?: Typ);
    timeLine: ValueTimeLine<Typ>;
    get isUndo(): boolean;
    undo(): void;
    get isRedo(): boolean;
    redo(): void;
    set value(newVal: Typ);
    get value(): Typ;
}
export declare class ValueTimeLineWrapper<Typ> {
    constructor(initVal?: Typ, handler?: Action<Typ>);
    timeLine: ValueTimeLine<Typ>;
    protected eventHandler: BehaviorSubject<NameTyp<Typ>>;
    get _e(): Observable<NameTyp<Typ>>;
    get e(): Observable<Typ>;
    _subscribe(handler: Action<NameTyp<Typ>>): Subscription;
    subscribe(handler: Action<Typ>): Subscription;
    get isUndo(): boolean;
    undo(): void;
    get isRedo(): boolean;
    redo(): void;
    set value(newVal: Typ);
    get value(): Typ;
    obj(actionName?: string, val?: Typ): NameTyp<Typ>;
    fireEventHandler(actionName?: string, val?: Typ): void;
}
