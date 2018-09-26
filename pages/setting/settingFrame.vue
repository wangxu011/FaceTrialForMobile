<template>
  <div style="width:100%;height:100%;">
    <div class="setting_wrap">
      <ul>
        <li v-for="item in $router.options.routes[3].children">
          <router-link :to="item.path">
            <i :class="item.iconClass"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
        <li>
          <a href="javascript:void(0)" @click="logout">
            <i class="iconfont icon-poweroff"></i>
            <span>退出</span>
          </a>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    
  </div>
</template>

<script>
// import Pagination from '@/components/general/Pagination'

export default {
  name: 'settingFrame',
  methods: {
    logout () {
      localStorage.removeItem("serverIP")
      localStorage.removeItem("username")
      localStorage.removeItem("password")
      this.$router.push({
        path: '/'
      })
    }
  },
  created () {
    if(!localStorage.serverIP){
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting_wrap{
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
        line-height: 40px;
        border-bottom: 1px solid #b8b8b8;
        color: #757575;
        font-size: 14px;
        box-sizing: border-box;
        padding-left: 20px;
        a{
          width: 100%;
          display: block;
          span{
            margin-left: 10px;
          }
        }
      }
    }
  }
  .child_router_wrap{
    width: 100%;
    position: fixed;
    height: 100%;
    background-color:red;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active{
    transform: translateX(500px);
    opacity: 0;
  }
</style>