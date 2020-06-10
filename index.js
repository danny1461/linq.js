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
    return num === 0
        ? 0
        : num > 0
            ? 1
            : -1;
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
                this.getIter = arg;
            }
            else {
                this.getIter = arg[Symbol.iterator].bind(arg);
            }
        }
        else {
            this.getIter = function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); };
        }
    }
    /**
     * Converts an iterable, generator function, or enumerable object into a Linq object. Enumerable objects will be of type Linq<{key: string, value: any}>
     *
     * @param arg The value to convert
     */
    Linq.from = function (arg) {
        if (typeof arg == 'object' && !arg[Symbol.iterator]) {
            return new Linq(function () { return Linq.Generators.objectEnumerator(arg); });
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
        return new Linq(function () { return Linq.Generators.range(min, max, step); });
    };
    /**
     * Generates a Linq object of a specific length by the provided value or function returning a object
     *
     * @param item The value or function returning the value
     * @param count The number of times to duplicate the value
     */
    Linq.repeat = function (item, count) {
        if (count === void 0) { count = 1; }
        if (typeof item == 'function') {
            return new Linq(function () { return Linq.Generators.repeat(item, count); });
        }
        return new Linq(function () { return Linq.Generators.repeat(function () { return item; }, count); });
    };
    /**
     * Returns the iterator for this Linq object
     */
    Linq.prototype[Symbol.iterator] = function () {
        return this.getIter();
    };
    /**
     * Applies an accumulator function over a sequence
     *
     * @param func An accumulator function to be invoked on each element
     * @param seed If provided, the initial accumulator value
     * @param resultSelector If provided, a function to transform the final accumulator value into the result value
     */
    Linq.prototype.aggregate = function (func, seed, resultSelector) {
        var iter = this.getIter(), iterValue, accumulate = seed;
        while (!(iterValue = iter.next()).done) {
            accumulate = func(iterValue.value, accumulate);
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
        var iter = this.getIter(), iterValue, index = 0;
        while (!(iterValue = iter.next()).done) {
            if (!predicate(iterValue.value, index++)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Determines whether any element of a sequence satisfies a condition
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.any = function (predicate) {
        var iter = this.getIter(), iterValue, index = 0;
        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }
            return true;
        }
        return false;
    };
    /**
     * Appends the provided values to the end of the sequence
     *
     * @param items The values to append to the end
     */
    Linq.prototype.append = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return new Linq(function () { return Linq.Generators.append(_this.getIter, items); });
    };
    /**
     * Computes the average of a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.average = function (fieldSelector) {
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), iterValue, index = 0;
        while (!(iterValue = iter.next()).done) {
            var sum = fieldSelector(iterValue.value, index++), count = 1;
            while (!(iterValue = iter.next()).done) {
                sum += fieldSelector(iterValue.value, index++);
                count++;
            }
            return sum / count;
        }
        return undefined;
    };
    /**
     * Concatenates multiple iterable objects into one resulting sequence
     *
     * @param items The iterable objects to concatenate
     */
    Linq.prototype.concat = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return new Linq(function () { return Linq.Generators.concat(_this.getIter, items); });
    };
    /**
     * Determines whether a sequence contains a specified element by using the default equality comparer
     *
     * @param value The value to locate in the sequence
     */
    Linq.prototype.contains = function (value) {
        var iter = this.getIter(), iterValue;
        while (!(iterValue = iter.next()).done) {
            if (iterValue.value === value) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns the number of elements in a sequence
     *
     * @param predicate If provided, a function to test each element for a condition
     */
    Linq.prototype.count = function (predicate) {
        var iter = this.getIter(), iterValue, count = 0, index = 0;
        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }
            count++;
        }
        return count;
    };
    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values
     *
     * @param fieldSelector If provided, the function to transform the element into a value for uniqueness checking
     */
    Linq.prototype.distinct = function (fieldSelector) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.distict(_this.getIter, fieldSelector); });
    };
    /**
     * Returns the element at a specified index in a sequence
     *
     * @param index The zero-based index of the element to retrieve
     */
    Linq.prototype.elementAt = function (index) {
        var iter = this.getIter(), iterValue, i = 0;
        while (!(iterValue = iter.next()).done) {
            if (i == index) {
                return iterValue.value;
            }
            i++;
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
        var iter = this.getIter(), iterValue, index = 0;
        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }
            return iterValue.value;
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
        var _this = this;
        var groupByIter = function () { return Linq.Generators.groupByKey(_this.getIter, keySelector); };
        if (resultSelector) {
            return new Linq(function () { return Linq.Generators.groupByKeyWithResult(groupByIter, resultSelector); });
        }
        return new Linq(groupByIter);
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
        fieldSelector = fieldSelector || itemAsSelfSelector;
        var iter = this.getIter(), iterValue, result = '', index = 0;
        while (!(iterValue = iter.next()).done) {
            if (index > 0) {
                result += separator;
            }
            result += fieldSelector(iterValue.value, index++);
        }
        return result;
    };
    /**
     * Returns the last element of a sequence
     *
     * @param predicate If provided, a function to test each element for a condition
     */
    Linq.prototype.last = function (predicate) {
        var iter = this.getIter(), iterValue, last = undefined, index = 0;
        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }
            last = iterValue.value;
        }
        return last;
    };
    /**
     * Returns the maximum value in a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.max = function (fieldSelector) {
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), iterValue, max = undefined, index = 0;
        while (!(iterValue = iter.next()).done) {
            max = iterValue.value;
            var maxVal = fieldSelector(iterValue.value, index++);
            while (!(iterValue = iter.next()).done) {
                var val = fieldSelector(iterValue.value, index++);
                if (val > maxVal) {
                    max = iterValue.value;
                    maxVal = val;
                }
            }
        }
        return max;
    };
    /**
     * Returns the minimum value in a sequence of number values
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.min = function (fieldSelector) {
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), iterValue, min = undefined, index = 0;
        while (!(iterValue = iter.next()).done) {
            min = iterValue.value;
            var minVal = fieldSelector(iterValue.value, index++);
            while (!(iterValue = iter.next()).done) {
                var val = fieldSelector(iterValue.value, index++);
                if (val < minVal) {
                    min = iterValue.value;
                    minVal = val;
                }
            }
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
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return new Linq(function () { return Linq.Generators.prepend(_this.getIter, items); });
    };
    /**
     * Inverts the order of the elements in a sequence
     */
    Linq.prototype.reverse = function () {
        var iter = this.getIter(), iterValue, reversed = [];
        while (!(iterValue = iter.next()).done) {
            reversed.push(iterValue.value);
        }
        reversed.reverse();
        return new Linq(reversed);
    };
    /**
     * Projects each element of a sequence into a new form
     *
     * @param selector A transform function to apply to each element
     */
    Linq.prototype.select = function (selector) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.select(_this.getIter, selector); });
    };
    /**
     * Projects each element of a sequence to an Iterable<T> and flattens the resulting sequences into one sequence
     *
     * @param collectionSelector A transform function to apply to each element
     */
    Linq.prototype.selectMany = function (collectionSelector) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.selectMany(_this.getIter, collectionSelector); });
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     *
     * @param count The number of elements to skip before returning the remaining elements
     */
    Linq.prototype.skip = function (count) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.skip(_this.getIter, count); });
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.skipWhile = function (predicate) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.skipWhile(_this.getIter, predicate); });
    };
    /**
     * Computes the sum of a sequence
     *
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    Linq.prototype.sum = function (fieldSelector) {
        fieldSelector = fieldSelector || itemAsNumberSelector;
        var iter = this.getIter(), iterValue, index = 0;
        while (!(iterValue = iter.next()).done) {
            var sum = fieldSelector(iterValue.value, index++);
            while (!(iterValue = iter.next()).done) {
                sum += fieldSelector(iterValue.value, index++);
            }
            return sum;
        }
        return undefined;
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence
     *
     * @param count The number of elements to return
     */
    Linq.prototype.take = function (count) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.take(_this.getIter, count); });
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true
     *
     * @param predicate A function to test each element for a condition
     */
    Linq.prototype.takeWhile = function (predicate) {
        var _this = this;
        return new Linq(function () { return Linq.Generators.takeWhile(_this.getIter, predicate); });
    };
    /**
     * Creates an array from a the sequence
     */
    Linq.prototype.toArray = function () {
        var iter = this.getIter(), iterValue, result = [];
        while (!(iterValue = iter.next()).done) {
            result.push(iterValue.value);
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
        var iter = this.getIter(), iterValue, result = new Map(), index = 0;
        while (!(iterValue = iter.next()).done) {
            result.set(keySelector(iterValue.value, index), valueSelector
                ? valueSelector(iterValue.value, index)
                : iterValue.value);
            index++;
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
        var iter = this.getIter(), iterValue, result = {}, index = 0;
        while (!(iterValue = iter.next()).done) {
            result[keySelector(iterValue.value, index)] = valueSelector
                ? valueSelector(iterValue.value, index)
                : iterValue.value;
            index++;
        }
        return result;
    };
    /**
     * Creates a Set from the sequence
     */
    Linq.prototype.toSet = function () {
        var iter = this.getIter(), iterValue, result = new Set();
        while (!(iterValue = iter.next()).done) {
            result.add(iterValue.value);
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
            var iter, iterValue, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 4];
                        if (!predicate(iterValue.value, index++)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }
        return new Linq(where);
    };
    /* Static Members */
    Linq.Generators = /** @class */ (function () {
        function class_1() {
        }
        class_1.objectEnumerator = function (obj) {
            var _a, _b, _i, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in obj)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        i = _a[_i];
                        return [4 /*yield*/, {
                                key: '' + i,
                                value: obj[i]
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
        class_1.range = function (min, max, step) {
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
        };
        class_1.repeat = function (func, count) {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(count-- > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, func()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
        class_1.append = function (getIter, items) {
            var iter, iterValue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < items.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, items[i]];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        };
        class_1.concat = function (getIter, items) {
            var iter, iterValue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < items.length)) return [3 /*break*/, 8];
                        iter = items[i][Symbol.iterator]();
                        _a.label = 5;
                    case 5:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 7];
                        return [4 /*yield*/, iterValue.value];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 7:
                        i++;
                        return [3 /*break*/, 4];
                    case 8: return [2 /*return*/];
                }
            });
        };
        class_1.distict = function (getIter, fieldSelector) {
            var distinct, iter, iterValue, index, distinctValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        distinct = new Set(), iter = getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 4];
                        distinctValue = fieldSelector
                            ? fieldSelector(iterValue.value, index++)
                            : iterValue.value;
                        if (!!distinct.has(distinctValue)) return [3 /*break*/, 3];
                        distinct.add(distinctValue);
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
        class_1.groupByKey = function (getIter, keySelector) {
            var iter, iterValue, groups, index, key, group, groupsIter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter(), groups = new Map(), index = 0;
                        while (!(iterValue = iter.next()).done) {
                            key = keySelector(iterValue.value, index++), group = groups.get(key);
                            if (!group) {
                                groups.set(key, group = []);
                            }
                            group.push(iterValue.value);
                        }
                        groupsIter = groups.keys();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = groupsIter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, {
                                key: iterValue.value,
                                group: groups.get(iterValue.value)
                            }];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        class_1.groupByKeyWithResult = function (getIter, resultSelector) {
            var iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, resultSelector(iterValue.value.key, new Linq(iterValue.value.group))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        class_1.prepend = function (getIter, items) {
            var i, iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, items[i]];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        iter = getIter();
                        _a.label = 5;
                    case 5:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 7];
                        return [4 /*yield*/, iterValue.value];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 7: return [2 /*return*/];
                }
            });
        };
        class_1.select = function (getIter, selector) {
            var iter, iterValue, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, selector(iterValue.value, index++)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        class_1.selectMany = function (getIter, collectionSelector) {
            var iter, iterValue, index, subCollection, iterChild, iterChildValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 5];
                        subCollection = collectionSelector(iterValue.value, index++), iterChild = subCollection[Symbol.iterator](), iterChildValue = void 0;
                        _a.label = 2;
                    case 2:
                        if (!!(iterChildValue = iterChild.next()).done) return [3 /*break*/, 4];
                        return [4 /*yield*/, iterChildValue.value];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        };
        class_1.skip = function (getIter, count) {
            var iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 5];
                        if (!(count > 0)) return [3 /*break*/, 2];
                        count--;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, iterValue.value];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        };
        class_1.skipWhile = function (getIter, predicate) {
            var iter, iterValue, skipping, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter(), skipping = true, index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        if (skipping) {
                            if (predicate(iterValue.value, index++)) {
                                return [3 /*break*/, 1];
                            }
                            else {
                                skipping = false;
                            }
                        }
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        class_1.take = function (getIter, count) {
            var iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter();
                        _a.label = 1;
                    case 1:
                        if (!(count > 0 && !(iterValue = iter.next()).done)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        count--;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        class_1.takeWhile = function (getIter, predicate) {
            var iter, iterValue, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 5];
                        if (!predicate(iterValue.value, index++)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: return [3 /*break*/, 5];
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        };
        return class_1;
    }());
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
        _this.getIter = _this.orderingFunc;
        return _this;
    }
    LinqOrdered.prototype.orderingFunc = function () {
        var _this = this;
        var sortedValues = this.underlyingLinq.toArray();
        // Sorting processes
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
        return sortedValues[Symbol.iterator]();
    };
    /* Overrides */
    /**
     * Sorts the elements of a sequence in ascending order according to a key. WARNING: will overide the previous ordering calls
     *
     * @param keySelector A function to extract a key from an element
     */
    LinqOrdered.prototype.orderBy = function (keySelector) {
        return new LinqOrdered(this, keySelector, true);
    };
    /**
     * Sorts the elements of a sequence in descending order according to a key. WARNING: will overide the previous ordering calls
     *
     * @param keySelector A function to extract a key from an element
     */
    LinqOrdered.prototype.orderByDescending = function (keySelector) {
        return new LinqOrdered(this, keySelector, false);
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
