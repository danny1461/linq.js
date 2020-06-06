/**
 * Linq.js by Daniel Flynn
 * https://dandi.dev
 */

/**
 * Represents an iteration step
 */
export interface IteratorValue<T> {
    value: T;
    done?: boolean;
}

/**
 * Represents an iterator
 */
export interface Iterator<T> {
    next: () => IteratorValue<T>
}

/**
 * Represents an object that implements an iterator
 */
export interface Iterable<T> {
    [Symbol.iterator]: () => Iterator<T>;
}

/**
 * Describes an intermediate grouping value
 */
export interface IGrouping<TKey, TGroup> {
    key: TKey;
    group: Iterable<TGroup>;
}

/**
 * Describes a record matching a key to a value
 */
export interface IKeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

/**
 * Represents a step in an ordering operation
 */
interface OrderingRecord<T> {
    keySelector: (item: T) => any;
    order: number;
}

function itemAsNumberSelector(item: any): number {
    return parseFloat(item);
}

function itemAsSelfSelector(item: any): any {
    return item;
}

/**
 * Compatibility for IE. Returns -1 for negative inputs, 1 for positive inputs, and 0 for zero inputs
 * 
 * @param num The number to check the sign of
 */
let getNumberSign = Math.sign || function(num: number): number {
    return num != 0
        ? num / Math.abs(num)
        : 0;
}

/**
 * Used to represent any sequence of uniform values. Provides many helpful methods for manipulating that data.
 * Uses delayed execution patterns to only perform the operation when a resolving method type is called.
 * Implements [Symbol.iterator] to be compatible to with all iterable types.
 * 
 * @typeParam T The type of each value in the sequence
 */
export class Linq<T> implements Iterable<T> {
    /* Static Members */

    /**
     * Converts an iterable value into a Linq object. An alias for `new Linq<T>(iter)`
     * 
     * @param iter The iterable value to convert
     */
    public static from<U>(iter: Iterable<U>): Linq<U>;
    /**
     * Converts a generator function to a Linq object. An alias for `new Linq<T>(generator)`
     * 
     * @param generator The generator function to convert
     */
    public static from<U>(generator: () => Generator<U, void, any>): Linq<U>;
    /**
     * Converts to the enumerable properties of an object into a key/value pair Linq object
     * 
     * @param obj The object whose enumerable properties to convert
     */
    public static from(obj: object): Linq<IKeyValuePair<string, any>>;
    /**
     * Converts an iterable, generator function, or enumerable object into a Linq object. Enumerable objects will be of type Linq<IKeyValuePair<string, any>>
     * 
     * @param arg The value to convert
     */
    public static from(arg: any): Linq<any> {
        if (typeof arg == 'object' && !arg[Symbol.iterator]) {
            let objectEnumerator = function*() {
                for (let i in arg) {
                    yield {
                        key: '' + i,
                        value: arg[i]
                    };
                }
            };

            return new Linq<IKeyValuePair<string, any>>(objectEnumerator);
        }

        return new Linq<any>(arg);
    }
    /**
     * Generates a Linq object of numbers with the values from the given range
     * 
     * @param min The inclusive lower bound of the range
     * @param max The exclusive upper bound of the range
     * @param step The increment step size
     */
    public static range(min: number, max: number, step: number = 1): Linq<number> {
        if (getNumberSign(max - min) != getNumberSign(step)) {
            throw 'Infinite loop detected';
        }

        function* range() {
            if (max > min) {
                for (let i = min; i < max; i += step) {
                    yield i;
                }
            }
            else {
                for (let i = min; i > max; i += step) {
                    yield i;
                }
            }
        }

        return new Linq<number>(range);
    }
    /**
     * Generates a Linq object of a duplicated object in sequence
     * 
     * @param item The value to be duplicated
     * @param count The number of times to duplicate the value
     */
    public static repeat<U>(item: U, count: number = 1): Linq<U> {
        let data: U[] = [];
        data.length = count;
        data.fill(item, 0);

        return new Linq<U>(data);
    }

    /* Instance Members */

