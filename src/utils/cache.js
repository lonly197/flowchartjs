'use strict'

/**
 * @class 数据缓存
 */
class Cache {
  constructor() {
    this._caches = null
    this.init()
  }
  init() {
    if (!this._caches) {
      this._caches = new WeakMap()
    }
  }
  addData(owner, name, data) {
    // 根据Element获取相应仓库存储的空间
    let cache = this._caches.get(owner)
    // 如果获取不到，则开辟空间
    if (!cache) {
      cache = {};
      // 放到WeakMap对象中
      this._caches.set(owner, cache)
    }
    // 挂数据
    cache[name] = data
    return cache
  }
  getData(owner, name) {
    // 根据Element获取相应仓库存储的空间
    const cache = this._caches.get(owner)
    // name为undefined的时候返回全部data，否则返回name指定的data
    return name === undefined ? cache : cache && cache[name]
  }
  removeData(owner, name) {
    let cache = this._caches.get(owner)
    // name为undefined的时候删除owner下的所有数据，否则只删除name指定的data
    if (!cache) {
      if (name) {
        cache[name] = undefined
      } else {
        cache = undefined
      }
    }
  }
  clearData() {
    this._caches = new WeakMap()
  }
}

export const cache = new Cache()
