<template>
  <div class="login_wrap">
    <div class="inner_wrap">
      <!-- <div class="top">
        <img src="../assets/images/login_top.png" alt="">
      </div> -->
      <p class="item_wrap">
        <img src="../assets/images/alarm_address.png" alt="">
        <input type="text" placeholder="IP地址" v-focus v-model="ip">
      </p>
      <p class="item_wrap">
        <img src="../assets/images/person.png" alt="">
        <input type="text" placeholder="账号" v-focus v-model="username">
      </p>
      <p class="item_wrap" style="margin-bottom:3%;">
        <img src="../assets/images/lock.png" alt="">
        <input type="password" placeholder="登录密码" v-focus v-model="password">
      </p>
      <el-checkbox v-model="checked" @change="handleChange">记住密码</el-checkbox>
      <div class="login_btn" @click="login">
        <img src="../assets/images/loading.png" alt="" v-if="rotateFlag">
        登录
      </div>
      <!-- <div class="bottom">
        <img src="../assets/images/login_bottom.png" alt="" class="test">
      </div> -->
    </div>
  </div>
</template>

<script>
// import Layout from './components/general/Layout'

export default {
  data () {
    return {
      rotateFlag: false,
      checked: null,
      ip: null,
      username: null,
      password: null
    }
  },
  name: 'Login',
  created () {
    if(localStorage.keepPs == "true"){
      if(localStorage.serverIP){
        this.checked = true
        this.ip = localStorage.serverIP
        this.username = localStorage.username
        this.password = localStorage.password
      }
    }
  },
  methods: {
    handleChange (val) {
      localStorage.keepPs = val
    },
    login () {
      if(!this.ip){
        this.showMsg('IP地址不能为空')
        return
      }
      if(!this.username){
        this.showMsg('账号不能为空')
        return
      }
      if(!this.password){
        this.showMsg('密码不能为空')
        return
      }
      this.rotateFlag = true
      axios.defaults.baseURL = 'http://' + this.ip + '/api/v1';
      axios.defaults.headers.common['authorization'] = "Basic " + btoa(this.username + ":" + this.password);
      axios.get('/user/current')
      .then((response) => {
        localStorage.serverIP = this.ip
        localStorage.username = this.username
        localStorage.password = this.password
        this.$router.push({
          path: '/alarmList'
        })
      })
      .catch((err) => {
        this.rotateFlag = false
        this.showMsg('账号信息有误或被禁用 !')
      })
    }
  },
  directives: {
    focus: {
      inserted: function(el){
        el.onfocus = function(){
          el.parentNode.classList.add('focus')
        }
        el.onblur = function(){
          el.parentNode.classList.remove('focus')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_wrap{
    width: 100%;
    position: absolute;
    top: -40px;
    bottom: -40px;
    box-sizing: border-box;
    background-image: url(../assets/images/bg.png);
    background-size: cover;
    background-position: center;
    /*border:1px solid red;*/
    .inner_wrap{ 
      margin-top: 50%;
      .top{
        width: 100%;
        text-align: center;
        padding-top: 25%;
        img{
          width: 70%;
        }
      }
      .item_wrap{
        width: 70%;
        margin: 5% auto;
        border: 1px solid #b8b8b8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 8px;
        img{
          width: 18px;
        }
        input{
          width: 90%;
          margin-left: 8px;
          outline: none;
          border:none;
          background-color: #fafafa;
          font-size: 12px;
          color: #4a87e3;
        }
      }
      .focus{
        border: 1px solid #4a87e3;
      }
      .login_btn{
        background-color: #4a87e3;
        color: white;
        line-height: 36px;
        border-radius: 5px;
        width: calc(70% + 16px);
        margin: 0 auto;
        font-size: 14px;
        margin-top: 3%;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 16px;
          margin-right: 5px;
          animation: loading-rotate 1.5s linear infinite;
        }
      }
      .el-checkbox{
        line-height: 0;
        width: 70%;
        text-align: right;
        padding-left: 0;
        margin: 0 auto;
        /*margin-top: -15px;*/
        border: none;
      }
      .bottom{
        width: 100%;
        font-size: 0;
        box-sizing: border-box;
        img{
          width: 100%;
        }
      }
    }
  }
  .el-checkbox__label{
    font-size: 12px !important;
  }
  @keyframes loading-rotate{
    100% {
      transform: rotate(1turn);
    }
  }
</style>