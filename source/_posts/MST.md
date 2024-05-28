---
title: MST
tags: 么么直播
categories: 默认
date: 2021-07-13 14:42:57
---


## 序言  

React的组件化开发确实对于大型项目非常有用，大型项目的数据状态管理写乱了也是头疼和难以维护的，这里记录一下项目中使用的状态管理MST（mobx-state-tree）  

___

## 预备知识

* MobX：这是MST的核心，MST中存储的响应式“状态”都是MobX的Observable
* React：使用React来测试MST的功能非常简单
* TypeScript：后文中会使用TS来编写示例代码，TS强大的智能提示和类型检查，有助于快速掌握MST的API


## 安装

MST依赖MobX。
项目中执行yarn add mobx mobx-state-tree即可完成安装。
MobX有两个版本，新版本需要浏览器Proxy支持，一些老旧的浏览器并不支持，需要兼容老浏览器的请安装mobx@4：yarn add mobx@4 mobx-state-tree。


## 结构
* 使用MST来维护状态，首先需要让MST知道，这个状态的结构是什么样的。
MST内建了一个类型机制。通过类型的组合就可以定义出整个状态的形状。
并且，在开发环境下，MST可以通过这个定义好的形状，来判断状态的值和形状与其对应的类型是否匹配，确保状态的类型与预期一致，这有助于在开发时及时发现数据类型的问题：

* MST提供的一个重要对象就是types，在这个对象中，包含了基础的元类型（primitives types），如string、boolean、number，还包含了一些复杂类型的工厂方法和工具方法，常用的有model、array、map、optional等。
model是一个types中最重要的一个type，使用types.model方法得到的就是Model，在Model中，可以包含多个type或者其他Model。
一个Model可以看作是一个节点（Node），节点之间相互组合，就构造出了整棵状态树（State Tree）。
MST可用的类型和类型方法非常多，这里不一一列举，可以在这里查看完整的列表。
完成Model的定义后，可以使用Model.create方法获得Model的实例。Model.create可以传入两个参数，第一个是Model的初始状态值，第二个参数是可选参数，表示需要给Model及子Model的env对象（环境配置对象），env用于实现简单的依赖注入功能。



### Props

### Views

views是Model中一系列衍生数据或获取衍生数据的方法的集合，类似Vue组件的computed计算属性。

需要注意的是，定义views时有两种选择，使用getter或者不使用。使用getter时，衍生数据的值会被缓存直到依赖的数据发送变化。而不使用时，需要通过方法调用的方式获取衍生数据，无法对计算结果进行缓存。尽可能使用getter，有助于提升应用的性能。

### Actions

从名字上可以看出来，上面四位都是生命周期方法，可以使用他们在Model的各个生命周期执行一些操作：

除了通常意义上用来更新状态的actions外，在model.actions方法中，还可以设置一些特殊的actions：

afterCreate
afterAttach
beforeDetach
beforeDestroy

从名字上可以看出来，上面四位都是生命周期方法，可以使用他们在Model的各个生命周期执行一些操作：

```javascript
const Model = types
    .model(...)
    .actions(self => ({
        afterCreate () {
            // 执行一些初始化操作
        }
    }));
```


### 异步Action、Flow

异步更新状态是非常常见的需求，MST从底层支持异步action。

```javascript 
const model = types
    .model(...)
    .actions(self => ({
        // async/await
        async getData () {
            try {
                const data = await api.getData();
                ...
            } catch (err) {
                ...
            }
            ...
        },
        // promise
        updateData () {
            return api.updateData()
                .then(...)
                .catch(...);
        }
    }));
```
若使用Promise、async/await来编写异步Action，在异步操作之后更新状态时，代码执行的上下文会脱离action，导致状态在action之外被更新而报错。这里有两种解决办法：

1. 将更新状态的操作单独封装成action
2. 编写一个runInAction的action在异步操作中使用

```javascript

// 方法1
const Model = types
    .model(...)
    .actions(self => ({
        setLoading (loading: boolean) {
            self.loading = loading;
        },
        setData (data: any) {
            self.data = data;
        },
        async getData () {
            ...
            self.setLoading(true); // 这里因为在异步操作之前，直接赋值self.loading = true也ok
            const data = await api.getData();
            self.setData(data);
            self.setLoading(false);
            ...
        }
    }));
    
// 方法2
const Model = types
    .model(...)
    .actions(self => ({
        runInAction (fn: () => any) {
            fn();
        },
        async getData () {
            ...
            self.runInAction(() => self.loading = true);
            const data = await api.getData();
            self.runInAction(() => {
                self.data = data;
                self.loading = false;
            });
            ...
        }
    }));

```
方法1需要额外封装N个action，比较麻烦。方法2封装一次就可以多次使用。
但是在某些情况下，两种方法都不够完美：一个异步action被分割成了N个action调用，无法使用MST的插件机制实现整个异步action的原子操作、撤销/重做等高级功能。
为了解决这个问题，MST提供了flow方法来创建异步action：

