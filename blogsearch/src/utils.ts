// @ts-ignore
import $ from './zepto';

const utils = {
  /*
   * Move the content of an object key one level higher.
   * eg.
   * {
   *   name: 'My name',
   *   hierarchy: {
   *     lvl0: 'Foo',
   *     lvl1: 'Bar'
   *   }
   * }
   * Will be converted to
   * {
   *   name: 'My name',
   *   lvl0: 'Foo',
   *   lvl1: 'Bar'
   * }
   * @param {Object} object Main object
   * @param {String} property Main object key to move up
   * @return {Object}
   * @throws Error when key is not an attribute of Object or is not an object itself
   */
  mergeKeyWithParent<T extends object, K extends keyof T>(
    obj: T,
    property: K
  ): Omit<T, K> & { [lvl in keyof T[K]]?: T[K][lvl] } {
    if (obj[property] === undefined) {
      return obj;
    }
    if (typeof obj[property] !== 'object') {
      return obj;
    }
    const newObject = $.extend({}, obj, obj[property]);
    delete newObject[property];
    return newObject;
  },
  /*
   * Group all objects of a collection by the value of the specified attribute
   * If the attribute is a string, use the lowercase form.
   *
   * eg.
   * groupBy([
   *   {name: 'Tim', category: 'dev'},
   *   {name: 'Vincent', category: 'dev'},
   *   {name: 'Ben', category: 'sales'},
   *   {name: 'Jeremy', category: 'sales'},
   *   {name: 'AlexS', category: 'dev'},
   *   {name: 'AlexK', category: 'sales'}
   * ], 'category');
   * =>
   * {
   *   'devs': [
   *     {name: 'Tim', category: 'dev'},
   *     {name: 'Vincent', category: 'dev'},
   *     {name: 'AlexS', category: 'dev'}
   *   ],
   *   'sales': [
   *     {name: 'Ben', category: 'sales'},
   *     {name: 'Jeremy', category: 'sales'},
   *     {name: 'AlexK', category: 'sales'}
   *   ]
   * }
   * @param {array} collection Array of objects to group
   * @param {String} property The attribute on which apply the grouping
   * @return {array}
   * @throws Error when one of the element does not have the specified property
   */
  groupBy<T extends object, K extends keyof T>(
    collection: T[],
    property: K
  ): Record<string, T[]> {
    const newCollection: { [key: string]: T[] } = {};
    $.each(collection, (_index: number, item: T) => {
      if (item[property] === undefined) {
        throw new Error(`[groupBy]: Object has no key ${property}`);
      }
      let key = (item[property] as unknown) as string;
      if (typeof key === 'string') {
        key = key.toLowerCase();
      } else {
        throw new Error(`[groupBy]: Object has no key ${property}`);
      }
      // fix #171 the given data type of docsearch hits might be conflict with the properties of the native Object,
      // such as the constructor, so we need to do this check.
      if (!Object.prototype.hasOwnProperty.call(newCollection, key)) {
        newCollection[key] = [];
      }
      newCollection[key].push(item);
    });
    return newCollection;
  },
  /*
   * Return an array of all the values of the specified object
   * eg.
   * values({
   *   foo: 42,
   *   bar: true,
   *   baz: 'yep'
   * })
   * =>
   * [42, true, yep]
   * @param {object} object Object to extract values from
   * @return {array}
   */
  values<T extends { [key: string]: any }, K extends keyof T>(
    obj: T
  ): Array<T[K]> {
    return Object.keys(obj).map(key => obj[key]);
  },
  /*
   * Flattens an array
   * eg.
   * flatten([1, 2, [3, 4], [5, 6]])
   * =>
   * [1, 2, 3, 4, 5, 6]
   * @param {array} array Array to flatten
   * @return {array}
   */
  flatten(array: any[]): any[] {
    const results: any[] = [];
    array.forEach(value => {
      if (!Array.isArray(value)) {
        results.push(value);
        return;
      }
      value.forEach(subvalue => {
        results.push(subvalue);
      });
    });
    return results;
  },
  /*
   * Flatten all values of an object into an array, marking each first element of
   * each group with a specific flag
   * eg.
   * flattenAndFlagFirst({
   *   'devs': [
   *     {name: 'Tim', category: 'dev'},
   *     {name: 'Vincent', category: 'dev'},
   *     {name: 'AlexS', category: 'dev'}
   *   ],
   *   'sales': [
   *     {name: 'Ben', category: 'sales'},
   *     {name: 'Jeremy', category: 'sales'},
   *     {name: 'AlexK', category: 'sales'}
   *   ]
   * , 'isTop');
   * =>
   * [
   *     {name: 'Tim', category: 'dev', isTop: true},
   *     {name: 'Vincent', category: 'dev', isTop: false},
   *     {name: 'AlexS', category: 'dev', isTop: false},
   *     {name: 'Ben', category: 'sales', isTop: true},
   *     {name: 'Jeremy', category: 'sales', isTop: false},
   *     {name: 'AlexK', category: 'sales', isTop: false}
   * ]
   * @param {object} object Object to flatten
   * @param {string} flag Flag to set to true on first element of each group
   * @return {array}
   */
  flattenAndFlagFirst<T extends { [key: string]: any }>(
    obj: { [key: string]: T[] },
    flag: string
  ): Array<T & { [flag: string]: boolean }> {
    const values = this.values(obj).map((collection: T[]) =>
      collection.map((item: T, index: number) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        item[flag] = index === 0;
        return item;
      })
    );
    return this.flatten(values);
  },
  /*
   * Removes all empty strings, null, false and undefined elements array
   * eg.
   * compact([42, false, null, undefined, '', [], 'foo']);
   * =>
   * [42, [], 'foo']
   * @param {array} array Array to compact
   * @return {array}
   */
  compact(array: any[]): any[] {
    const results: any[] = [];
    array.forEach(value => {
      if (!value) {
        return;
      }
      results.push(value);
    });
    return results;
  },
  /*
   * Returns the highlighted value of the specified key in the specified object.
   * If no highlighted value is available, will return the key value directly
   * eg.
   * getHighlightedValue({
   *    _highlightResult: {
   *      text: {
   *        value: '<mark>foo</mark>'
   *      }
   *    },
   *    text: 'foo'
   * }, 'text');
   * =>
   * '<mark>foo</mark>'
   * @param {object} object Hit object returned by the Algolia API
   * @param {string} property Object key to look for
   * @return {string}
   **/
  // [TODO] Typing
  getHighlightedValue(obj: any, property: string) {
    if (
      obj._highlightResult &&
      obj._highlightResult.hierarchy_camel &&
      obj._highlightResult.hierarchy_camel[property] &&
      obj._highlightResult.hierarchy_camel[property].matchLevel &&
      obj._highlightResult.hierarchy_camel[property].matchLevel !== 'none' &&
      obj._highlightResult.hierarchy_camel[property].value
    ) {
      return obj._highlightResult.hierarchy_camel[property].value;
    }
    if (
      obj._highlightResult &&
      obj._highlightResult &&
      obj._highlightResult[property] &&
      obj._highlightResult[property].value
    ) {
      return obj._highlightResult[property].value;
    }
    return obj[property];
  },
  /*
   * Returns the snippeted value of the specified key in the specified object.
   * If no highlighted value is available, will return the key value directly.
   * Will add starting and ending ellipsis (…) if we detect that a sentence is
   * incomplete
   * eg.
   * getSnippetedValue({
   *    _snippetResult: {
   *      text: {
   *        value: '<mark>This is an unfinished sentence</mark>'
   *      }
   *    },
   *    text: 'This is an unfinished sentence'
   * }, 'text');
   * =>
   * '<mark>This is an unfinished sentence</mark>…'
   * @param {object} object Hit object returned by the Algolia API
   * @param {string} property Object key to look for
   * @return {string}
   **/
  getSnippetedValue(object: any, property: string) {
    if (
      !object._snippetResult ||
      !object._snippetResult[property] ||
      !object._snippetResult[property].value
    ) {
      return object[property];
    }
    let snippet = object._snippetResult[property].value;

    if (snippet[0] !== snippet[0].toUpperCase()) {
      snippet = `…${snippet}`;
    }
    if (['.', '!', '?'].indexOf(snippet[snippet.length - 1]) === -1) {
      snippet = `${snippet}…`;
    }
    return snippet;
  },
  /*
   * Deep clone an object.
   * Note: This will not clone functions and dates
   * @param {object} object Object to clone
   * @return {object}
   */
  deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  },
};

export default utils;
