//  
/**
 * Immutable Append
 * SortedMap With Immutable
 */
// export class SortedMap<K, V> {
//   _map: Map<K, V>;
//   _keys: List<K>;
//   _comparator: (V, V) => boolean;
//
//   constructor(
//     comparator: (V, V) => boolean,
//     _map: Map<K, V> = Map(),
//     _keys: List<K> = List(),
//   ) {
//     this._map = _map;
//     this._keys = _keys;
//     this._comparator = comparator;
//   }
//
//   size(): number {
//     return this._map.size;
//   }
//
//   get<NSV>(key: K, notSetValue: NSV): V | NSV {
//     return this._map.get(key, notSetValue);
//   }
//
//   getIn<NSV>(keyPath: [K], notSetValue: NSV): V | NSV {
//     return this._map.getIn(keyPath, notSetValue);
//   }
//
//   set(key: K, value: V): this {
//     const newMap = this._map.set(key, value);
//     // const newKeys = this._keys.remove();
//     return new SortedMap(this._comparator, newMap, newKeys);
//   }
//
//   setIn(keyPath: Array<any>, value: any): this {
//
//   }
//
//   remove(key: K): this {
//
//   }
//
//   // TODO: how To Iterable?
//   removeAll(keys: Iterable<K>): this {
//
//   }
//
//   update<V_>(
//     key: K,
//     notSetValue: V_,
//     updater: (value: V) => V_,
//   ): SortedMap<K, V | V_> {
//
//   }
//
//   keys() {
//     return this._keys;
//   }
//   values() {
//
//   }
//   entries() {
//
//   }
//
//   filter(
//     predicate: (value: V, key: K) => mixed,
//   ): this {
//
//   }
//
//   map<M>(
//     mapper: (value: V, key: K) => M,
//   ): KeyedCollection<K, M> {
//
//   }
//
//   mapKeys<M>(
//     mapper: (key: K, value: V) => M,
//   ): KeyedCollection<M, V> {
//
//   }
//
//   mapEntries<KM, VM>(
//     mapper: (entry: [K, V], index: number) => [KM, VM],
//   ): KeyedCollection<KM, VM> {
//
//   }
//
//   reduce<R>(
//     reducer: (reduction: R, value: V, key: K) => R,
//     initialReduction: R,
//   ): R {
//     return this._map.reduce(reducer, initialReduction);
//   }
//
//   reduceRight<R>(
//     reducer: (reduction: R, value: V, key: K) => R,
//     initialReduction: R,
//   ): R {
//     return this._map.reduceRight(reducer, initialReduction);
//   }
//
//   find<NSV>(
//     predicate: (value: V, key: K) => mixed,
//     notSetValue?: NSV,
//   ): V | NSV {
//     return this._map.find(predicate, notSetValue);
//   }
//
//   findLast<NSV>(
//     predicate: (value: V, key: K) => mixed,
//     notSetValue?: NSV,
//   ): V | NSV {
//     return this._map.findLast(predicate, notSetValue);
//   }
//
//   findEntry(
//     predicate: (value: V, key: K) => mixed,
//   ): [K, V] | void {
//
//   }
//   findLastEntry(
//     predicate: (value: V, key: K) => mixed,
//   ): [K, V] | void {
//
//   }
//
//   findKey(
//     predicate: (value: V, key: K) => mixed,
//   ): K | void {
//
//   }
//   findLastKey(
//     predicate: (value: V, key: K) => mixed,
//   ): K | void {
//
//   }
//
//   keyOf(searchValue: V): K | void {
//
//   }
//   lastKeyOf(searchValue: V): K | void {
//
//   }
//
//   toJS(): any {
//     return this._map.toJS();
//   }
//
//   toJSON(): any {
//     return this._map.toJS();
//   }
// }
//
