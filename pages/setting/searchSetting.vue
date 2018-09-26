<template>
  <div class="wrap">
    <div class="inner_wrap">
      <ul>
        <li v-for="item in $router.options.routes[3].children[1].children">
          <router-link :to="item.path">
            <img :src="item.iconClass" alt="">
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <transition name="fade">  
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'searchSetting',
  components: {
    
  },
  methods: {
    
  },
  created () {
    // console.log(this.$router.options.routes)
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
          line-height: 40px;
          border-bottom: 1px solid #b8b8b8;
          color: #757575;
          font-size: 14px;
          box-sizing: border-box;
          padding-left: 20px;
          a{
            width: 100%;
            display: flex;
            align-items: center;
            img{
              width: 16px;
            }
            span{
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
</style>