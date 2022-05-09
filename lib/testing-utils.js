// Copyright 2022 MFB Technologies, Inc.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { configureStore } from "@reduxjs/toolkit";
import { merge } from "./utils";
/**
 * Create mock state from an initial state and a series of transformer functions.
 *
 * The first call to this function passes in the root state
 * object that will be the base for producing mock state.  The second
 * call passes in an array of transformers that will change various
 * properties of the state object to produce a new object.
 */
export var produceMockState = function (state) {
    return function (transformers) {
        return merge.apply(void 0, transformers)(state);
    };
};
/**
 * Create a transformer to change a state property.
 *
 * The first call to this function simply passes in a type
 * parameter that specifies the type of object on which properties
 * are going to be set. That returns a function that accepts the key of the
 * property to be changed and either a new value or a function to
 * transform the old value. It then returns a function that will transform
 * a state object accordingly.
 */
export var produceStateSetter = function () {
    return function (key, f) {
        return function (state) {
            var newState = __assign({}, state);
            if (typeof f === "function") {
                //we know this has resolved as a function
                newState[key] = f(state[key]);
            }
            else {
                newState[key] = f;
            }
            return newState;
        };
    };
};
/**
 * Test async thunks with an actual store.
 *
 * Function that takes (a) a slice and (b) an initial state object or
 * a function to transform the initial state of the slice.  It returns
 * a function that will accept the return of an async thunk and will
 * return both the update state and the result of the thunk.  By default
 * the result of the thunk will be unwrapped (which means it will throw
 * if the thunk returns an error).  This behavior can be turned off by
 * passing 'false' as the second argument.
 */
export function produceAsyncThunkTester(slice, initialStateOrTransform) {
    var _a, _b;
    var _this = this;
    var preloadedSliceState;
    if (typeof initialStateOrTransform === "function") {
        //we know this has resolved as a function
        preloadedSliceState = initialStateOrTransform(slice.getInitialState());
    }
    else {
        preloadedSliceState = initialStateOrTransform;
    }
    var store = configureStore({
        reducer: (_a = {},
            _a[slice.name] = slice.reducer,
            _a),
        preloadedState: preloadedSliceState
            ? (_b = {}, _b[slice.name] = preloadedSliceState, _b) : undefined
    });
    return function (arg, unwrap) { return __awaiter(_this, void 0, void 0, function () {
        var shouldUnwrap, unwrappedResult, plainResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldUnwrap = unwrap !== null && unwrap !== void 0 ? unwrap : true;
                    if (!shouldUnwrap) return [3 /*break*/, 2];
                    return [4 /*yield*/, store.dispatch(arg).unwrap()];
                case 1:
                    unwrappedResult = _a.sent();
                    return [2 /*return*/, {
                            result: unwrappedResult,
                            state: store.getState()[slice.name]
                        }];
                case 2: return [4 /*yield*/, store.dispatch(arg)
                    // the return type of the function will handle setting
                    // the type
                ];
                case 3:
                    plainResult = _a.sent();
                    // the return type of the function will handle setting
                    // the type
                    return [2 /*return*/, {
                            result: plainResult,
                            state: store.getState()[slice.name]
                        }];
            }
        });
    }); };
}
