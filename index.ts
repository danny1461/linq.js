/**
 * Linq.js by Daniel Flynn
 * https://dandi.dev
 */

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
    return num === 0
        ? 0
        : num > 0
            ? 1
            : -1;
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

    static Generators = class {
        public static *objectEnumerator(obj: any): Iterator<{key: string, value: any}> {
            for (let i in obj) {
                yield {
                    key: '' + i,
                    value: obj[i]
                };
            }
        }

        public static *range(min: number, max: number, step: number): Iterator<number> {
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

        public static *repeat<U>(func: () => U, count: number): Iterator<U> {
            while (count-- > 0) {
                yield func();
            }
        }

        public static *append<U>(getIter: () => Iterator<U>, items: U[]): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>;

            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }

            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }
        }

        public static *concat<U>(getIter: () => Iterator<U>, items: Iterable<U>[]): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>;
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

        public static *distict<U>(getIter: () => Iterator<U>, fieldSelector?: (item: U, index: number) => any): Iterator<U> {
            let distinct = new Set<any>(),
                iter = getIter(),
                iterValue: IteratorResult<U>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let distinctValue = fieldSelector
                    ? fieldSelector(iterValue.value, index++)
                    : iterValue.value;

                if (!distinct.has(distinctValue)) {
                    distinct.add(distinctValue);
                    yield iterValue.value;
                }
            }
        }

        public static *groupByKey<U, UKey>(getIter: () => Iterator<U>, keySelector: (item: U, index: number) => UKey): Iterator<{key: UKey, group: U[]}> {
            let iter = getIter(),
                iterValue: IteratorResult<any>,
                groups = new Map<UKey, U[]>(),
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let key = keySelector(iterValue.value, index++),
                    group = groups.get(key);

                if (!group) {
                    groups.set(key, group = []);
                }

                group.push(iterValue.value);
            }

            let groupsIter = groups.keys();
            while (!(iterValue = groupsIter.next()).done) {
                yield {
                    key: iterValue.value,
                    group: <U[]>groups.get(iterValue.value)
                };
            }
        }

        public static *groupByKeyWithResult<U, UKey, UResult>(getIter: () => Iterator<{key: UKey, group: U[]}>, resultSelector: (key: UKey, items: Linq<U>) => UResult): Iterator<UResult> {
            let iter = getIter(),
                iterValue: IteratorResult<any>;

            while (!(iterValue = iter.next()).done) {
                yield resultSelector(iterValue.value.key, new Linq<U>(iterValue.value.group));
            }
        }

        public static *prepend<U>(getIter: () => Iterator<U>, items: U[]): Iterator<U> {
            for (let i = 0; i < items.length; i++) {
                yield items[i];
            }

            let iter = getIter(),
                iterValue: IteratorResult<U>;

            while (!(iterValue = iter.next()).done) {
                yield iterValue.value;
            }
        }

        public static *select<U, UResult>(getIter: () => Iterator<U>, selector: (item: U, index: number) => UResult): Iterator<UResult> {
            let iter = getIter(),
                iterValue: IteratorResult<U>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                yield selector(iterValue.value, index++);
            }
        }

        public static *selectMany<U, TResult>(getIter: () => Iterator<U>, collectionSelector: (item: U, index: number) => Iterable<TResult>): Iterator<TResult> {
            let iter = getIter(),
                iterValue: IteratorResult<any>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                let subCollection = collectionSelector(iterValue.value, index++),
                    iterChild = subCollection[Symbol.iterator](),
                    iterChildValue: IteratorResult<TResult>;

                while (!(iterChildValue = iterChild.next()).done) {
                    yield iterChildValue.value;
                }
            }
        }

        public static *skip<U>(getIter: () => Iterator<U>, count: number): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>;

            while (!(iterValue = iter.next()).done) {
                if (count > 0) {
                    count--;
                }
                else {
                    yield iterValue.value;
                }
            }
        }

        public static *skipWhile<U>(getIter: () => Iterator<U>, predicate: (item: U, index: number) => boolean): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>,
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

        public static *take<U>(getIter: () => Iterator<U>, count: number): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>;

            while (count > 0 && !(iterValue = iter.next()).done) {
                yield iterValue.value;
                count--;
            }
        }

        public static *takeWhile<U>(getIter: () => Iterator<U>, predicate: (item: U, index: number) => boolean): Iterator<U> {
            let iter = getIter(),
                iterValue: IteratorResult<U>,
                index = 0;

            while (!(iterValue = iter.next()).done) {
                if (predicate(iterValue.value, index++)) {
                    yield iterValue.value;
                }
                else {
                    break;
                }
            }
        }
    }

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
    public static from<U>(generator: () => Iterator<U>): Linq<U>;
    /**
     * Converts to the enumerable properties of an object into a key/value pair Linq object
     * 
     * @param obj The object whose enumerable properties to convert
     */
    public static from(obj: object): Linq<{key: string, value: any}>;
    /**
     * Converts an iterable, generator function, or enumerable object into a Linq object. Enumerable objects will be of type Linq<{key: string, value: any}>
     * 
     * @param arg The value to convert
     */
    public static from(arg: any): Linq<any> {
        if (typeof arg == 'object' && !arg[Symbol.iterator]) {
            return new Linq<any>(() => Linq.Generators.objectEnumerator(arg));
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

        return new Linq(() => Linq.Generators.range(min, max, step));
    }
    /**
     * Generates a Linq object of a duplicated object in sequence
     * 
     * @param item The value to be duplicated
     * @param count The number of times to duplicate the value
     */
    public static repeat<U>(item: U, count: number): Linq<U>;
    /**
     * Generates a Linq object of a specific length by invoking a method
     * 
     * @param func The method used to generate the values
     * @param count The number of times to call the method
     */
    public static repeat<U>(func: () => U, count: number): Linq<U>;
    /**
     * Generates a Linq object of a specific length by the provided value or function returning a object
     * 
     * @param item The value or function returning the value
     * @param count The number of times to duplicate the value
     */
    public static repeat(item: any, count: number = 1): Linq<any> {
        if (typeof item == 'function') {
            return new Linq<any>(() => Linq.Generators.repeat(item, count));
        }

        return new Linq<any>(() => Linq.Generators.repeat(() => item, count));
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
    public constructor(generator: () => Iterator<T>)
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
            this.getIter = function*(){};
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
        return new Linq<T>(() => Linq.Generators.append(this.getIter, items));
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
            iterValue: IteratorResult<T>,
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
        return new Linq<T>(() => Linq.Generators.concat(this.getIter, items));
    }
    /**
     * Determines whether a sequence contains a specified element by using the default equality comparer
     * 
     * @param value The value to locate in the sequence
     */
    public contains(value: T): boolean {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorResult<T>;

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
            iterValue: IteratorResult<T>,
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
        return new Linq<T>(() => Linq.Generators.distict(this.getIter, fieldSelector));
    }
    /**
     * Returns the element at a specified index in a sequence
     * 
     * @param index The zero-based index of the element to retrieve
     */
    public elementAt(index: number): T|undefined {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
    public groupBy<TKey>(keySelector: (item: T, index: number) => TKey): Linq<{key: TKey, group: T[]}>;
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
    public groupBy<TKey, TResult>(keySelector: (item: T, index: number) => TKey, resultSelector?: (key: TKey, items: Linq<T>) => TResult): Linq<any> {
        let groupByIter = () => Linq.Generators.groupByKey(this.getIter, keySelector);

        if (resultSelector) {
            return new Linq<TResult>(() => Linq.Generators.groupByKeyWithResult(groupByIter, resultSelector));
        }

        return new Linq<{key: TKey, group: T[]}>(groupByIter);
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
        return new Linq<T>(() => Linq.Generators.prepend(this.getIter, items));
    }
    /**
     * Inverts the order of the elements in a sequence
     */
    public reverse(): Linq<T> {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorResult<T>,
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
        return new Linq<TResult>(() => Linq.Generators.select(this.getIter, selector));
    }
    /**
     * Projects each element of a sequence to an Iterable<T> and flattens the resulting sequences into one sequence
     * 
     * @param collectionSelector A transform function to apply to each element
     */
    public selectMany<TResult>(collectionSelector: (item: T, index: number) => Iterable<TResult>): Linq<TResult> {
        return new Linq<TResult>(() => Linq.Generators.selectMany(this.getIter, collectionSelector));
    }
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * 
     * @param count The number of elements to skip before returning the remaining elements
     */
    public skip(count: number): Linq<T> {
        return new Linq<T>(() => Linq.Generators.skip(this.getIter, count));
    }
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements
     * 
     * @param predicate A function to test each element for a condition
     */
    public skipWhile(predicate: (item: T, index: number) => boolean): Linq<T> {
        return new Linq<T>(() => Linq.Generators.skipWhile(this.getIter, predicate));
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
            iterValue: IteratorResult<T>,
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
        return new Linq<T>(() => Linq.Generators.take(this.getIter, count));
    }
    /**
     * Returns elements from a sequence as long as a specified condition is true
     * 
     * @param predicate A function to test each element for a condition
     */
    public takeWhile(predicate: (item: T, index: number) => boolean): Linq<T> {
        return new Linq<T>(() => Linq.Generators.takeWhile(this.getIter, predicate));
    }
    /**
     * Creates an array from a the sequence
     */
    public toArray() : T[] {
        let iter: Iterator<T> = this.getIter(),
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
            iterValue: IteratorResult<T>,
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
                iterValue: IteratorResult<T>,
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

/**
 * Represents a step in an ordering operation
 */
interface OrderingRecord<T> {
    keySelector: (item: T) => any;
    order: number;
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
        this.getIter = this.orderingFunc;
    }

    private orderingFunc(): Iterator<T> {
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

        return sortedValues[Symbol.iterator]();
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
    public thenBy(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this.underlyingLinq, keySelector, true, this.ordering.slice(0));
    }
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key
     * 
     * @param keySelector A function to extract a key from each element
     */
    public thenByDescending(keySelector: (item: T) => any): LinqOrdered<T> {
        return new LinqOrdered(this.underlyingLinq, keySelector, false, this.ordering.slice(0));
    }
}