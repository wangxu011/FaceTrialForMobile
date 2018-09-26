import axios from 'axios'
import qs from 'qs'

let serverIP = null
let username = null
let password = null
if(localStorage.serverIP){
  serverIP = localStorage.serverIP
}
if(localStorage.userInfo){
  username = localStorage.username
}
if(localStorage.password){
  password = localStorage.password
}
axios.defaults.baseURL = 'http://' + serverIP + '/api/v1';
axios.defaults.headers.common['authorization'] = "Basic " + btoa(username + ":" + password);
axios.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded";

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    if ( config.method == "post" || config.method == "put" || config.method == "patch" ) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function(error) {
    // 请求错误时做些什么
    return Promise.reject(error);
  }
)

global.axios = axios
global.qs = qs