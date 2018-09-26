<template>
  <div style="width: 100%;height: 100%;position: relative;">
    <div class="header">
      <router-link :to="$route.matched[$route.matched.length-2]" v-if="$route.matched.length!=1">
        <i class="iconfont icon-left"></i>
      </router-link>
      {{ currentHashName }}
    </div>
    <div class="content_wrap">
      <router-view></router-view>
    </div>
    <div class="footer">
      <div class="menu_item" v-for="(item, index) in $router.options.routes" v-if="index>0">
        <router-link :to="item.path">
          <p style="margin-top: 5px;">
            <i :class="item.iconClass"></i>
          </p>
          <p>
            <span>{{ item.name }}</span>
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/general/Pagination'

export default {
  name: 'Layout',
  data () {
    return {
      menuTitle: 'tab1'
    }
  },
  methods: {
    
  },
  computed: {
    currentHashName: function(){     //使用箭头函数之后this的指向就不是vue对象了！！！
      return this.$route.name;
    }
  }
}
</script>

<style lang="scss" scoped>
  .header{
    width: 100%;
    height: 40px;
    background-color: #4a87e3;
    line-height: 40px;
    color: white;
    text-align: center;
    font-size: 14px;
    position: relative;
    a{
      position: absolute;
      left:20px;
      i{
        font-size: 20px;
      }
    }
    .confirm{
      position: absolute;
      right: 20px;
    }
  }
  .content_wrap{
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 40px;
    bottom: 40px;
    background-color: #e4e9ef; 
    z-index: 99;
  }
  .footer{
    width: 100%;
    height: 40px;
    position: fixed;
    bottom: 0;
    background-color: #fafafa;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-top: 1px solid #d5d5d5;
    .menu_item{
      width: 33%;
      font-size: 12px;
      color: #585858;
      text-align: center;
      a{
        display: block;
        width: 100%;
        height: 100%;
        p{
          line-height: 15px;
        }
      }
    }
  }
  .router-link-exact-active{
    color: #4a87e3;
  }
</style>