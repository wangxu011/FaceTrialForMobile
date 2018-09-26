<template>
  <div style="width:100%;height:100%;">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">未处理</mt-tab-item>
      <mt-tab-item id="2">全部告警</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1" v-if="selected==1">
        <undealed></undealed>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" v-if="selected==2">
        <all-alarms></all-alarms>
      </mt-tab-container-item>
    </mt-tab-container>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import undealed from './undealed'
import allAlarms from './allAlarms'

export default {
  data () {
    return {
      selected: '1',
      pickerFlag: false
    }
  },
  name: 'alarmListFrame',
  components: {
    undealed,
    allAlarms
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
  .mint-tab-container{
    position: absolute;
    width: 100%;
    top: 39px;
    bottom: 0px;
    box-sizing: border-box;
    overflow: visible;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active{
    transform: translateX(500px);
    opacity: 0;
  }
  .inner_wrapper{
    bottom: -40px !important;
  }
</style>