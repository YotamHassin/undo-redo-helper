"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var tmp = /** @class */ (function () {
    function tmp() {
        this._v = '';
    }
    tmp.prototype.valueFunc = function (v) {
        if (v != undefined) {
            this._v = v;
        }
        return this._v;
    };
    Object.defineProperty(tmp.prototype, "value", {
        get: function () {
            return this._v;
        },
        set: function (v) {
            this._v = v;
        },
        enumerable: false,
        configurable: true
    });
    return tmp;
}());
var tmp2 = /** @class */ (function (_super) {
    __extends(tmp2, _super);
    function tmp2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tmp2.prototype.valueFunc = function (v) {
        if (v != undefined) {
            this._v = v;
        }
        return this._v;
    };
    Object.defineProperty(tmp2.prototype, "value", {
        set: function (v) {
            this._v = v;
        },
        enumerable: false,
        configurable: true
    });
    return tmp2;
}(tmp));
var t = new tmp2();
t.valueFunc('2');
