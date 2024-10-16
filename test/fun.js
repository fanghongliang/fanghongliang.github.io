// 记录实用方法

const { log } = console

/**
 * 
 * 链式调用
 * 
 * 原理： 都是通过返回对象供之后进行调用。  
 * 1、this的作用域链，jQuery的实现方式，通常链式调用都是采用这种方式。
 * 2、返回对象本身，同 this de 区别就是显式返回链式对象
 * 3、闭包返回对象的方式实现，与函数柯里化类似
 * 
 * !!! 箭头函数this指向
 */


let Person = function() {};
Person.prototype.setAge = function(age){
    this.age = age; 
    log(`ta${age}岁`)
    return this;
}
Person.prototype.setWeight = function(weight){
    this.weight = weight; 
    log(`体重${weight}kg`)

    return this;
}

Person.prototype.eat = function (food) {
  this.food = food
  log(`eat ${food}`)
  return this 
}

Person.prototype.run = function(merter) {
  this.merter = merter
  log(`run ${merter}米`)
  return this 
}

Person.prototype.sleep = function (hour) {
  this.hour = hour
  log(`sleep ${hour} hours`)
  return this 
}


// var person = new Person();


// person.setAge(19).setWeight(110).eat('apple').run(30).sleep(8)


// 使用对象形式

const Monkey = {
  name: null,
  age: null,
  weight: null,
  setName: function(name) {
    this.name = name
    return this 
  },
  setAge: function(age) {
    this.age = age;
    return this 
  },
  setWeight: function(weight) {
    this.weight = weight
    return this 
  },
  get: function() {
    let desc =  `TA is ${this.name} and ${this.age}岁 、 ${this.weight}kg`
    log(desc)
  }
}


// Monkey.setName('monkey').setAge(9).setWeight(23).get()


//sleep 

// function sleep  (delay) {
//   return new Promise((res, rej) => {
//     setTimeout(res, delay)
//   })
// }

// log('@@==1')
// sleep(2000).then(() => {
//   log('@@==2')
// })

class EventEmitter {
  // 用来存放注册的事件与回调
  constructor() {
    this._events = {}
  }

  // 将事件回调函数存储到对应的事件上
  on (eventName, callback) {

    // 如果绑定的事件不是newListener 就触发改回调
    if (this._events[eventName]) {
      if(this.eventName !== "newListener"){
        this.emit("newListener", eventName)
      }
    }

    // 由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
    const callbacks = this._events[eventName] || []
    callbacks.push(callback)
    this._events[eventName] = callbacks
  }

  // args 用于收集发布事件时传递的参数
  emit (eventName, ...args) {
    const callbacks = this._events[eventName] || []
    // 获取到事件对应的回调函数依次执行
    callbacks.forEach(cb => cb(...args))
  }

  // 找到事件对应的回调函数，删除对应的回调函数 
  off (eventName, callback) {
    const callbacks = this._events[eventName] || []
    const newCallBacks = callbacks.filter(cb => cb != callback && cb.initialCallback != callback )
    // 基本思路： 未注销的函数依旧保留
    this._events[eventName] = newCallBacks
  }

  once (eventName, callback ) {
    // 由于需要在回调函数执行后，取消订阅当前事件，所以需要对传入的回调函数做一层包装,然后绑定包装后的函数
    const one = (...args) => {
      callback(...args)
      this.off(eventName, one)
    }

    // 由于：我们订阅事件的时候，修改了原回调函数的引用，所以，用户触发 off 的时候不能找到对应的回调函数
    // 所以，我们需要在当前函数与用户传入的回调函数做一个绑定，我们通过自定义属性来实现
    one.initialCallback = callback
    this.on(eventName, one)
  }
}

// const events = new EventEmitter()

// events.on('newListener', function(eventName) {
//   console.log(`eventName`, eventName)
// })

// events.on("hello", function(){
//   console.log("hello");
// })

// let cb = function(){
//   console.log('cb');
// }
// events.on("hello", cb)

// // events.off("hello", cb)

// function once(){
//   console.log("once");
// }
// events.once("hello", once)

// events.off("hello", once)
// events.emit("hello")
// events.emit("hello")



const Person1 = function () {}


Person1.prototype.sayHello = function() {
  log('hello')
  return this 
}


Person1.prototype.sayBye = function () {
  log('bye bye')
  return this 
}

const person2 = new Person1

const Monkey2 = function() {}

Monkey2.prototype.sayBye = function() {
  log('bye')
  return this 
}

Monkey2.prototype.sayHello = function() {
  log('hello')
  return this 
}


class Monkey4 {
  constructor() {
    name: null
  }

  sayBye() {
    log(1)
    return this 
  }

  sayHello() {
    log(2)
    return this 

  }
}
// const monkey88 = new Monkey4()

// monkey88.sayBye().sayBye().sayBye().sayHello()

// const sleep1 = function( delay ) {
//   return new Promise((response, reject) => {
//     setTimeout(response, delay)
//   })
// }

// log(1)
// sleep1(2000).then(res => {
// log(2)

// })

