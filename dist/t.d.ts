declare class tmp {
    protected _v: string;
    protected valueFunc(v?: string): string;
    set value(v: string);
    get value(): string;
}
declare class tmp2 extends tmp {
    valueFunc(v?: string): string;
    set value(v: string);
}
declare let t: tmp2;
