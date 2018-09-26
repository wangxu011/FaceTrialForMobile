<template>
  <div class="wrap">
    <div class="inner_wrap">
      <ul>
        <li>
          <p class="title_wrap">
            <i class="iconfont icon-locksuo"></i>
            <span>旧密码</span>
          </p>
          <p class="input_wrap">
            <input type="password" v-model="oldPasswd">
          </p>
        </li>
        <li>
          <p class="title_wrap">
            <i class="iconfont icon-lock2suo"></i>
            <span>新密码</span>
          </p>
          <p class="input_wrap">
            <input type="password" v-model="newPasswd">
          </p>
        </li>
        <li>
          <p class="title_wrap">
            <i class="iconfont icon-lock2suo"></i>
            <span>确认新密码</span>
          </p>
          <p class="input_wrap">
            <input type="password" v-model="confirmNewPasswd">
          </p>
        </li>
      </ul>
      <div class="confirm_btn" @click="confirm()">确认</div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      oldPasswd: null,
      newPasswd: null,
      confirmNewPasswd: null
    }
  },
  name: 'modifyPassword',
  methods: {
    confirm () {
      if(!this.oldPasswd){
        this.showMsg('旧密码不能为空')
        return
      }
      if(!this.newPasswd){
        this.showMsg('新密码不能为空')
        return
      }
      if(this.newPasswd!=this.confirmNewPasswd){
        this.showMsg('确认密码与新密码不一致')
        return
      }
      if(this.oldPasswd != localStorage.password){
        this.showMsg('输入的旧密码不正确')
        return
      }
      this.modifyPassword()
    },
    modifyPassword () {
      axios.put('/user/'+ localStorage.id +'/passwd', { password: this.newPasswd })
      .then((response) => {
        let type = null
        if(response.data.errorCode){
          type = 'error'
          this.showMsg(response.data.data.message, type)
        }else{
          this.showMsg('修改成功', 'success')
          localStorage.removeItem("serverIP")
          localStorage.removeItem("username")
          localStorage.removeItem("password")
          this.$router.push({
            path: '/'
          })
        }
      })
      .catch((err) => {
        this.showMsg(err, 'error')
      })
    }
  },
  created () {
    if(!localStorage.id){
      axios.get('/user/current')
      .then((response) => {
        localStorage.id = response.data.data.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    position: absolute;
    top:0px;
    bottom:-40px;
    background-color: #e4e9ef;
    .inner_wrap{
      width: 96%;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top:8px;
      bottom: 8px;
      left: 2%;
      right: 2%;
      ul{
        li{
          line-height: 25px;
          border-bottom: 1px solid #b8b8b8;
          color: #757575;
          font-size: 14px;
          box-sizing: border-box;
          padding-left: 20px;
          .title_wrap{
            margin-top: 15px;
          }
          .input_wrap{
            margin-bottom: 15px;
            margin-left: 20px;
            input{
              width: 100%;
              border: none;
              outline: none;
            }
          }
        }
      }
      .confirm_btn{
        width: 80%;
        outline: none;
        border: none;
        background-color: #4a87e3;
        border-radius: 5px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        text-align: center;
        color: white;
        margin:0 auto;
        margin-top: 12%;
      }
    }
  }
</style>