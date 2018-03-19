// // @flow
// import { merge } from 'lodash';
//
// export type NodeIndex = number;
//
// export type PoolOption = {
//   size: number,
//   increment: number,
// };
//
// const defaultPoolOption: PoolOption = {
//   size: 100,
//   increment: 100,
// };
//
// export class ObjectPoolNode<T: Object> {
//   value: T;
//   index: NodeIndex;
//   constructor(index: NodeIndex, value: T) {
//     this.value = value;
//     this.index = index;
//   }
// }
//
// export class ObjectPool<T: Object> {
//   _factory: () => T;
//   _pool: { [NodeIndex]: ObjectPoolNode<T> };
//   _option: PoolOption;
//   _lastIndex: NodeIndex;
//
//   constructor(factory: () => T, option: Object = defaultPoolOption) {
//     this._factory = factory;
//     this._pool = {};
//     this._option = merge(defaultPoolOption, option);
//     this._lastIndex = 0;
//     this._initializePool();
//   }
//
//   clear() {
//
//   }
//
//   get() {
//
//   }
//
//   // PRIVATE METHODS
//
//   _initializePool() {
//     this.clear();
//   }
//
//   _raisePoolSize() {
//
//   }
// }
//
// export type PoolStateName = string;
//
// export type PoolForm<T: Object> = {
//   [PoolStateName]: {
//     factory: () => T,
//     getters?: { [string]: (ObjectPool<T>) => any },
//     option?: PoolOption,
//   },
// };
//
// type VuexModule = {
//   state: Object | () => Object,
//   getters?: { [string]: Function }
// }
//
// export function registerPool<T: Object>(module: VuexModule, form: PoolForm<T>) {
//   const getters = module.getters || {};
//
//   function registerState<T: Object>(form: PoolForm<T>, state: Object) {
//     Object.keys(form).forEach((key: PoolStateName) => {
//       const poolValue = form[key];
//       const poolGetters = poolValue.getters;
//       state[key] = new ObjectPool(poolValue.factory, poolValue.option);
//       if (poolGetters) {
//         Object.keys(poolGetters).forEach((getterKey: string) => {
//           getters[`${key}#${getterKey}`] = state => poolGetters[getterKey](state[key]);
//         });
//       }
//     });
//     return state;
//   }
//
//   if (typeof module.state === 'function') {
//     let tempState = module.state();
//     tempState = registerState(form, tempState);
//     module.state = () => tempState;
//   } else {
//     module.state = registerState(form, module.state);
//   }
//
//   module.getters = getters;
// }