    /**
     * Returns the iterator for this Linq object
     */
    public getIter: () => Iterator<T>;

    /**
     * Initializes an empty Linq object
     */
    public constructor();
    /**
     * Initializes a Linq object wrapping the provided iterable
     * 
     * @param data The iterable data to wrap
     */
    public constructor(data: Iterable<T>);
    /**
     * Initializes a Linq object wrapping the provided generator function
     * 
     * @param generator The generator function providing the sequence values
     */
    public constructor(generator: () => Generator<T, void, any>)
    /**
     * Initializes a Linq object wrapping the provided data
     * 
     * @param arg
     */
    public constructor(arg?: any) {
        if (arg) {
            if (typeof arg == 'function') {
                this.getIter = arg;
            }
            else {
                this.getIter = arg[Symbol.iterator].bind(arg);
            }
        }
        else {
            this.getIter = (<any>function*(){});
        }
    }

    /**
     * Returns the iterator for this Linq object
     */
    [Symbol.iterator](): Iterator<T> {
        return this.getIter();
    }

    /**
     * Applies an accumulator function over a sequence
     * 
     * @param func An accumulator function to be invoked on each element
     */
    public aggregate<U>(func: (item: T, accumulate: U) => U): U;
    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
     * 
     * @param func An accumulator function to be invoked on each element
     * @param seed The initial accumulator value
     */
    public aggregate<U>(func: (item: T, accumulate: U) => U, seed: U): U;
    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
     * 
     * @param func An accumulator function to be invoked on each element
     * @param seed The initial accumulator value
     * @param resultSelector A function to transform the final accumulator value into the result value
     */
    public aggregate<U, V>(func: (item: T, accumulate: U) => U, seed: U, resultSelector: (accumulate: U) => V): V;
    /**
     * Applies an accumulator function over a sequence
     * 
     * @param func An accumulator function to be invoked on each element
     * @param seed If provided, the initial accumulator value
     * @param resultSelector If provided, a function to transform the final accumulator value into the result value
     */
    public aggregate(func: Function, seed?: any, resultSelector?: Function): any {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            accumulate = seed;
        
        while (!(iterValue = iter.next()).done) {
            accumulate = func(iterValue.value, accumulate);
        }

        if (resultSelector) {
            return resultSelector(accumulate);
        }

        return accumulate;
    }
    /**
     * Determines whether all elements of a sequence satisfy a condition
     * 
     * @param predicate A function to test each element for a condition
     */
    public all(predicate: (item: T, index: number) => boolean): boolean {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (!predicate(iterValue.value, index++)) {
                return false;
            }
        }

