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
function produceRootSelector() {
    return function (sliceKey) {
        return function (sliceSelector) {
            return function (rootState) {
                var scopedState = rootState[sliceKey];
                return sliceSelector(scopedState);
            };
        };
    };
}
function produceRootSelectorCreator() {
    return function (sliceKey) {
        return function (sliceSelectorFunction) {
            return function (arg) {
                return function (rootState) {
                    var scopedState = rootState[sliceKey];
                    return sliceSelectorFunction(arg)(scopedState);
                };
            };
        };
    };
}
/**
 * Call this function with a type parameter that gives it your application's root state.
 * That returns a function that you call with the name of the slice for which you want
 * to create selectors.  That then returns a function that can be passed sets of selectors
 * and selectorCreators, respectively, that are written against your slice's state.  They
 * will automatically be converted to a single object containing the same selectors
 * applied to your application's root state.
 *
 * @example
 * const produceCounterSelectors = produceRootSelectors<RootState()
 * const createCounterSelectors = produceCounterSelectors(counterSlice.name)
 * const counterSelectors = createCounterSelectors(counterPlainSelectors, counterSelectorCreators)
 *
 * @example <caption> Curried calling style</caption>
 * const counterSelectors = produceRootSelectors<RootState>()(counterSlice.name)(
 *   counterPlainSelectors, counterSelectorCreators
 * )
 */
export function produceRootSelectors() {
    return function (sliceKey) {
        return function (selectors, selectorCreators) {
            var prs = produceRootSelector()(sliceKey);
            var prsc = produceRootSelectorCreator()(sliceKey);
            var rootSelectors = Object.entries(selectors).map(function (_a) {
                var a = _a[0], b = _a[1];
                return [
                    a,
                    prs(b)
                ];
            });
            var rootSelectorCreators = Object.entries(selectorCreators).map(function (_a) {
                var a = _a[0], b = _a[1];
                return [a, prsc(b)];
            });
            return __assign(__assign({}, Object.fromEntries(rootSelectors)), Object.fromEntries(rootSelectorCreators));
        };
    };
}