const sleep3 = function( delay ) {
  let date = +new Date()
  let end =  date + delay
  while(true) {
    if ( +new Date() > end) {
      return 
    }
  }
}

// log(2222)
// sleep3(2000)
// log(33333)


/// promise .all 

// const fn1 = () => {
//   return new Promise((resolve, reject) => {
//      resolve(111111);
//   });
// };
// const fn2 = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(222222)
//     }, 2000)
//   });
// };
// const fn3 = () => {
//   return new Promise((resolve, reject) => {
//     resolve(33333);
//   });
// };

// const PromiseAll = (d = []) => {
//   return new Promise((resolve, reject) => {
//     const result = []
//     d.forEach((item, index) => {
//       item.then((res) => {
//         result.push(res)
//         if (d.length === result.length) {
//           resolve({
//             status: true,
//             data: result,
//             message: null,
//           })
//         }
//       }).catch((error) => {
//         reject({
//           status: false,
//           data: null,
//           message: 'error'
//         })
//       })
//     })
//   })
// }




// PromiseAll([fn1(), fn2(), fn3()]).then(res => {
//   console.log('@@===>', res)
// }).catch(err => {
//   console.log('@@====err', err)
// })

// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise((resolve, reject) => {
//     setTimeout(resolve, 1000, 'foo');
// });

// const myPromiseAll = function (promises) {
//   return new Promise((resolve, reject) => {
//     let completeIndex = 0
//     let result = []
//     if (promises.length === 0) {
//       resolve(result)
//     }
//     //遍历循环
//     promises.forEach((item, index) => {
//       Promise.resolve(item).then(res => {
//         result[index] = res
//         completeIndex++
//         if (completeIndex === promises.length) {
//           resolve(result)
//         }
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// }

const PromiseAll = function(promiseArr=[]) {
  return new Promise((resolve, reject) => {
    let result = []
    let completeIndex = 0
    if (!Array.isArray(promiseArr)) {
      const type = typeof promiseArr
      reject(`TypeError: ${type} ${promiseArr} is not iterable`)
    }
    console.log(345)
    promiseArr.forEach((promise, index) => {
      Promise.resolve(promise).then(res => {
        result[index] = res
        completeIndex++
        if (promiseArr.length === completeIndex ) {
          resolve(result)
        }
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// PromiseAll(1).then(res => {
//   console.log('@@====>',res)
// }).catch(err => {
//   console.log('@@====> err', err)
// })


// Promsie 

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';


class MyPromise {
  constructor(executor) {
    this.status = PENDING,
    this.value = undefined
    this.reason = undefined

    this.onResolvedCb = []

    this.onRejectedCb = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCb.forEach(cb => cb())
      }
    }

    const reject = (reason) => {
      if(this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCb.forEach(cb => cb())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }


  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } 

    if (this.status === REJECTED) {
      onRejected(this.reason)
    } 

    if (this.status === PENDING) {
      this.onResolvedCb.push(() => {
        onFulfilled(this.value)
      })

      this.onRejectedCb.push(() => {
        onRejected(this.reason)
      })
    }
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

}

// const promise =  new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1)
//   }, 1000)
// }).then((res) => {
//   log('success: ', res)
// },(err) => {
//   log('fail', err)
// }).then(err => {
//   log(2)
// })


class WPromise {
  static PENDING = 'PENDING';
  static FULFILLED = 'FULFILLED';
  static REJECTED = 'REJECTED';

  constructor(executor) {
    this.status = WPromise.PENDING
    this.value = undefined
    this.reason = undefined;
    this.onResolvedCb = []
    this.onRejectedCb = []

    const resolve =  (value) => {
      if (this.status === WPromise.PENDING) {
        this.status = WPromise.FULFILLED
        this.value = value
        this.onResolvedCb.forEach(cb => cb())
      }
    };

    const reject = (reason) => {
      if (this.status === WPromise.PENDING) {
        this.status = WPromise.REJECTED
        this.reason = reason
        this.onRejectedCb.forEach(cb => cb())
        
      }
    }

    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }

  }

  _handler(callback) {
    const {onFulfilled, onRejected, nextResolve, nextReject} = callback
    if (this.status === WPromise.FULFILLED) {
      const nextValue = onFulfilled ? onFulfilled(this.value) : undefined
      nextResolve(nextValue)
      return
    }

    if (this.status === WPromise.REJECTED) {
      const nextReason = onRejected ? onRejected(this.reason) : undefined
      nextReject(nextReason)
      return
    }

    if (this.status === WPromise.PENDING) {

      onFulfilled && this.onResolvedCb.push(() => {
        onFulfilled(this.value)
      })

      onRejected && this.onResolvedCb.push(() => {
        onRejected(this.reason)
      })
    }
  }


  then(onFulfilled, onRejected) {
    return new WPromise((nextResolve, nextReject) => {
      this._handler({
        onFulfilled,
        onRejected,
        nextResolve,
        nextReject,
      })
    })
  }

}

const p = new WPromise((resolve, reject) => {
  setTimeout(() => {
    log(2)
    resolve(2)
  }, 2000)
}).then((res)=> {
  log(3)
}, ).then(res => {log(4)}).then(res => log(5))


