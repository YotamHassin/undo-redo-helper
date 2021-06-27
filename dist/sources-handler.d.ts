import { Observable, Subscription, Subject } from "rxjs";
import { NameTyp, Action, Predicate } from 'myy-common';
import { ValueTimeLineWrapper as SourcesSingleTyp } from "./value-timeline";
export { ValueTimeLineWrapper as SourcesSingleTyp } from "./value-timeline";
export interface SourcesGroupeTyp {
    [propName: string]: SourcesSingleTyp<any>;
}
export interface MyObj {
    [propName: string]: any;
}
export declare class SourcesHandler {
    protected sourcesObject: SourcesGroupeTyp;
    constructor(sourcesObject?: SourcesGroupeTyp);
    protected generalSubject: Subject<NameTyp<NameTyp<any>>>;
    get e(): Observable<NameTyp<NameTyp<any>>>;
    subscribeGeneral(handler: Action<NameTyp<NameTyp<any>>>): Subscription;
    hasOwnProperty(name: string): boolean;
    get(name: string): SourcesSingleTyp<any>;
    set(name: string, stateHistory: SourcesSingleTyp<any>): void;
    init(name: string, initVal?: any): SourcesSingleTyp<any>;
    undo(name: string): SourcesSingleTyp<any>;
    redo(name: string): SourcesSingleTyp<any>;
    _subscribe(name: string, handler: Action<NameTyp<any>>, initVal?: any): Subscription;
    subscribe(name: string, handler: Action<any>, initVal?: any): Subscription;
    trigger(name: string, val: any): SourcesSingleTyp<any>;
    getObj(): SourcesGroupeTyp;
    getArray(isAdd?: Predicate<NameTyp<SourcesSingleTyp<any>>>): NameTyp<SourcesSingleTyp<any>>[];
    getArray(isAdd?: Array<string>): NameTyp<SourcesSingleTyp<any>>[];
}
