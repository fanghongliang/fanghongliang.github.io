---
title: MST
tags: 默认
categories: 默认
date: 2021-07-13 14:42:57
---


## 序言  

React的组件化开发确实对于大型项目非常有用，大型项目的数据状态管理写乱了也是头疼和难以维护的，这里记录一下项目中使用的状态管理MST（mobx-state-tree）  

___


## 简述  

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

## 总结  

在整个程序执行中，我们只需要控制数据状态的更新，以及在MST中处理好数据的逻辑，暴露出直接可以使用的方法。例如 hasId, MST中的 views 相当于 Vue 中的 计算属性，根据依赖值的变化，计算最新的结果。数据的更新只能在 actions 中暴露的方法中去实现。在面对具有非常复杂状态的大型项目时，可以提高开发效率。

## 基本概念  

types.model 的数据类型：   

types.string  
types.number  
types.integer  
types.boolean  
types.Date  
types.custom  
等参见官网
