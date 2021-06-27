import { Observable, combineLatest, merge, Subscription, Subject } from "rxjs";
export { Observable, combineLatest, merge };
import { NameTyp, Action } from "myy-common";
import { SourcesSingleTyp } from "./sources-handler";
import { SourcesHandler } from "./sources-handler";
export declare type CombineLatestSingleTyp = Observable<[SourcesSingleTyp<any>]>;
export declare type MergeSingleTyp = Observable<SourcesSingleTyp<any>>;
export declare type ObservablesSingleTyp = CombineLatestSingleTyp | MergeSingleTyp;
export interface ObservablesGroupeTyp {
    [propName: string]: ObservablesSingleTyp;
}
export declare class ObservablesHandler {
    static init(sourcesHandler?: SourcesHandler): ObservablesHandler;
    protected observablesObject: ObservablesGroupeTyp;
    sourcesHandler: SourcesHandler;
    constructor(observablesObject?: ObservablesGroupeTyp, sourcesHandler?: SourcesHandler);
    protected generalSubject: Subject<NameTyp<NameTyp<any>>>;
    get e(): Observable<NameTyp<NameTyp<any>>>;
    subscribeGeneral(handler: Action<NameTyp<NameTyp<any>>>): Subscription;
    hasOwnProperty(name: string): boolean;
    get(name: string): ObservablesSingleTyp;
    set(name: string, val: ObservablesSingleTyp): void;
    getArray(isAdd?: string[]): NameTyp<SourcesSingleTyp<any>>[];
    combineLatest(isAdd: Array<string>, name: string): CombineLatestSingleTyp;
    merge(name: string, isAdd: Array<string>): MergeSingleTyp;
    private pipe;
}
