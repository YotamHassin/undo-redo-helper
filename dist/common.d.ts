import { NameTyp } from "myy-common";
export declare const actionsName: {
    ctor: string;
    complete: string;
    set: string;
    redo: string;
    undo: string;
    general: string;
};
export declare function sortFlat(names?: Array<string>, ...objects: any[]): NameTyp<any>[];
