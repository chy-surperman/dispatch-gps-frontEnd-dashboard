import { login, logout } from '@/api/user'
import { REQ_SUCCESS } from '@/utils/APIConstans'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  company: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_COMPANY: (state, company) => {
    state.company = company
  }
} 

const actions = {
  // user login 
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ uName: username.trim(), password: password }).then(resp => {
        if(resp.code == REQ_SUCCESS){
            commit('SET_TOKEN', resp.result.uId)
            setToken(resp.result.uId)
            resolve()
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // set token
  saveLogin({ commit },userInfo) {
      const { uId,uName,uCompany } = userInfo;
      commit('SET_TOKEN',uId);
      setToken(uId);
      commit('SET_NAME',uName);
      commit('SET_COMPANY',uCompany);
  },

  // user logout
  logout({ commit, state }) { 
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

