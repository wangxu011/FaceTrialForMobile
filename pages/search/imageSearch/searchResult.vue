<template>
  <div class="first_wrap">
    <!-- tab-nav -->
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">人像库</mt-tab-item>
      <mt-tab-item id="2">抓拍记录</mt-tab-item>
      <mt-tab-item id="3">告警记录</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1" v-if="selected==1">
        <image-gallery></image-gallery>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" v-if="selected==2">
        <captured-list></captured-list>
      </mt-tab-container-item>
      <mt-tab-container-item id="3" v-if="selected==3">
        <alarms-list></alarms-list>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="bottom_wrap">
      <div class="img_wrap">
        <img :src="targetPic" alt="">
      </div>
      <div class="add_to_gallery" @click="addToGallery">添加到库</div>
      <div class="turnback" @click="turnBack">返回</div>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import imageGallery from './imageGallery'
import capturedList from './capturedList'
import alarmsList from './alarmsList'

export default {
  data () {
    return {
      selected: '1',
      targetPic: null,
      image: null
    }
  },
  name: 'searchResult',
  components: {
    imageGallery,
    capturedList,
    alarmsList
  },
  created () {
    this.image = localStorage.targetImage
    this.targetPic = 'data:image/jpeg;base64,' + localStorage.targetImage
  },
  methods: {
    addToGallery () {
      this.$router.push({
        path: '/search/addToGallery',
        query: { 
          target: this.image
        }
      })
    },
    turnBack () {
      this.$router.push({
        path: '/search'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mint-tab-container{
    overflow: visible;
  }
  .first_wrap{
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: -40px;
    background-color: #e4e9ef;
    z-index: 10;
    .mint-tab-container{
      position: absolute;
      width: 100%;
      top: 39px;
      bottom: 85px;
      box-sizing: border-box;
      /*z-index: -1;*/
      /*border:1px solid red;*/
    }
    .bottom_wrap{
      width: 96%;
      position: absolute;
      height: 70px;
      bottom: 7px;
      left: 2%;
      background-color: #fff;
      border-radius: 5px;
      padding: 9px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
      .img_wrap{
        width: 25%;
        height: 100%;
        overflow: hidden;
        position: relative;
        img{
          width: 80%;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
        }
      }
      .add_to_gallery{
        width: 30%;
        background-color: #4a87e3;
        color: white;
        text-align: center;
        line-height: 2.5em;
        font-size: 12px;
        border-radius: 5px;
      }
      .turnback{
        width: 30%;
        color: #777;
        text-align: center;
        line-height: 2.5em;
        font-size: 12px;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
    }
  }
</style>