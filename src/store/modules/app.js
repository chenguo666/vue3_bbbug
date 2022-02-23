import { login as loginApi } from '@/api/login'
import router from '@/router'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('access_token') || '',
    myinfo: {},
    roominfo: {}
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('access_token', token)
    },
    setMyinfo(state, myinfo) {
      state.myinfo = myinfo
      localStorage.setItem('myinfo', myinfo)
    },
    setRoomInfo(state, roominfo) {
      state.roominfo = roominfo
      localStorage.setItem('roominfo', roominfo)
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            console.log(res)
            commit('setToken', res.access_token)
            setTokenTime()
            router.replace('/')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出
    logout({ commit }) {
      commit('setToken', '')
      localStorage.clear()
      router.replace('/login')
    }
  }
}
