<template>
  <div class="innest_wrap">
    <div class="inner_wrap">
      <div class="tip">
        <p>设置人像比对时相似度阈值</p>
        <p>保存后每次搜索时都将默认使用该阈值进行比对</p>
        <p>推荐阈值为85%</p>
      </div>
      <div class="content_wrap">
        <p class="threshold clearfix">
          <span v-change="rangeValue">{{ rangeValue + '%' }}<i v-if="rangeValue==85">(推荐)</i></span>
        </p>
        <mt-range
          v-model="rangeValue"
          :min="70"
          :max="90"
          :step="1"
          :bar-height="5">
        </mt-range>
      </div>
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/general/Pagination'

export default {
  name: 'thresholdSetting',
  data () {
    return {
      rangeValue: 85
    }
  },
  directives: {
    change: {
      bind: function(el, binding){
        // console.log(binding);
        el.style.left = (binding.value-70)/20*100+ '%';
        el.style.transform = 'translateX(-'+(binding.value-70)/20*28.88+'px)';
      },
      update: function(el, binding){
        // console.log(binding);
        el.style.left = (binding.value-70)/20*100+ '%';
        el.style.transform = 'translateX(-'+(binding.value-70)/20*28.88+'px)';
      }
    }
  },
  created () {
    if(localStorage.threshold){
      this.rangeValue = Number(localStorage.threshold)
    }
  },
  destroyed () {
    localStorage.threshold = this.rangeValue
  }
}
</script>

<style lang="scss" scoped>
  .innest_wrap{
    width: 100%;
    position: relative;
    height: 100%;
    .inner_wrap{
      width: 96%;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top:8px;
      bottom: 8px;
      left: 2%;
      right: 2%;
      .tip{
        width: 100%;
        box-sizing: border-box;
        padding: 12px 15px;
        border-bottom: 1px solid #b8b8b8;
        color: #757575;
        p{
          font-size: 12px;
          line-height: 1.5em;
        }
      }
      .content_wrap{
        width: 100%;
        position: absolute;
        top: 79px;
        bottom: 0px;
        overflow-y: scroll;
        box-sizing: border-box;
        padding-top: 20%;
        .threshold{
          width: 70%;
          margin: 0 auto;
          color: #4a87e3;
          font-size: 12px;
          position: relative;
          /*border: 1px solid red;*/
          span{
            position: absolute;
          }
        }
        .mt-range{
          width: 70%;
          margin: 0 auto;
          margin-top: 20px;
        }
      }
    }
  }
</style>