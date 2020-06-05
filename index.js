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
exports.LinqOrdered = exports.Linq = void 0;
function itemAsNumberSelector(item) {
    return parseFloat(item);
}
function itemAsSelfSelector(item) {
    return item;
}
/**
 * Used to represent any sequence of uniform values. Provides many helpful methods for manipulating that data.
 * Uses delayed execution patterns to only perform the operation when a resolving method type is called.
 * Implements [Symbol.iterator] to be compatible to with all iterable types.
 *
 * @typeParam T The type of each value in the sequence
 */
var Linq = /** @class */ (function () {
    /**
     * Constructor implementation
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
     * Linq.from implementation
     *
     * @param arg
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
                                    key: i,
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
        function range() {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                    case 4: return [2 /*return*/];
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
        return this.getIter();
    };
    /**
     * Aggregate implementation
     *
     * @param func
     * @param seed
     * @param resultSelector
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
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function append() {
            var iter, iterValue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter();
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
        }
        return new Linq(append);
    };
    /**
     * Average implementation
     *
     * @param fieldSelector
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
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function concatenated() {
            var iter, iterValue, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter();
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
        }
        return new Linq(concatenated);
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
     * Count implementation
     *
     * @param predicate
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
     * Distinct implementation
     *
     * @param fieldSelector
     */
    Linq.prototype.distinct = function (fieldSelector) {
        var that = this;
        function distinct() {
            var distinct, iter, iterValue, index, distinctValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        distinct = [], iter = that.getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 4];
                        distinctValue = fieldSelector
                            ? fieldSelector(iterValue.value, index++)
                            : iterValue.value;
                        if (!(distinct.indexOf(distinctValue) < 0)) return [3 /*break*/, 3];
                        distinct.push(distinctValue);
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
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
     * GroupBy implementation
     *
     * @param keySelector
     * @param resultSelector
     */
    Linq.prototype.groupBy = function (keySelector, resultSelector) {
        var that = this;
        function groupBy() {
            var iter, iterValue, groups, index, _loop_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), groups = [], index = 0;
                        _loop_1 = function () {
                            var key = keySelector(iterValue.value, index++), ndx = groups.findIndex(function (i) { return i.key == key; });
                            if (ndx < 0) {
                                ndx = groups.length;
                                groups.push({
                                    key: key,
                                    group: []
                                });
                            }
                            groups[ndx].group.push(iterValue.value);
                        };
                        while (!(iterValue = iter.next()).done) {
                            _loop_1();
                        }
                        if (resultSelector) {
                            groups = groups.map(function (group) {
                                return resultSelector(group.key, new Linq(group.group));
                            });
                        }
                        iter = groups[Symbol.iterator]();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
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
     * JoinString implementation
     *
     * @param separator
     * @param fieldSelector
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
     * Last implementation
     *
     * @param predicate
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
     * Max implementation
     *
     * @param fieldSelector
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
     * Min implementation
     *
     * @param fieldSelector
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
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var that = this;
        function prepend() {
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
                        iter = that.getIter();
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
        }
        return new Linq(prepend);
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
        var that = this;
        function select() {
            var iter, iterValue, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), index = 0;
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
        }
        return new Linq(select);
    };
    /**
     * SelectMany implementation
     *
     * @param itemsSelector
     * @param resultSelector
     */
    Linq.prototype.selectMany = function (itemsSelector, resultSelector) {
        var that = this;
        function selectMany() {
            var iter, iterValue, index, items, iterChild, iterChildValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 7];
                        items = itemsSelector(iterValue.value, index++);
                        if (!resultSelector) return [3 /*break*/, 3];
                        return [4 /*yield*/, resultSelector(iterValue.value, items)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        iterChild = items[Symbol.iterator](), iterChildValue = void 0;
                        _a.label = 4;
                    case 4:
                        if (!!(iterChildValue = iterChild.next()).done) return [3 /*break*/, 6];
                        return [4 /*yield*/, iterChildValue.value];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
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
            var iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter();
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
            var iter, iterValue, skipping, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), skipping = true, index = 0;
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
        }
        return new Linq(skipWhile);
    };
    /**
     * Sum implementation
     *
     * @param fieldSelector
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
        var that = this;
        function take() {
            var iter, iterValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter();
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 4];
                        if (!(count > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        count--;
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
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
            var iter, iterValue, taking, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = that.getIter(), taking = true, index = 0;
                        _a.label = 1;
                    case 1:
                        if (!!(iterValue = iter.next()).done) return [3 /*break*/, 5];
                        if (!taking) return [3 /*break*/, 4];
                        if (!predicate(iterValue.value, index++)) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterValue.value];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        taking = false;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
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
        var iter = this.getIter(), iterValue, result = [];
        while (!(iterValue = iter.next()).done) {
            result.push(iterValue.value);
        }
        return result;
    };
    /**
     * ToMap implementation
     *
     * @param keySelector
     * @param valueSelector
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
     * ToObject implementation
     *
     * @param keySelector
     * @param valueSelector
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
    return Linq;
}());
exports.Linq = Linq;
var LinqOrdered = /** @class */ (function (_super) {
    __extends(LinqOrdered, _super);
    function LinqOrdered(iter, keySelector, ascending, ordering) {
        var _this = _super.call(this) || this;
        _this.ordering = [];
        _this.dataIterator = iter[Symbol.iterator].bind(iter);
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
        var iter, iterValue, sortedValues;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    iter = this.dataIterator(), sortedValues = [];
                    while (!(iterValue = iter.next()).done) {
                        sortedValues.push(iterValue.value);
                    }
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
                    // Output values
                    iter = sortedValues[Symbol.iterator]();
                    _a.label = 1;
                case 1:
                    if (!!(iterValue = iter.next()).done) return [3 /*break*/, 3];
                    return [4 /*yield*/, iterValue.value];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
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
        return new LinqOrdered(this, keySelector, true);
    };
    /**
     * Sorts the elements of a sequence in descending order according to a key. WARNING: will overide the previous ordering call
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
        return new LinqOrdered(this, keySelector, true, this.ordering.slice(0));
    };
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key
     *
     * @param keySelector A function to extract a key from each element
     */
    LinqOrdered.prototype.thenByDescending = function (keySelector) {
        return new LinqOrdered(this, keySelector, false, this.ordering.slice(0));
    };
    return LinqOrdered;
}(Linq));
exports.LinqOrdered = LinqOrdered;
