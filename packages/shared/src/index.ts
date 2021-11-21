import { makeMap } from './makeMap'

export { makeMap }
export * from './patchFlags'
export * from './shapeFlags'
export * from './slotFlags'
export * from './globalsWhitelist'
export * from './codeframe'
export * from './normalizeProp'
export * from './domTagConfig'
export * from './domAttrConfig'
export * from './escapeHtml'
export * from './looseEqual'
export * from './toDisplayString'

/**
 * List of @babel/parser plugins that are used for template expression
 * transforms and SFC script transforms. By default we enable proposals slated
 * for ES2020. This will need to be updated as the spec moves forward.
 * Full list at https://babeljs.io/docs/en/next/babel-parser#plugins
 */
debugger;
export const babelParserDefaultPlugins = [
  'bigInt',
  'optionalChaining',
  'nullishCoalescingOperator'
] as const
/* 

  Object.freeze({}) 冻结对象, 第一层对象的值，是不能修改的 

  __DEV__ 就是process.env.NODE_ENV !== 'production'

*/
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : []

/* 空函数，
1， 方便做条件判断； 

2， 方便压缩， function(){} 不方便压缩代码

*/
export const NOOP = () => {}

/**
 * Always return false.
 */
/* 永远返回FALSE的函数，也是方便压缩 */
export const NO = () => false

/* 
  判断字符串是不是on开头，并且on后面的不是小写字母
  isOn('onChange'); // true
  isOn('onchange'); // false
  isOn('on3change'); // true
  https://juejin.cn/post/6844903501034684430
*/
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)

/* 
  判断字符串是不是以onUpdate:开头
  监听器，
  字符串函数， startsWith,这是字符串的新增方法
*/
export const isModelListener = (key: string) => key.startsWith('onUpdate:')

/* 
  对象的合并方法
*/
export const extend = Object.assign

/* 
  这个方法封装的好呀
  移除数组中的一项
  使用splice确实比较消耗性能，
  axios拦截器为了解决这个问题，把要删除的这一项设置为null就行了
  在学习算法的时候，也学到了这个知识
*/
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
/* 
  是不是本身所拥有的属性
  不是通过原型链向上查找的
*/
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)
/* 
  判断数组
*/
export const isArray = Array.isArray

/* 

判断是不是Map对象 

ES6 提供了 Map 数据结构。
它类似于对象，也是键值对的集合，
但是“键”的范围不限于字符串，
各种类型的值（包括对象）都可以当作键。
也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，
是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

*/
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'

/* 
  判断是不是Set对象
  类似于数组，但是成员的值都是唯一的，没有重复
*/
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

  /* 
    判断是不是Date对象
    主要是这个的使用instanceof 的使用
    简单理解成，左边是右边的实例， 原理是根据原型链，向上查找
  */
export const isDate = (val: unknown): val is Date => val instanceof Date
/* 
  判断是不是函数，
  主要是typeof的使用
*/
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
/* 
  判断是不是字符串
*/
export const isString = (val: unknown): val is string => typeof val === 'string'
/* 
  判断是不是Symbol类型的值
  ES6引入的新的原始类型，表示独一无二的值
*/
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
/* 
  判断是不是对象，
  使用typeof null 也是object

*/
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

  /* 
    判断是不是Promise
    http://liubin.org/promises-book/  promise迷你书
    主要是异步编程
  */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/* 
  对象转成字符串

*/
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}

const camelizeRE = /-(\w)/g
/**
 * @private
 */
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

const hyphenateRE = /\B([A-Z])/g
/**
 * @private
 */
export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)

/**
 * @private
 */
export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
)

/**
 * @private
 */
export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : ``
)

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}

export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}

export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

let _globalThis: any
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
