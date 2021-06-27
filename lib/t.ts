

class tmp {
	protected _v: string = '';
	protected valueFunc(v? : string): string {
		if (v != undefined) {
			this._v = v!;	
		}
		return this._v;
	}
	
	public set value(v : string) {
		this._v = v;
	}
	
	public get value() : string {
		return this._v;
	}
	
}


class tmp2 extends tmp {
	valueFunc(v? : string): string {
		if (v != undefined) {
			this._v = v!;	
		}
		return this._v;
	}

	public set value(v : string) {
		this._v = v;
	}
	
}

let t = new tmp2();
t.valueFunc('2');