```javascript
import { types, flow } from 'mobx-state-tree';

const model = types
    .model(...)
    .actions(self => {
        const getData = flow(function * () {
            self.loading = true;
            try {
                const data = yield api.getData();
                self.data = data;
            } catch (err) {
                ...
            }
            self.loading = false;
        });
        
        return {
            getData
        };
    })
```
使用flow方法需要传入一个generator function，在这个生成器方法中，使用yield关键字可以resolve异步操作。并且，在方法中可以直接给状态赋值，写起来更简单自然。




### 快照 Snapshot

snapshot即“快照”，表示某一时刻，Model的状态序列化之后的值。这个值是标准的JS对象。

使用getSnapshot方法获取快照：

使用applySnapshot方法可以更新Model的状态：

### Volatile State

在MST中，props对应的状态都是可持久化的，也就是可以序列化为标准的JSON数据。并且，props对应的状态必须与props的类型相匹配。
如果需要在Model中存储无需持久化，并且数据结构或类型无法预知的动态数据，可以设置为Volatile State。

Volatile State的值也是Observable，但是只会响应引用的变化，是一个非Deep Observable。

## 选择正确的types类型  

### types.string
定义一个字符串类型字段。
### types.number
定义一个数值类型字段。
### types.boolean
定义一个布尔类型字段。
### types.integer
定义一个整数类型字段。
注意，即使是TypeScript中也没有“整数”这个类型，在编码时，传入一个带小数的值TypeScript也无法发现其中的类型错误。如无必要，请使用types.number。
### types.Date
定义一个日期类型字段。
这个类型存储的值是标准的Date对象。在设置值时，可以选择传入数值类型的时间戳或者Date对象。


### types.null
定义一个值为null的类型字段。

### types.undefined
定义一个值为undefined的类型字段。
复合类型
### types.model
定义一个对象类型的字段。
### types.array
定义一个数组类型的字段。
types.array(types.string);
types.array(types.model);

### types.map
定义一个map类型的字段。该map的key都为字符串类型，map的值都为指定类型。
map可用set、 get进行取赋值
```javascript

export enum PopupType {
  Rule = '规则',
  Award = '奖励',
  Buy = '购买',
  Tip = '提示',
}

popup: types.map(types.boolean);

const showPopup = (type: PopupType) => {
  self.popup.set(type: true)
}

const hidePopup = (type: PopupType) => {
  self.popup.set(type, false);
};

// 具体使用
{popup.get(PopupType.Rule) && <PopupRule />}
```
### types.optional
可选类型,根据传入的参数，定义一个带有默认值的可选类型。
types.optional是一个方法，方法有两个参数，第一个参数是数据的真实类型，第二个参数是数据的默认值。
types.optional(types.number, 1);
上面的代码定义了一个默认值为1的数值类型。
注意，types.array或者types.map定义的类型自带默认值（array为[]，map为{}），也就是说，下面两种定义的结果是一样的：

```javascript
// 使用types.optional
types.optional(types.array(types.number), []);
types.optional(types.map(types.number), {});

// 不使用types.optional
types.array(types.number);
types.map(types.number);

```
如果要设置的默认值与types.array或types.map自带的默认值相同，那么就不需要使用types.optional。  

### types.custom
如果想控制类型更底层的如序列化和反序列化、类型校验等细节，或者根据一个class或interface来定义类型，可以使用types.custom定义自定义类型。

```javascript
class Decimal {
    ...
}

const DecimalPrimitive = types.custom<string, Decimal>({
    name: "Decimal",
    fromSnapshot(value: string) {
        return new Decimal(value)
    },
    toSnapshot(value: Decimal) {
        return value.toString()
    },
    isTargetType(value: string | Decimal): boolean {
        return value instanceof Decimal
    },
    getValidationMessage(value: string): string {
        if (/^-?\d+\.\d+$/.test(value)) return "" // OK
        return `'${value}' doesn't look like a valid decimal number`
    }
});

