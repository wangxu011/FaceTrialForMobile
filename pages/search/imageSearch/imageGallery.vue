<template>
  <div class="inner_wrap">
    <transition name="drop">
      <div v-if="spinnerFlag">
        <spinner style="top:6%;"></spinner>
      </div>
    </transition>
    <p class="total">共搜索到{{ total }}个相似人脸</p>
    <div class="item_wrap">
      <mt-loadmore :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange">
        <ul>
          <li v-for="(item, index) in list" class="clearfix">
            <div class="img_wrap">
              <img :src="'http://119.29.20.90:8080' + item.person.faceUrl" alt="">
            </div>
            <div class="name_wrap">
              <p class="name">{{ item.person.name }}</p>
              <p class="db_name">{{ item.person.facedb.name }}</p>
            </div>
            <div class="score">
              <span>{{ Math.round(item.similarity) }}</span> %
            </div>
          </li>
          <li class="no_more" v-show="total">没有更多数据</li>
        </ul>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus != 'loading'">↓</span>
          <span v-show="test">
            <!-- <div class="mint-spinner-snake"></div> -->
            <spinner></spinner>
          </span>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/general/Spinner'

export default {
  data () {
    return {
      spinnerFlag: true,
      total: null,
      galleries: null,
      dbIds: null,
      threshold: null,
      imgData: null,
      list: null,
      baseURL: null,
      topStatus: null,
      test: null
    }
  },
  name: 'imageGallery',
  components: {
    Spinner
  },
  methods: {
    handleTopChange (status) {
      this.topStatus = status
      console.log(status)
      if(status == 'loading'){
        this.test = true
      }
    },
    loadTop () {
      this.getResult()
    },
    getIds () {
      let tempArr = []
      this.galleries = JSON.parse(localStorage.checkedGalleries)
      for(var i=0;i<this.galleries.length;i++){
        tempArr.push(JSON.parse(this.galleries[i]).id)
      }
      this.dbIds = tempArr.join(',')
    },
    getResult () {
      axios.post('/person/matchByImage', { 
          dbIds: this.dbIds, 
          similarity: this.threshold, 
          imageData: this.imgData
        })
        .then((response) => {
          this.spinnerFlag = false
          console.log(response)
          this.test = false
          this.$refs.loadmore.onTopLoaded();
          this.total = response.data.data.totalElements
          if(response.data.data.content){
            this.list = response.data.data.content
          }else{
            this.list = []
          }
        })
    },
    packageFun () {
      // get Ids
      this.getIds()
      // get threshold
      if(!localStorage.threshold){
        this.threshold = 85
      }else{
        this.threshold = localStorage.threshold
      }
      // get imageData
      this.imgData = localStorage.targetImage
      this.getResult()
    }
  },
  created () {
    if(!localStorage.checkedGalleries){
      axios.get('/facedb/black')
        .then((response) => {
          let tempArr = []
          for(let i=0;i<response.data.data.length;i++){
            tempArr.push(JSON.stringify(response.data.data[i]))
          }
          localStorage.checkedGalleries = JSON.stringify(tempArr)
          this.packageFun()
        })
    }else{
      this.packageFun()
    }
  }
}
</script>

<style lang="scss" scoped>
  .drop-enter-active, .drop-leave-active{
    transition: all 2s;
  }
  .drop-enter, .drop-leave-active{
    transform: translateY(-500px);
    opacity: 0;
  }
  
  .inner_wrap{
    width: 96%;
    left: 2%;
    position: absolute;
    background-color: #fff;
    border-radius: 5px;
    top:7px;
    bottom:0;
    color: #757575;
    .total{
      text-align: center;
      padding-top: 5px;
      font-size: 12px;
    }
    .item_wrap{
      height: calc(100% - 27px);
      /*border:1px solid red;*/
      box-sizing: border-box;
      margin-top: 10px;
      overflow-y: scroll;
      li{
        padding: 10px;
        border-bottom: 1px solid #aaa;
        .img_wrap{
          width: 18%;
          height: 0;
          padding-bottom: 18%;
          font-size: 0;
          position: relative;
          float: left;
          overflow: hidden;
          border-radius: 4px 4px 0 0;
          img{
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            border-radius: 4px 4px 0 0;
          }
        }
        .name_wrap{
          float: left;
          margin-left: 10px;
          p{
            line-height: 2em;
          }
          .name{
            color: #4a87e3;
          }
          .db_name{
            font-size: 12px;
            color: #7b7b7b;
          }
        }
        .score{
          float: right;
          color: #4a87e3;
          margin-top: 5%;
          span{
            font-size: 20px;
          }
        }
      }
      li.no_more{
        text-align: center;
        line-height: 2.5em;
        color: #ccc;
        font-size: 12px;
        border: none;
      }
    }
  }
  .mint-loadmore{
    height: 100%;
  }
</style>