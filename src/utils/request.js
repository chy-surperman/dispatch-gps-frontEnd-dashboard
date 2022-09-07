import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken,removeToken } from '@/utils/auth'
import { baseURL, REQ_NOT_LOGIN } from './APIConstans'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL,
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
  // debugger;
  if (response.data == null && response.config.responseType === 'json' && response.request.responseText != null) {
    try {
      // eslint-disable-next-line no-param-reassign
      response.data = JSON.parse(response.request.responseText);
    } catch (e) {
      // ignored
    }
  }
  return response;
});

// service.interceptors.response.use(response => {
//   let request = response.request;
//   if (request.responseURL.lastIndexOf("data/login") == -1) {
//     if (response.data.code == REQ_NOT_LOGIN) {
//       removeToken();  //移除token  
//       router.push('/login')
//     }
//   }
//   return response;
// });

service.interceptors.response.use(
  response => {
    let request = response.request;
    if (request.responseURL.lastIndexOf("data/login") == -1) {
      if (response.data.code == REQ_NOT_LOGIN) {
        removeToken();  //移除token  
        router.push('/login')
      }
    } 
    
    return response;
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export const request = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      service.get(url, { params: params }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
          reject(error)
        })
    })
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      service.post(url, params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  delete(url, params) {
    return new Promise((resolve, reject) => {
      service.delete(url, { params: params })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  put(url, body, params) {
    return new Promise((resolve, reject) => {
      service.put(url, { params: params })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
