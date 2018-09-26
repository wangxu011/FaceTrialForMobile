<template>
  <div class="outer_wrap">
    <div class="header">
      <i class="iconfont icon-left" @click="closePage"></i>
      现场图片
    </div>
    <div class="img_wrap">
      <img :src="img" alt="">
    </div>
  </div>
</template>

<script>

export default {
  props: {
    img: String
  },
  name: 'spotImage',
  methods: {
    closePage () {
      this.$emit("closePage")
    }
  }
}
</script>

<style lang="scss" scoped>
  .outer_wrap{
    width: 100%;
    top:0;
    bottom:0;
    position: fixed;
    background-color: #000;
    z-index: 11;
    .header{
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: white;
      text-align: center;
      font-size: 14px;
      position: relative; 
      i{
        font-size: 20px;
        position: absolute;
        left:20px;
      }
    }
    .img_wrap{
      width: 100%;
      height: calc(100% - 40px);
      /*border: 1px solid red;*/
      box-sizing: border-box;
      position: relative;
      img{
        width: 100%;
        position: absolute;
        top:calc(50% - 20px);
        transform: translateY(-50%);
      }
    }
  }
</style>