        return true;
    }
    /**
     * Determines whether any element of a sequence satisfies a condition
     * 
     * @param predicate A function to test each element for a condition
     */
    public any(predicate?: (item: T, index: number) => boolean): boolean {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }

            return true;
        }

        return false;
    }
    /**
     * Appends the provided values to the end of the sequence
     * 
     * @param items The values to append to the end
     */
    public append(...items: T[]): Linq<T> {
        let that = this;

        function* append() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>;

            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }

            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }
        }

        return new Linq<T>(append);
    }
    /**
     * Computes the average of a sequence of number values
     */
    public average(): number|undefined;
    /**
     * Computes the average of a sequence of number values that are obtained by invoking a transform function on each element of the input sequence
     * 
     * @param fieldSelector A transform function to apply to each element
     */
    public average(fieldSelector: (item: T, index: number) => number): number|undefined;
    /**
     * Computes the average of a sequence of number values
     * 
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    public average(fieldSelector?: (item: T, index: number) => number): number|undefined {
        fieldSelector = fieldSelector || itemAsNumberSelector;

        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            let sum = fieldSelector(iterValue.value, index++),
                count = 1;

            while (!(iterValue = iter.next()).done) {
                sum += fieldSelector(iterValue.value, index++);
                count++;
            }

            return sum / count;
        }

        return undefined;
    }
    /**
     * Concatenates multiple iterable objects into one resulting sequence
     * 
     * @param items The iterable objects to concatenate
     */
    public concat(...items: Iterable<T>[]): Linq<T> {
        let that = this;

        function* concatenated() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>;
            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }

            for (let i = 0; i < items.length; i++) {
                iter = items[i][Symbol.iterator]();
                while (!(iterValue = iter.next()).done) {
                    yield iterValue.value;
                }
            }
        }

        return new Linq<T>(concatenated);
    }
    /**
     * Determines whether a sequence contains a specified element by using the default equality comparer
     * 
     * @param value The value to locate in the sequence
     */
    public contains(value: T): boolean {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>;

        while (!(iterValue = iter.next()).done) {
            if (iterValue.value === value) {
                return true;
            }
        }

        return false;
    }
    /**
     * Returns the number of elements in a sequence
     */
    public count(): number;
    /**
     * Returns a number that represents how many elements in the specified sequence satisfy a condition
     * 
     * @param predicate A function to test each element for a condition
     */
    public count(predicate: (item: T, index: number) => boolean): number;
    /**
     * Returns the number of elements in a sequence
     * 
     * @param predicate If provided, a function to test each element for a condition
     */
    public count(predicate?: (item: T, index: number) => boolean) {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            count = 0,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }

            count++;
        }

        return count;
    }
    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values
     */
    public distinct(): Linq<T>;
    /**
     * Returns distinct elements from a sequence by using the default equality comparer on the results of the provided transform function
     * 
     * @param fieldSelector The function to transform the element into a value for uniqueness checking
     */
    public distinct(fieldSelector: (item: T, index: number) => any): Linq<T>;
    /**
     * Returns distinct elements from a sequence by using the default equality comparer to compare values
     * 
     * @param fieldSelector If provided, the function to transform the element into a value for uniqueness checking
     */
    public distinct(fieldSelector?: (item: T, index: number) => any): Linq<T> {
        let that = this;

        function* distinct() {
            let distinct: any[] = [],
                iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let distinctValue = fieldSelector
                    ? fieldSelector(iterValue.value, index++)
                    : iterValue.value;

                if (distinct.indexOf(distinctValue) < 0) {
                    distinct.push(distinctValue);
                    yield iterValue.value;
                }
            }
        }

        return new Linq(distinct);
    }
    /**
     * Returns the element at a specified index in a sequence
     * 
     * @param index The zero-based index of the element to retrieve
     */
    public elementAt(index: number): T|undefined {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            i = 0;

        while (!(iterValue = iter.next()).done) {
            if (i == index) {
                return iterValue.value;
            }

            i++;
        }

        return undefined;
    }
    public except(...items: Linq<T>[]): Linq<T> {
        throw 'Not Implemented';
    }
    /**
     * Returns the first element of a sequence
     */
    public first(): T|undefined;
    /**
     * Returns the first element in a sequence that satisfies a specified condition
     * 
     * @param predicate A function to test each element for a condition
     */
    public first(predicate: (item: T, index: number) => boolean): T|undefined;
    public first(predicate?: (item: T, index: number) => boolean): T|undefined {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }

            return iterValue.value;
        }

        return undefined;
    }
    /**
     * Groups the elements of a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract the key for each element
     */
    public groupBy<TKey>(keySelector: (item: T, index: number) => TKey): Linq<IGrouping<TKey, T>>;
    /**
     * Groups the elements of a sequence according to a specified key selector function and creates a result value from each group and its key
     * 
     * @param keySelector A function to extract the key for each element
     * @param resultSelector A function to create a result value from each group
     */
    public groupBy<TKey, TResult>(keySelector: (item: T, index: number) => TKey, resultSelector: (key: TKey, items: Linq<T>) => TResult): Linq<TResult>;
    /**
     * Groups the elements of a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract the key for each element
     * @param resultSelector If provided, a function to create a result value from each group
     */
    public groupBy(keySelector: Function, resultSelector?: Function) {
        let that = this;

        function* groupBy() {
            let iter: Iterator<any> = that.getIter(),
                iterValue: IteratorValue<any>,
                groups = [],
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let key = keySelector(iterValue.value, index++),
                    ndx = groups.findIndex(i => i.key == key);
                
                if (ndx < 0) {
                    ndx = groups.length;
                    groups.push({
                        key,
                        group: []
                    });
                }

                (<any>groups[ndx].group).push(iterValue.value);
            }

            if (resultSelector) {
                groups = groups.map(group => {
                    return resultSelector(group.key, new Linq<T>(group.group));
                });
            }

            iter = groups[Symbol.iterator]();
            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }
        }
        
        return new Linq(groupBy);
    }
    public groupJoin<TInner, TKey, TResult>(inner: Linq<TInner>, sourceSelector: (item: T, index: number) => TKey, innerSelector: (item: TInner, index: number) => TKey, resultSelector: (source: T, items: Linq<TInner>) => TResult): Linq<TResult> {
        throw 'Not Implemented';
    }
    public intersect(items: Linq<T>): Linq<T> {
        throw 'Not Implemented';
    }
    public join<TInner, TKey, TResult>(inner: Linq<TInner>, sourceSelector: (item: T, index: number) => TKey, innerSelector: (item: TInner, index: number) => TKey, resultSelector: (source: T, item: TInner) => TResult): Linq<TResult> {
        throw 'Not Implemented';
    }
    /**
     * Concatenates the members of a collection, using the specified separator between each member
     * 
     * @param separator The string to use as a separator.separator is included in the returned string only if values has more than one element
     */
    public joinString(separator: string): string;
    /**
     * Concatenates the members of a collection after transforming them, using the specified separator between each member
     * 
     * @param separator The string to use as a separator.separator is included in the returned string only if values has more than one element
     * @param fieldSelector A function to transform the element into the desired format
     */
    public joinString(separator: string, fieldSelector: (item: T, index: number) => any): string;
    /**
     * Concatenates the members of a collection, using the specified separator between each member
     * 
     * @param separator The string to use as a separator.separator is included in the returned string only if values has more than one element
     * @param fieldSelector If provided, a function to transform the element into the desired format
     */
    public joinString(separator: string, fieldSelector?: (item: T, index: number) => any): string {
        fieldSelector = fieldSelector || itemAsSelfSelector;

        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            result = '',
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (index > 0) {
                result += separator;
            }

            result += fieldSelector(iterValue.value, index++);
        }

        return result;
    }
    /**
     * Returns the last element of a sequence
     */
    public last(): T|undefined;
    /**
     * Returns the last element of a sequence that satisfies a specified condition
     * 
     * @param predicate A function to test each element for a condition
     */
    public last(predicate: (item: T, index: number) => boolean): T|undefined;
    /**
     * Returns the last element of a sequence
     * 
     * @param predicate If provided, a function to test each element for a condition
     */
    public last(predicate?: (item: T, index: number) => boolean): T|undefined {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            last: T|undefined = undefined,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            if (predicate && !predicate(iterValue.value, index++)) {
                continue;
            }

            last = iterValue.value;
        }

        return last;
    }
    /**
     * Returns the maximum value in a sequence of number values
     */
    public max(): T|undefined;
    /**
     * Invokes a transform function on each element of a sequence and returns the maximum number value.
     * 
     * @param fieldSelector A transform function to apply to each element
     */
    public max(fieldSelector: (item: T, index: number) => number): T|undefined;
    /**
     * Returns the maximum value in a sequence of number values
     * 
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    public max(fieldSelector?: (item: T, index: number) => number): T|undefined {
        fieldSelector = fieldSelector || itemAsNumberSelector;

        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            max: T|undefined = undefined,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            max = iterValue.value;
            let maxVal = fieldSelector(iterValue.value, index++);

            while (!(iterValue = iter.next()).done) {
                let val = fieldSelector(iterValue.value, index++);
                if (val > maxVal) {
                    max = iterValue.value;
                    maxVal = val;
                }
            }
        }

        return max;
    }
    /**
     * Returns the minimum value in a sequence of number values
     */
    public min(): T|undefined;
    /**
     * Invokes a transform function on each element of a sequence and returns the minimum number value.
     * 
     * @param fieldSelector A transform function to apply to each element
     */
    public min(fieldSelector: (item: T, index: number) => number): T|undefined;
    /**
     * Returns the minimum value in a sequence of number values
     * 
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    public min(fieldSelector?: (item: T, index: number) => number): T|undefined {
        fieldSelector = fieldSelector || itemAsNumberSelector;

        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            min: T|undefined = undefined,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            min = iterValue.value;
            let minVal = fieldSelector(iterValue.value, index++);

            while (!(iterValue = iter.next()).done) {
                let val = fieldSelector(iterValue.value, index++);
                if (val < minVal) {
                    min = iterValue.value;
                    minVal = val;
                }
            }
        }

        return min;
    }
    /**
     * Sorts the elements of a sequence in ascending order according to a key
     * 
     * @param keySelector A function to extract a key from an element
     */
    public orderBy(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this, keySelector, true);
    }
    /**
     * Sorts the elements of a sequence in descending order according to a key
     * 
     * @param keySelector A function to extract a key from an element
     */
    public orderByDescending(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this, keySelector, false);
    }
    /**
     * Prepends the provided values to the front of the sequence
     * 
     * @param items The values to prepend to the front
     */
    public prepend(...items: T[]): Linq<T> {
        let that = this;

        function* prepend() {
            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }

            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>;

            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }
        }

        return new Linq<T>(prepend);
    }
    /**
     * Inverts the order of the elements in a sequence
     */
    public reverse(): Linq<T> {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            reversed: T[] = [];

        while (!(iterValue = iter.next()).done) {
            reversed.push(iterValue.value);
        }

        reversed.reverse();
        return new Linq<T>(reversed);
    }
    /**
     * Projects each element of a sequence into a new form
     * 
     * @param selector A transform function to apply to each element
     */
    public select<TResult>(selector: (item: T, index: number) => TResult): Linq<TResult> {
        let that = this;

        function* select() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                yield selector(iterValue.value, index++);
            }
        }

        return new Linq<TResult>(select);
    }
    /**
     * Projects each element of a sequence to an Iterable<T> and flattens the resulting sequences into one sequence
     * 
     * @param itemsSelector A transform function to apply to each element
     */
    public selectMany<TResult>(itemsSelector: (item: T, index: number) => Iterable<TResult>): Linq<TResult>;
    /**
     * Projects each element of a sequence to an Iterable<T>, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein
     * 
     * @param itemsSelector A transform function to apply to each element of the input sequence
     * @param resultSelector A transform function to apply to each element of the intermediate sequence
     */
    public selectMany<TCollection, TResult>(itemsSelector: (item: T, index: number) => Iterable<TCollection>, resultSelector: (item: T, subCollection: Iterable<TCollection>) => TResult): Linq<TResult>;
    /**
     * Projects each element of a sequence to an Iterable<T> and flattens the resulting sequences into one sequence
     * 
     * @param itemsSelector A transform function to apply to each element of the input sequence
     * @param resultSelector If provided, a transform function to apply to each element of the intermediate sequence
     */
    public selectMany(itemsSelector: (item: T, index: number) => any, resultSelector?: (item: T, subCollection: any) => any): any {
        let that = this;

        function* selectMany() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let subCollection = itemsSelector(iterValue.value, index++);
                if (resultSelector) {
                    yield resultSelector(iterValue.value, subCollection);
                }
                else {
                    let iterChild: Iterator<T> = subCollection[Symbol.iterator](),
                        iterChildValue: IteratorValue<T>;

                    while (!(iterChildValue = iterChild.next()).done) {
                        yield iterChildValue.value;
                    }
                }
            }
        }

        return new Linq(selectMany);
    }
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * 
     * @param count The number of elements to skip before returning the remaining elements
     */
    public skip(count: number): Linq<T> {
        let that = this;

        function* skip() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>;

            while (!(iterValue = iter.next()).done) {
                if (count > 0) {
                    count--;
                }
                else {
                    yield iterValue.value;
                }
            }
        }

        return new Linq<T>(skip);
    }
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements
     * 
     * @param predicate A function to test each element for a condition
     */
    public skipWhile(predicate: (item: T, index: number) => boolean): Linq<T> {
        let that = this;

        function* skipWhile() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                skipping = true,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                if (skipping) {
                    if (predicate(iterValue.value, index++)) {
                        continue;
                    }
                    else {
                        skipping = false;
                    }
                }

                yield iterValue.value;
            }
        }

        return new Linq<T>(skipWhile);
    }
    /**
     * Computes the sum of a sequence of System.Int32 values
     */
    public sum(): number|undefined;
    /**
     * Computes the sum of the sequence of number values that are obtained by invoking a transform function on each element of the input sequence
     * 
     * @param fieldSelector A transform function to apply to each element
     */
    public sum(fieldSelector: (item: T, index: number) => number): number|undefined;
    /**
     * Computes the sum of a sequence
     * 
     * @param fieldSelector If provided, a transform function to apply to each element
     */
    public sum(fieldSelector?: (item: T, index: number) => number): number|undefined {
        fieldSelector = fieldSelector || itemAsNumberSelector;

        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            index = 0;

        while (!(iterValue = iter.next()).done) {
            let sum = fieldSelector(iterValue.value, index++);

            while (!(iterValue = iter.next()).done) {
                sum += fieldSelector(iterValue.value, index++);
            }

            return sum;
        }

        return undefined;
    }
    /**
     * Returns a specified number of contiguous elements from the start of a sequence
     * 
     * @param count The number of elements to return
     */
    public take(count: number): Linq<T> {
        let that = this;

        function* take() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>;

            while (!(iterValue = iter.next()).done) {
                if (count > 0) {
                    yield iterValue.value;
                    count--;
                }
            }
        }

        return new Linq<T>(take);
    }
    /**
     * Returns elements from a sequence as long as a specified condition is true
     * 
     * @param predicate A function to test each element for a condition
     */
    public takeWhile(predicate: (item: T, index: number) => boolean): Linq<T> {
        let that = this;

        function* takeWhile() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                taking = true,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                if (taking) {
                    if (predicate(iterValue.value, index++)) {
                        yield iterValue.value;
                    }
                    else {
                        taking = false;
                    }
                }
            }
        }

        return new Linq<T>(takeWhile);
    }
    /**
     * Creates an array from a the sequence
     */
    public toArray() : T[] {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            result: T[] = [];

        while (!(iterValue = iter.next()).done) {
            result.push(iterValue.value);
        }

        return result;
    }
    /**
     * Creates a Map from a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract a key from each element
     */
    public toMap<TKey>(keySelector: (item: T, index: number) => TKey): Map<TKey, T>;
    /**
     * Creates a Map from a sequence according to specified key selector and element selector functions
     * 
     * @param keySelector A function to extract a key from each element
     * @param valueSelector A transform function to produce a result element value from each element
     */
    public toMap<TKey, TValue>(keySelector: (item: T, index: number) => TKey, valueSelector: (item: T, index: number) => TValue): Map<TKey, TValue>;
    /**
     * Creates a Map from a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract a key from each element
     * @param valueSelector If provided, a transform function to produce a result element value from each element
     */
    public toMap(keySelector: (item: T, index: number) => any, valueSelector?: (item: T, index: number) => any): Map<any, any> {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            result = new Map<any, any>(),
            index = 0;

        while (!(iterValue = iter.next()).done) {
            result.set(
                keySelector(iterValue.value, index),
                valueSelector
                    ? valueSelector(iterValue.value, index)
                    : iterValue.value
            );

            index++;
        }

        return result;
    }
    /**
     * Creates an Object from a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract a key from each element
     */
    public toObject<TKey extends string|number>(keySelector: (item: T, index: number) => TKey): {[index in TKey]: T};
    /**
     * Creates an Object from a sequence according to specified key selector and element selector functions
     * 
     * @param keySelector A function to extract a key from each element
     * @param valueSelector A transform function to produce a result element value from each element
     */
    public toObject<TKey extends string|number, TValue>(keySelector: (item: T, index: number) => TKey, valueSelector: (item: T, index: number) => TValue) : {[index in TKey]: TValue};
    /**
     * Creates an Object from a sequence according to a specified key selector function
     * 
     * @param keySelector A function to extract a key from each element
     * @param valueSelector If provided, a transform function to produce a result element value from each element
     */
    public toObject<TKey extends string|number, TValue>(keySelector: (item: T, index: number) => TKey, valueSelector?: (item: T, index: number) => TValue) : {[index in TKey]: TValue} {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            result: any = {},
            index = 0;

        while (!(iterValue = iter.next()).done) {
            result[keySelector(iterValue.value, index)] = valueSelector
                ? valueSelector(iterValue.value, index)
                : iterValue.value;
            index++;
        }

        return result;
    }
    /**
     * Creates a Set from the sequence
     */
    public toSet(): Set<T> {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorValue<T>,
            result = new Set<T>();

        while (!(iterValue = iter.next()).done) {
            result.add(iterValue.value);
        }

        return result;
    }
    public union(arr: T[]) : Linq<T> {
        throw 'Not Implemented';
    }
    /**
     * Filters a sequence of values based on a predicate
     * 
     * @param predicate A function to test each element for a condition
     */
    public where(predicate: (item: T, index: number) => boolean): Linq<T> {
        let that = this;

        function* where() {
            let iter: Iterator<T> = that.getIter(),
                iterValue: IteratorValue<T>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                if (predicate(iterValue.value, index++)) {
                    yield iterValue.value;
                }
            }
        }

        return new Linq<T>(where);
    }
}