```

### types.union
实际开发中也许会遇到这样的情况：一个值的类型可能是字符串，也可能是数值。那我们就可以使用types.union定义联合类型：
- types.union(types.number, types.string);
联合类型可以有任意个联合的类型。

### types.literal
字面值类型可以限制存储的内容与给定的值严格相等。
比如使用types.literal('male')定义的状态值只能为'male'。
实际上，上面提到过的types.null以及types.undefined就是字面值类型：
- const NullType = types.literal(null);
const UndefinedType = types.literal(undefined);
搭配联合类型，可以这样定义一个性别类型：
  const GenderType = types.union(types.literal('male'), types.literal('female'));

### types.enumeration
枚举类型可以看作是联合类型以及字面值类型的一层封装，比如上面的性别可以使用枚举类型来定义：
const GenderType = types.enumeration('Gender', ['male', 'female']);
方法的第一个参数是可选的，表示枚举类型的名称。第二个参数传入的是字面值数组。
在TypeScript环境下，可以这样搭配TypeScript枚举使用：
```javascript
enum Gender {
    male,
    female
}

const GenderType = types.enumeration<Gender>('Gender', Object.values(Gender));
```

### types.maybe 
定义一个可能为undefined的字段，并自带默认值undefined。
```javascript
types.maybe(type)
// 等同于
types.optional(types.union(type, types.literal(undefined)), undefined)
```

### types.maybeNull
与types.maybe类似，将undefined替换成了null。
```javascript
types.maybe(type)
// 等同于
types.optional(types.union(type, types.literal(null)), null)
```

### types.frozen
frozen意为“冻结的”，types.frozen方法用来定义一个immutable类型，并且存放的值必须是可序列化的。

当数据的类型不确定时，在TypeScript中通常将值的类型设置为any，而在MST中，就需要使用types.frozen定义。

```javascript
awardPosition: types.frozen(),
notices: types.array(types.frozen()),
```
在MST看来，使用types.frozen定义类型的状态值是不可变的，所以会出现这样的情况：
```javascript
model.anyData = {a: 1, b: 2}; // ok, reactive
model.anyData.b = 3; // not reactive
```
也就是只有设置一个新的值给这个字段，相关的observer才会响应状态的更新。而修改这个字段内部的某个值，是不会被捕捉到的!!


### types.late
滞后类型
有时候会出现这样的需求，需要一个Model A，在A中，存在类型为A本身的字段。

如果这样写
```javascript
const A = types
    .model('A', {
        a: types.maybe(A), // 使用mabe避免无限循环
    });
```
会提示Block-scoped variable 'A' used before its declaration，也就是在A定义完成之前就试图使用他，这样是不被允许的

这个时候就需要使用types.late：

```javascript
const A = types
  .model('A', {
    a: types.maybe(types.late(() => A))
  });
```
types.late需要传入一个方法，在方法中返回A，这样就可以避开上面报错的问题。


### types.refinement 
提纯类型  

types.refinement可以在其他类型的基础上，添加额外的类型校验规则。

比如需要定义一个email字段，类型为字符串但必须满足email的标准格式，就可以这样做：

```javascript 
const EmailType = types.refinement(
    'Email',
    types.string,
    (snapshot) => /^[a-zA-Z_1-9]+@\.[a-z]+/.test(snapshot), // 校验是否符合email格式
);
```


## 实操  

MST (mobx-state-tree)，顾名思义是React用于管理状态的状态树结构，根据每个组件构建单独的状态树结构，一般建议状态树结构和接口或者推送保持一致的数据结构，便于更新维护。   
在请求接口和推送时，只需要更新对应的state，其他的页面级别的渲染等交给 observer 监听的组件。简单使用流程如下⬇️

___

```javascript {.line-numbers}

// 1 - 封装useContext
/***
 * 
 * 创建总的store文件夹
 * ./store
 * ./store/index.ts
 * ./store/room.ts
 */

// 1-1 ./store/index.ts

import { useContent, createContext } from 'react'
import { types, Instance, onSnapshot, applySnapshot} from 'mobx-state-tree'

import room from './room'

const RootModel = types.modal('RootModel', {
  room: room.Modal,
  // 还可以扩展相关其他的store
  // users: users.Modal,
})
.action(self => {
  return {}
})

let rootStore;


export const initStore = ({roomId, allRoomInfo}) => {
  const _rootStore = rootStore ?? RootModal.create({
    room: assign({}, room.initStore, {
      roomId: roomId,
      allRoomInfo,
    })
    //users: users.initState,
  })

  if ( typeof window !== 'undefined' ) {
    window.__store = _rootStore
  }

  if (typeof window === 'undefined' ) return _rootStore
  
  if (!rootStore) {
    rootStore = _rootStore
    // onSnapshot(rootStore, snapshot => console.log("stage Snapshot: ", snapshot));
  }

  return rootStore;
}

