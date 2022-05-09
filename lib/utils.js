/**
 * Some basic functional programming utilities that are used
 * internally in this package.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 *  Forward-compose up to five functions
 */
export function pipe(f, g, h, i, j) {
    if (h) {
        if (i) {
            if (j) {
                return function (x) { return j(i(h(g(f(x))))); };
            }
            return function (x) { return i(h(g(f(x)))); };
        }
        return function (x) { return h(g(f(x))); };
    }
    return function (x) { return g(f(x)); };
}
/**
 *  Right compose up to five functions
 */
export function compose(j, i, h, g, f) {
    if (h) {
        if (g) {
            if (f) {
                return function (x) { return j(i(h(g(f(x))))); };
            }
            return function (x) { return j(i(h(g(x)))); };
        }
        return function (x) { return j(i(h(x))); };
    }
    return function (x) { return j(i(x)); };
}
/**
 * Forward compose functions type functions, i.e., functions that
 * transform a value to another value of the same type
 */
export var merge = function () {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (x) { return fs.reduceRight(function (acc, f) { return f(acc); }, x); };
};
/**
 * two layer higher function to transfer a single record property
 */
export var prop = function () { return function (k) { return function (v) { return function (t) {
    var newT = __assign({}, t);
    newT[k] = v;
    return newT;
}; }; }; };
/**
 * two layer higher function to create a setter for the first item of an array
 */
export var first = function () { return function (f) { return function (arr) {
    var newArr = __spreadArray([], arr, true);
    newArr[0] = f(arr[0]);
    return newArr;
}; }; };
/**
 * two layer higher function to create a setter for the last item of an array
 */
export var last = function () { return function (f) { return function (arr) {
    var newArr = __spreadArray([], arr, true);
    newArr[arr.length - 1] = f(arr[arr.length - 1]);
    return newArr;
}; }; };
