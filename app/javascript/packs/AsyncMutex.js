// source: https://github.com/mgtitimoli/await-mutex/blob/master/src/mutex.js
export default class AsyncMutex {
  constructor() {
    this._locking = Promise.resolve()
    this._locks = 0
  }

  isLocked() {
    return this._locks > 0
  }

  lock() {
    this._locks += 1

    let unlockNext

    let willLock = new Promise(
      resolve =>
        (unlockNext = () => {
          this._locks -= 1

          resolve()
        })
    )

    let willUnlock = this._locking.then(() => unlockNext)

    this._locking = this._locking.then(() => willLock)

    return willUnlock
  }

  async withLock(fn) {
    const release = await this.lock()
    try {
      return await fn()
    } finally {
      release()
    }
  }
}