export type RootInstance = Instance<typeof RootStore>
const RootStoreContext = createContext<null || RootInstance>(null);

export const Provider = RootStoreContext.provider;

export const useStore = () => {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export const getStore = () => {
  return rootStore;
}

// 创建具体store（room.ts）文件
import { flow, types } from 'mobx-state-tree'
import { getStore } from './index'

const initState = {
  roomId: 0,
  allRoomInfo: {}
}

const PkModel = types.model('PkModel', {})

const AllRoomInfoModel = types.model('AllRoomInfoModel', {
  _id: '',
  pk: types.maybeNull(PkModel)
})
.views(self => {
  return {}
})
.actions(self => {
  return {}
})

export const Model = types
  .model({
    roomId: types.number,
    allRoomInfo: AllRoomInfoModel,
  })
  .views(self => {
    return {
      get hasId() => {
        return self._id !== ''
      },
      get isRoomOwner() {
        let userId = getGlobalStore().userId;
        return userId && userId === self.roomId;
      }
    }
  })
  .volatile(self=> {
    return {}
  })
  .actions(self => {
    const update = flow(function* () {
      let res;
      try {
        res = yield request.api.get('****/api/room/${self.roomID}')

        self.allRoomInfo = res.data
      }
    }),

    const setRoomInfo = (data) => {
      self.allRoomInfo = data
    },

    const stopLive = () => {
      ...
    }

    return {
      update, 
      setRoomInfo,
      stopLive,
    }
  })

export default {
  initState,
  Modal,
}

// 3-组件应用
import { observer } from 'mobx-react'
import { useStore } from '../store'

const BeHeadTip = observer(() => {
  const { room } = useStore()
  const { roomId, allRoomInfo, hasId} = room
  return (
    !hsdId ? '当前房间未在开播哟～' 
    : 
    <StyledBeHead id={ roomId }>组件内容</StyledBeHead>
  )
})

const StyledBeHead = styled.div`
  position: relative;
`

// 4-接口、推送更新store
// 4-1 接口

const loadInfo = () => {
  request.api.get('**/api/info_v2').then(res => {
    setRoomInfo(res.data)
  })
}

export default { loadInfo }

// 4-2 推送
const handle = (socket) => {
  socket.on('room_info', (msg) => {
    setRoomInfo(res.data)
  })
}
```

## 封装  

以上的创造store，可以简单封装下逻辑，让程序员更专注于model的构建

```javascript


// utils/create-store.ts

import { Instance } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

const createStore = ( Model: any, initialState: any ) => {
  type IStore = Instance<typeof Model>
  const store = Model.create(initialState)

  const StoreContext = createContext<null | IStore>(null)

  if (typeof window !== 'undefined') {
    if (window['__Act' + Model.name]) {
      window['__Act' + Model.name + random(100000, 10000)] = store
    } else {
      window['__Act' + Model.name] = store
    }
  }

  const useStore = ():IStore => {
    const currentStore = useContext(StoreContext)
    if (currentStore === null ) {
      throw new Error(`${Model.name} Store cannot be null, please add a context provider`)
    }
    return currentStore;
  }

  return {
    store,
    Provider: StoreContext.Provider,
    useStore,
  }
}

export default createStore;


//具体文件使用
// **/store.tsx

import { createStore } from '@utils/create-store'

export const Model = types
  .model('Model', {
    currentTab: '',
    list: [],
  })
  .action((self) => {
    const setCurrTab = (tab: string) => {
      self.currentTab = tab
    }
    return {
      setCurrTab
    }
  })

interface IModelSnapshotIn extend SnapshotIn<typeof Model>{}

// const initState: IModelSnapshotIn = {}
const initState = {
  currentTab: 'home',
  list: []
}

const { store, Provider, useStore } = createStore(Model, initState)

export { store, Provider, useStore }



// 页面引用store
// **/index.tsx

import { useStore } from './store'

const { currentTab, setCurrTab } = useStore()

```

## 总结  

在整个程序执行中，我们只需要控制数据状态的更新，以及在MST中处理好数据的逻辑，暴露出直接可以使用的方法。例如 hasId, MST中的 views 相当于 Vue 中的 计算属性，根据依赖值的变化，计算最新的结果。数据的更新只能在 actions 中暴露的方法中去实现。在面对具有非常复杂状态的大型项目时，可以提高开发效率。

