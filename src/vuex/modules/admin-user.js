import {
  RECEIVE_ADMIN_USER,
  RECEIVE_TOKEN,
  LOGOUT,
  RECEIVE_USER_LIST,
} from '../mutation-types'

import {
  getAdminUser,
  getUserInfo,
} from 'api/user'

import storageUtils from '@/utils/storageUtils'

const state = {
  token: storageUtils.getToken(), // 登录token标识,
  adminUser: {},
  adminUserList: null
}
/**
 * 包含同步action和异步action
 */
const actions = {
  saveToken({ commit }, token) {
    storageUtils.saveToken(token)
    commit(RECEIVE_TOKEN, { token })
  },
  async saveUser({ commit }) {
    const user = await getUserInfo();
    commit(RECEIVE_ADMIN_USER, { user })
  },
  logout({ commit }) {
    storageUtils.removeToken()
    commit(LOGOUT)
  },
  async getUserList({ commit }) {
    const userList = await getAdminUser()
    commit(RECEIVE_USER_LIST, { userList })
  },
}

const mutations = {
  [RECEIVE_TOKEN](state, { token }) {
    state.token = token
  },
  [RECEIVE_ADMIN_USER](state, { user }) {
    state.adminUser = user
  },
  [LOGOUT](state) {
    state.token = ''
    state.adminUser = {}
  },
  [RECEIVE_USER_LIST](state, { userList }) {
    state.adminUserList = userList
  },
}



const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}