"use strict";
/**
 * Linq.js by Daniel Flynn
 * https://dandi.dev
 */
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linq = void 0;
function itemAsNumberSelector(item) {
    return parseFloat(item);
}
function itemAsSelfSelector(item) {
    return item;
}
/**
 * Compatibility for IE. Returns -1 for negative inputs, 1 for positive inputs, and 0 for zero inputs
 *
 * @param num The number to check the sign of
 */
var getNumberSign = Math.sign || function (num) {
    return num != 0
        ? num / Math.abs(num)
        : 0;
};
/**
 * Used to represent any sequence of uniform values. Provides many helpful methods for manipulating that data.
 * Uses delayed execution patterns to only perform the operation when a resolving method type is called.
 * Implements [Symbol.iterator] to be compatible to with all iterable types.
 *
 * @typeParam T The type of each value in the sequence
 */
var Linq = /** @class */ (function () {
    /**
     * Initializes a Linq object wrapping the provided data
     *
     * @param arg
     */
    function Linq(arg) {
        if (arg) {
            if (typeof arg == 'function') {
                this.getIter = function () { return arg(); };
            }
            else {
                this.getIter = function () { return arg; };
            }
        }
        else {
            this.getIter = function () { return []; };
        }
    }
    /**
     * Converts an iterable, generator function, or enumerable object into a Linq object. Enumerable objects will be of type Linq<IKeyValuePair<string, any>>
     *
     * @param arg The value to convert
     */
    Linq.from = function (arg) {
        if (typeof arg == 'object' && !arg[Symbol.iterator]) {
            var objectEnumerator = function () {
                var _a, _b, _i, i;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [];
                            for (_b in arg)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            i = _a[_i];
                            return [4 /*yield*/, {
                                    key: '' + i,
                                    value: arg[i]
                                }];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            };
            return new Linq(objectEnumerator);
        }
        return new Linq(arg);
    };
    /**
     * Generates a Linq object of numbers with the values from the given range
     *
     * @param min The inclusive lower bound of the range
     * @param max The exclusive upper bound of the range
     * @param step The increment step size
     */
    Linq.range = function (min, max, step) {
        if (step === void 0) { step = 1; }
        if (getNumberSign(max - min) != getNumberSign(step)) {
            throw 'Infinite loop detected';
        }
        function range() {
            var i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(max > min)) return [3 /*break*/, 5];
                        i = min;
                        _a.label = 1;
                    case 1:
                        if (!(i < max)) return [3 /*break*/, 4];
                        return [4 /*yield*/, i];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i += step;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        i = min;
                        _a.label = 6;
                    case 6:
                        if (!(i > max)) return [3 /*break*/, 9];
                        return [4 /*yield*/, i];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i += step;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        }
        return new Linq(range);
    };
    /**
     * Generates a Linq object of a duplicated object in sequence
     *
     * @param item The value to be duplicated
     * @param count The number of times to duplicate the value
     */
    Linq.repeat = function (item, count) {
        if (count === void 0) { count = 1; }
        var data = [];
        data.length = count;
        data.fill(item, 0);
        return new Linq(data);
    };
    /**
     * Returns the iterator for this Linq object
     */
    Linq.prototype[Symbol.iterator] = function () {
        return this.getIter()[Symbol.iterator]();
    };
    /**
     * Applies an accumulator function over a sequence
     *
     * @param func An accumulator function to be invoked on each element
     * @param seed If provided, the initial accumulator value
     * @param resultSelector If provided, a function to transform the final accumulator value into the result value
     */
    Linq.prototype.aggregate = function (func, seed, resultSelector) {
        var e_1, _a;
        var accumulate = seed;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                accumulate = func(val, accumulate);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (resultSelector) {
            return resultSelector(accumulate);
        }
        return accumulate;
    };
    /**
     * Determines whether all elements of a sequence satisfy a condition
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.all = function (predicate) {
        var e_2, _a;
        var index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (!predicate(val, index++)) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    };
    /**
     * Determines whether any element of a sequence satisfies a condition
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.any = function (predicate) {
        var e_3, _a;
        var index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (predicate && !predicate(val, index++)) {
                    continue;
                }
                return true;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    /**
     * Appends the provided values to the end of the sequence
     *
     * @param items The values to append to the end
     */
    Linq.prototype.append = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function append() {
            var _a, _b, val, e_4_1, i;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        val = _b.value;
                        return [4 /*yield*/, val];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        i = 0;
                        _d.label = 8;
                    case 8:
                        if (!(i < items.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, items[i]];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 8];
                    case 11: return [2 /*return*/];
                }
            });
        }
        return new Linq(append);
    };
    /**
     * Computes the average of a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.average = function (fieldSelector) {
        var e_5, _a, e_6, _b;
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), index = 0;
        try {
            for (var iter_1 = __values(iter), iter_1_1 = iter_1.next(); !iter_1_1.done; iter_1_1 = iter_1.next()) {
                var val = iter_1_1.value;
                var sum = fieldSelector(val, index++), count = 1;
                try {
                    for (var iter_2 = (e_6 = void 0, __values(iter)), iter_2_1 = iter_2.next(); !iter_2_1.done; iter_2_1 = iter_2.next()) {
                        val = iter_2_1.value;
                        sum += fieldSelector(val, index++);
                        count++;
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (iter_2_1 && !iter_2_1.done && (_b = iter_2.return)) _b.call(iter_2);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return sum / count;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (iter_1_1 && !iter_1_1.done && (_a = iter_1.return)) _a.call(iter_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return undefined;
    };
    /**
     * Concatenates multiple iterable objects into one resulting sequence
     *
     * @param items The iterable objects to concatenate
     */
    Linq.prototype.concat = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function concatenated() {
            var _a, _b, val, e_7_1, i, _c, _d, val, e_8_1;
            var e_7, _e, e_8, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 7]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _g.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        val = _b.value;
                        return [4 /*yield*/, val];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_7_1 = _g.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        i = 0;
                        _g.label = 8;
                    case 8:
                        if (!(i < items.length)) return [3 /*break*/, 17];
                        _g.label = 9;
                    case 9:
                        _g.trys.push([9, 14, 15, 16]);
                        _c = (e_8 = void 0, __values(items[i])), _d = _c.next();
                        _g.label = 10;
                    case 10:
                        if (!!_d.done) return [3 /*break*/, 13];
                        val = _d.value;
                        return [4 /*yield*/, val];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12:
                        _d = _c.next();
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_8_1 = _g.sent();
                        e_8 = { error: e_8_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_8) throw e_8.error; }
                        return [7 /*endfinally*/];
                    case 16:
                        i++;
                        return [3 /*break*/, 8];
                    case 17: return [2 /*return*/];
                }
            });
        }
        return new Linq(concatenated);
    };
    /**
     * Determines whether a sequence contains a specified element by using the default equality comparer
     *
     * @param value The value to locate in the sequence
     */
    Linq.prototype.contains = function (value) {
        var e_9, _a;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (val === value) {
                    return true;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return false;
    };
    /**
     * Returns the number of elements in a sequence
     *
     * @param predicate If provided, a function to test each element for a condition
     */
    Linq.prototype.count = function (predicate) {
        var e_10, _a;
        var count = 0, index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (predicate && !predicate(val, index++)) {
                    continue;
                }
                count++;
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return count;
    };
    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values
     *
     * @param fieldSelector If provided, the function to transform the element into a value for uniqueness checking
     */
    Linq.prototype.distinct = function (fieldSelector) {
        var that = this;
        function distinct() {
            var distinct, index, _a, _b, val, distinctValue, e_11_1;
            var e_11, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        distinct = [], index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        val = _b.value;
                        distinctValue = fieldSelector
                            ? fieldSelector(val, index++)
                            : val;
                        if (!(distinct.indexOf(distinctValue) < 0)) return [3 /*break*/, 4];
                        distinct.push(distinctValue);
                        return [4 /*yield*/, val];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_11_1 = _d.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(distinct);
    };
    /**
     * Returns the element at a specified index in a sequence
     *
     * @param index The zero-based index of the element to retrieve
     */
    Linq.prototype.elementAt = function (index) {
        var e_12, _a;
        var i = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (i == index) {
                    return val;
                }
                i++;
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        return undefined;
    };
    Linq.prototype.except = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        throw 'Not Implemented';
    };
    Linq.prototype.first = function (predicate) {
        var e_13, _a;
        var index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (predicate && !predicate(val, index++)) {
                    continue;
                }
                return val;
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        return undefined;
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function
     *
     * @param keySelector A function to extract the key for each element
     * @param resultSelector If provided, a function to create a result value from each group
     */
    Linq.prototype.groupBy = function (keySelector, resultSelector) {
        var that = this;
        function groupBy() {
            var groups, index, _loop_1, _a, _b, val, groups_1, groups_1_1, group, e_14_1;
            var e_15, _c, e_14, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        groups = [], index = 0;
                        _loop_1 = function (val) {
                            var key = keySelector(val, index++), ndx = groups.findIndex(function (i) { return i.key == key; });
                            if (ndx < 0) {
                                ndx = groups.length;
                                groups.push({
                                    key: key,
                                    group: []
                                });
                            }
                            groups[ndx].group.push(val);
                        };
                        try {
                            for (_a = __values(that.getIter()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                val = _b.value;
                                _loop_1(val);
                            }
                        }
                        catch (e_15_1) { e_15 = { error: e_15_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_15) throw e_15.error; }
                        }
                        if (resultSelector) {
                            groups = groups.map(function (group) {
                                return resultSelector(group.key, new Linq(group.group));
                            });
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        groups_1 = __values(groups), groups_1_1 = groups_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!groups_1_1.done) return [3 /*break*/, 5];
                        group = groups_1_1.value;
                        return [4 /*yield*/, group];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        groups_1_1 = groups_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_14_1 = _e.sent();
                        e_14 = { error: e_14_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (groups_1_1 && !groups_1_1.done && (_d = groups_1.return)) _d.call(groups_1);
                        }
                        finally { if (e_14) throw e_14.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(groupBy);
    };
    Linq.prototype.groupJoin = function (inner, sourceSelector, innerSelector, resultSelector) {
        throw 'Not Implemented';
    };
    Linq.prototype.intersect = function (items) {
        throw 'Not Implemented';
    };
    Linq.prototype.join = function (inner, sourceSelector, innerSelector, resultSelector) {
        throw 'Not Implemented';
    };
    /**
     * Concatenates the members of a collection, using the specified separator between each member
     *
     * @param separator The string to use as a separator.separator is included in the returned string only if values has more than one element
     * @param fieldSelector If provided, a function to transform the element into the desired format
     */
    Linq.prototype.joinString = function (separator, fieldSelector) {
        var e_16, _a;
        fieldSelector = fieldSelector || itemAsSelfSelector;
        var result = '', index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (index > 0) {
                    result += separator;
                }
                result += fieldSelector(val, index++);
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return result;
    };
    /**
     * Returns the last element of a sequence
     *
     * @param predicate If provided, a function to test each element for a condition
     */
    Linq.prototype.last = function (predicate) {
        var e_17, _a;
        var last = undefined, index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                if (predicate && !predicate(val, index++)) {
                    continue;
                }
                last = val;
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
        return last;
    };
    /**
     * Returns the maximum value in a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.max = function (fieldSelector) {
        var e_18, _a, e_19, _b;
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), max = undefined, index = 0;
        try {
            for (var iter_3 = __values(iter), iter_3_1 = iter_3.next(); !iter_3_1.done; iter_3_1 = iter_3.next()) {
                var val = iter_3_1.value;
                max = val;
                var maxVal = fieldSelector(val, index++);
                try {
                    for (var iter_4 = (e_19 = void 0, __values(iter)), iter_4_1 = iter_4.next(); !iter_4_1.done; iter_4_1 = iter_4.next()) {
                        var item = iter_4_1.value;
                        var val_1 = fieldSelector(item, index++);
                        if (val_1 > maxVal) {
                            max = item;
                            maxVal = val_1;
                        }
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (iter_4_1 && !iter_4_1.done && (_b = iter_4.return)) _b.call(iter_4);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (iter_3_1 && !iter_3_1.done && (_a = iter_3.return)) _a.call(iter_3);
            }
            finally { if (e_18) throw e_18.error; }
        }
        return max;
    };
    /**
     * Returns the minimum value in a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.min = function (fieldSelector) {
        var e_20, _a, e_21, _b;
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), min = undefined, index = 0;
        try {
            for (var iter_5 = __values(iter), iter_5_1 = iter_5.next(); !iter_5_1.done; iter_5_1 = iter_5.next()) {
                var val = iter_5_1.value;
                min = val;
                var minVal = fieldSelector(val, index++);
                try {
                    for (var iter_6 = (e_21 = void 0, __values(iter)), iter_6_1 = iter_6.next(); !iter_6_1.done; iter_6_1 = iter_6.next()) {
                        var item = iter_6_1.value;
                        var val_2 = fieldSelector(item, index++);
                        if (val_2 < minVal) {
                            min = item;
                            minVal = val_2;
                        }
                    }
                }
                catch (e_21_1) { e_21 = { error: e_21_1 }; }
                finally {
                    try {
                        if (iter_6_1 && !iter_6_1.done && (_b = iter_6.return)) _b.call(iter_6);
                    }
                    finally { if (e_21) throw e_21.error; }
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (iter_5_1 && !iter_5_1.done && (_a = iter_5.return)) _a.call(iter_5);
            }
            finally { if (e_20) throw e_20.error; }
        }
        return min;
    };
    /**
     * Sorts the elements of a sequence in ascending order according to a key
     *
     * @param keySelector A function to extract a key from an element
     */
    Linq.prototype.orderBy = function (keySelector) {
        return new LinqOrdered(this, keySelector, true);
    };
    /**
     * Sorts the elements of a sequence in descending order according to a key
     *
     * @param keySelector A function to extract a key from an element
     */
    Linq.prototype.orderByDescending = function (keySelector) {
        return new LinqOrdered(this, keySelector, false);
    };
    /**
     * Prepends the provided values to the front of the sequence
     *
     * @param items The values to prepend to the front
     */
    Linq.prototype.prepend = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function prepend() {
            var i, _a, _b, val, e_22_1;
            var e_22, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, items[i]];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _d.trys.push([4, 9, 10, 11]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 5;
                    case 5:
                        if (!!_b.done) return [3 /*break*/, 8];
                        val = _b.value;
                        return [4 /*yield*/, val];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _b = _a.next();
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_22_1 = _d.sent();
                        e_22 = { error: e_22_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_22) throw e_22.error; }
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        }
        return new Linq(prepend);
    };
    /**
     * Inverts the order of the elements in a sequence
     */
    Linq.prototype.reverse = function () {
        var that = this;
        function reverse() {
            var _a, _b, val, e_23_1;
            var e_23, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(that.toArray().reverse()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        val = _b.value;
                        return [4 /*yield*/, val];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_23_1 = _d.sent();
                        e_23 = { error: e_23_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_23) throw e_23.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }
        return new Linq(reverse);
    };
    /**
     * Projects each element of a sequence into a new form
     *
     * @param selector A transform function to apply to each element
     */
    Linq.prototype.select = function (selector) {
        var that = this;
        function select() {
            var index, _a, _b, val, e_24_1;
            var e_24, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        val = _b.value;
                        return [4 /*yield*/, selector(val, index++)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_24_1 = _d.sent();
                        e_24 = { error: e_24_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_24) throw e_24.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(select);
    };
    /**
     * Projects each element of a sequence to an Iterable<T> and flattens the resulting sequences into one sequence
     *
     * @param itemsSelector A transform function to apply to each element of the input sequence
     * @param resultSelector If provided, a transform function to apply to each element of the intermediate sequence
     */
    Linq.prototype.selectMany = function (itemsSelector, resultSelector) {
        var that = this;
        function selectMany() {
            var index, _a, _b, val, subCollection, subCollection_1, subCollection_1_1, val_3, e_25_1, e_26_1;
            var e_26, _c, e_25, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        index = 0;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 13, 14, 15]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 12];
                        val = _b.value;
                        subCollection = itemsSelector(val, index++);
                        if (!resultSelector) return [3 /*break*/, 4];
                        return [4 /*yield*/, resultSelector(val, subCollection)];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 11];
                    case 4:
                        _e.trys.push([4, 9, 10, 11]);
                        subCollection_1 = (e_25 = void 0, __values(subCollection)), subCollection_1_1 = subCollection_1.next();
                        _e.label = 5;
                    case 5:
                        if (!!subCollection_1_1.done) return [3 /*break*/, 8];
                        val_3 = subCollection_1_1.value;
                        return [4 /*yield*/, val_3];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7:
                        subCollection_1_1 = subCollection_1.next();
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_25_1 = _e.sent();
                        e_25 = { error: e_25_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (subCollection_1_1 && !subCollection_1_1.done && (_d = subCollection_1.return)) _d.call(subCollection_1);
                        }
                        finally { if (e_25) throw e_25.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        e_26_1 = _e.sent();
                        e_26 = { error: e_26_1 };
                        return [3 /*break*/, 15];
                    case 14:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_26) throw e_26.error; }
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        }
        return new Linq(selectMany);
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     *
     * @param count The number of elements to skip before returning the remaining elements
     */
    Linq.prototype.skip = function (count) {
        var that = this;
        function skip() {
            var _a, _b, val, e_27_1;
            var e_27, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, 7, 8]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 5];
                        val = _b.value;
                        if (!(count > 0)) return [3 /*break*/, 2];
                        count--;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, val];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_27_1 = _d.sent();
                        e_27 = { error: e_27_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_27) throw e_27.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(skip);
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.skipWhile = function (predicate) {
        var that = this;
        function skipWhile() {
            var skipping, index, _a, _b, val, e_28_1;
            var e_28, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        skipping = true, index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        val = _b.value;
                        if (skipping) {
                            if (predicate(val, index++)) {
                                return [3 /*break*/, 4];
                            }
                            else {
                                skipping = false;
                            }
                        }
                        return [4 /*yield*/, val];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_28_1 = _d.sent();
                        e_28 = { error: e_28_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_28) throw e_28.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(skipWhile);
    };
    /**
     * Computes the sum of a sequence
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.sum = function (fieldSelector) {
        var e_29, _a, e_30, _b;
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), index = 0;
        try {
            for (var iter_7 = __values(iter), iter_7_1 = iter_7.next(); !iter_7_1.done; iter_7_1 = iter_7.next()) {
                var val = iter_7_1.value;
                var sum = fieldSelector(val, index++);
                try {
                    for (var _c = (e_30 = void 0, __values(this.getIter())), _d = _c.next(); !_d.done; _d = _c.next()) {
                        val = _d.value;
                        sum += fieldSelector(val, index++);
                    }
                }
                catch (e_30_1) { e_30 = { error: e_30_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_30) throw e_30.error; }
                }
                return sum;
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (iter_7_1 && !iter_7_1.done && (_a = iter_7.return)) _a.call(iter_7);
            }
            finally { if (e_29) throw e_29.error; }
        }
        return undefined;
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence
     *
     * @param count The number of elements to return
     */
    Linq.prototype.take = function (count) {
        var that = this;
        function take() {
            var _a, _b, val, e_31_1;
            var e_31, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        val = _b.value;
                        if (!(count > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, val];
                    case 2:
                        _d.sent();
                        count--;
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_31_1 = _d.sent();
                        e_31 = { error: e_31_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_31) throw e_31.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }
        return new Linq(take);
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.takeWhile = function (predicate) {
        var that = this;
        function takeWhile() {
            var taking, index, _a, _b, val, e_32_1;
            var e_32, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        taking = true, index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 7, 8, 9]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 6];
                        val = _b.value;
                        if (!taking) return [3 /*break*/, 5];
                        if (!predicate(val, index++)) return [3 /*break*/, 4];
                        return [4 /*yield*/, val];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        taking = false;
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_32_1 = _d.sent();
                        e_32 = { error: e_32_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_32) throw e_32.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }
        return new Linq(takeWhile);
    };
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key
     *
     * @param keySelector A function to extract a key from each element
     */
    Linq.prototype.thenBy = function (keySelector) {
        return this.orderBy(keySelector);
    };
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key
     *
     * @param keySelector A function to extract a key from each element
     */
    Linq.prototype.thenByDescending = function (keySelector) {
        return this.orderByDescending(keySelector);
    };
    /**
     * Creates an array from a the sequence
     */
    Linq.prototype.toArray = function () {
        var e_33, _a;
        var result = [];
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                result.push(val);
            }
        }
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_33) throw e_33.error; }
        }
        return result;
    };
    /**
     * Creates a Map from a sequence according to a specified key selector function
     *
     * @param keySelector A function to extract a key from each element
     * @param valueSelector If provided, a transform function to produce a result element value from each element
     */
    Linq.prototype.toMap = function (keySelector, valueSelector) {
        var e_34, _a;
        var result = new Map(), index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                result.set(keySelector(val, index), valueSelector
                    ? valueSelector(val, index)
                    : val);
                index++;
            }
        }
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_34) throw e_34.error; }
        }
        return result;
    };
    /**
     * Creates an Object from a sequence according to a specified key selector function
     *
     * @param keySelector A function to extract a key from each element
     * @param valueSelector If provided, a transform function to produce a result element value from each element
     */
    Linq.prototype.toObject = function (keySelector, valueSelector) {
        var e_35, _a;
        var result = {}, index = 0;
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                result[keySelector(val, index)] = valueSelector
                    ? valueSelector(val, index)
                    : val;
                index++;
            }
        }
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_35) throw e_35.error; }
        }
        return result;
    };
    /**
     * Creates a Set from the sequence
     */
    Linq.prototype.toSet = function () {
        var e_36, _a;
        var result = new Set();
        try {
            for (var _b = __values(this.getIter()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var val = _c.value;
                result.add(val);
            }
        }
        catch (e_36_1) { e_36 = { error: e_36_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_36) throw e_36.error; }
        }
        return result;
    };
    Linq.prototype.union = function (arr) {
        throw 'Not Implemented';
    };
    /**
     * Filters a sequence of values based on a predicate
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.where = function (predicate) {
        var that = this;
        function where() {
            var index, _a, _b, val, e_37_1;
            var e_37, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        index = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(that.getIter()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        val = _b.value;
                        if (!predicate(val, index++)) return [3 /*break*/, 4];
                        return [4 /*yield*/, val];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_37_1 = _d.sent();
                        e_37 = { error: e_37_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_37) throw e_37.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }
        return new Linq(where);
    };
    return Linq;
}());
exports.Linq = Linq;
var LinqOrdered = /** @class */ (function (_super) {
    __extends(LinqOrdered, _super);
    function LinqOrdered(iter, keySelector, ascending, ordering) {
        var _this = _super.call(this) || this;
        _this.ordering = [];
        _this.underlyingLinq = iter;
        if (ordering) {
            _this.ordering = ordering;
        }
        _this.ordering.push({
            keySelector: keySelector,
            order: ascending ? 1 : -1
        });
        _this.getIter = function () { return _this.orderingFunc(); };
        return _this;
    }
    LinqOrdered.prototype.orderingFunc = function () {
        var sortedValues, sortedValues_1, sortedValues_1_1, val, e_38_1;
        var e_38, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sortedValues = this.underlyingLinq.toArray();
                    sortedValues.sort(function (a, b) {
                        for (var i = 0; i < _this.ordering.length; i++) {
                            var fieldA = _this.ordering[i].keySelector(a), fieldB = _this.ordering[i].keySelector(b);
                            if (fieldA < fieldB) {
                                return -1 * _this.ordering[i].order;
                            }
                            else if (fieldA > fieldB) {
                                return 1 * _this.ordering[i].order;
                            }
                        }
                        return 0;
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    sortedValues_1 = __values(sortedValues), sortedValues_1_1 = sortedValues_1.next();
                    _b.label = 2;
                case 2:
                    if (!!sortedValues_1_1.done) return [3 /*break*/, 5];
                    val = sortedValues_1_1.value;
                    return [4 /*yield*/, val];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    sortedValues_1_1 = sortedValues_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_38_1 = _b.sent();
                    e_38 = { error: e_38_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (sortedValues_1_1 && !sortedValues_1_1.done && (_a = sortedValues_1.return)) _a.call(sortedValues_1);
                    }
                    finally { if (e_38) throw e_38.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    };
    /* Overrides */
    /**
     * Sorts the elements of a sequence in ascending order according to a key. WARNING: will overide the previous ordering call
     *
     * @param keySelector A function to extract a key from an element
     */
    LinqOrdered.prototype.orderBy = function (keySelector) {
        return new LinqOrdered(this.underlyingLinq, keySelector, true);
    };
    /**
     * Sorts the elements of a sequence in descending order according to a key. WARNING: will overide the previous ordering call
     *
     * @param keySelector A function to extract a key from an element
     */
    LinqOrdered.prototype.orderByDescending = function (keySelector) {
        return new LinqOrdered(this.underlyingLinq, keySelector, false);
    };
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key
     *
     * @param keySelector A function to extract a key from each element
     */
    LinqOrdered.prototype.thenBy = function (keySelector) {
        return new LinqOrdered(this.underlyingLinq, keySelector, true, this.ordering.slice(0));
    };
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key
     *
     * @param keySelector A function to extract a key from each element
     */
    LinqOrdered.prototype.thenByDescending = function (keySelector) {
        return new LinqOrdered(this.underlyingLinq, keySelector, false, this.ordering.slice(0));
    };
    return LinqOrdered;
}(Linq));