class LinqOrdered<T> extends Linq<T> {
    /* Instance Members */

    private underlyingLinq: Linq<T>;
    private ordering: OrderingRecord<T>[] = [];

    public constructor(iter: Linq<T>, keySelector: (item: T) => any, ascending: boolean);
    public constructor(iter: Linq<T>, keySelector: (item: T) => any, ascending: boolean, ordering: OrderingRecord<T>[]);
    public constructor(iter: Linq<T>, keySelector: (item: T) => any, ascending: boolean, ordering?: OrderingRecord<T>[]) {
        super();

        this.underlyingLinq = iter;
        if (ordering) {
            this.ordering = ordering;
        }

        this.ordering.push({
            keySelector,
            order: ascending ? 1 : -1
        });
        this.getIter = (<any>this.orderingFunc);
    }

    private *orderingFunc(): Generator<T, void, any> {
        let sortedValues = this.underlyingLinq.toArray();

        // Sorting processes
        sortedValues.sort((a: T, b: T) => {
            for (let i = 0; i < this.ordering.length; i++) {
                let fieldA = this.ordering[i].keySelector(a),
                    fieldB = this.ordering[i].keySelector(b);
                
                if (fieldA < fieldB) {
                    return -1 * this.ordering[i].order;
                }
                else if (fieldA > fieldB) {
                    return 1 * this.ordering[i].order;
                }
            }
            
            return 0;
        });

        // Output values
        let iter: Iterator<T> = sortedValues[Symbol.iterator](),
            iterValue: IteratorValue<T>;
        while (!(iterValue = iter.next()).done) {
            yield iterValue.value;
        }
    }

    /* Overrides */

    /**
     * Sorts the elements of a sequence in ascending order according to a key. WARNING: will overide the previous ordering calls
     * 
     * @param keySelector A function to extract a key from an element
     */
    public orderBy(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this, keySelector, true);
    }
    /**
     * Sorts the elements of a sequence in descending order according to a key. WARNING: will overide the previous ordering calls
     * 
     * @param keySelector A function to extract a key from an element
     */
    public orderByDescending(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this, keySelector, false);
    }
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key
     * 
     * @param keySelector A function to extract a key from each element
     */
    public thenBy(keySelector: (item: T) => any): Linq<T> {
        return new LinqOrdered(this.underlyingLinq, keySelector, true, this.ordering.slice(0));
    }
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key
     * 
     * @param keySelector A function to extract a key from each element
     */
    public thenByDescending(keySelector: (item: T) => any): Linq<T> {
        return new LinqOrdered(this.underlyingLinq, keySelector, false, this.ordering.slice(0));
    }
}