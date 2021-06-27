"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortFlat = exports.actionsName = void 0;
// common
var myy_common_1 = require("myy-common");
exports.actionsName = {
    ctor: 'ctor', complete: 'complete',
    set: 'set',
    redo: 'redo', undo: 'undo',
    // no specific listener.
    general: 'general only'
};
// find names in *flat* objects.
function sortFlat(names) {
    if (names === void 0) { names = []; }
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    var arr = [];
    var value;
    // forEach name, create new entry with name.
    names.forEach(function (name) {
        value = new myy_common_1.NameTyp(name);
        // forEach object, update value by current.
        objects.forEach(function (obj) {
            if (obj[name] != undefined) {
                value.value = obj[name];
            }
        });
        arr.push(value);
    });
    return arr;
}
exports.sortFlat = sortFlat;
