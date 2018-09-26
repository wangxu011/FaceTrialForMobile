<template>
  <div class="inner_wrap">
    <transition name="fade">
      <spot-image v-if="imgFlag" @closePage="closePage" :img="targetImg"></spot-image>
    </transition>
    <img src="../../../assets/images/top.png" alt="" class="top" v-if="topFlag" @click="toTop">
    <transition name="drop">
      <div v-show="spinnerFlag">
        <spinner></spinner>
      </div>
    </transition>
    <div class="filter_bar">
      <div class="input_wrap" style="display:flex;align-items:center">
        <p class="title">共搜索到{{ total }}个相似人脸</p>
      </div>
      <div class="input_wrap">
        <input type="text" placeholder="时间筛选" @click="datePickerFlag=true" readonly="readonly" v-model="dateRange">
        <img src="../../../assets/images/calendar.png" alt="">
      </div>
    </div>
    <div class="item_wrap" @scroll="handleScroll($event)" ref="toTop">
      <mt-loadmore :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange">
        <ul v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" class="scroll_container">
          <li v-for="(item, index) in list" class="clearfix">
            <dl class="pic">
              <dt>
                <img :src="'http://' + item.alarm.serverIp + ':8000/image/' + item.alarm.facePath" alt="" @click="showImg($event)">
              </dt>
              <dd>现场图片</dd>
            </dl>
            <div class="score">
              <span>{{ Math.round(item.similarity) }}</span>%
            </div>
            <div class="info_wrap">
              <p class="time">{{ item.alarm.createDate | date }}</p>
              <p class="addr">{{ item.alarm.cameraName }}</p>
            </div>
          </li>
          <li class="loading" v-if="loading">
            <snake></snake>
            <div class="word">正在加载中. . .</div>
          </li>
          <li class="no_more" v-if="list.length == total">没有更多数据</li>
        </ul>
        <!-- 自定义下拉刷新的模板 -->
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus != 'loading'" style="color:#4a87e3;">↓</span>
          <span v-show="roll">
            <spinner style="top:15px;"></spinner>
          </span>
        </div>
      </mt-loadmore>
    </div>
    <transition name="fade">
      <date-picker v-if="datePickerFlag" @notSaveDate="datePickerFlag=false" @saveDate="saveDate" :start="startTime" :end="endTime" style="bottom:-94px;"></date-picker>
    </transition>
  </div>
</template>

<script>
import spotImage from '@/components/general/spotImage'
import Spinner from '@/components/general/Spinner'
import Snake from '@/components/general/Snake'
import datePicker from '@/pages/alarmList/datePicker'

export default {
  data () {
    return {
      imgFlag: null,
      targetImg: null,
      startTime: null,
      endTime: null,
      start: '',
      end: '',
      datePickerFlag: false,
      topFlag: null,
      loading: false,
      roll: null,
      topStatus: null,
      spinnerFlag: true,
      total: null,
      dateRange: null,
      list: [],
      threshold: null,
      cameraIds: null,
      currentPage: null
    }
  },
  methods: {
    closePage () {
      this.imgFlag = false
    },
    showImg (e) {
      this.imgFlag = true
      this.targetImg = e.target.src
    },
    toTop () {
      this.$refs.toTop.scrollTop = 0
    },
    // 监听滚动事件
    handleScroll (e) {
      if(e.target.scrollTop > 600){
        this.topFlag = true
      }else{
        this.topFlag = false
      }
    },
    // 触底加载更多
    loadMore () {
      if(this.list.length == this.total){
        return
      }
      this.loading = true
      this.currentPage ++
      axios.post('/alarm/match', {
        feature: localStorage.targetFeature,
        similarity: this.threshold,
        types: '2',
        cameraIds: this.cameraIds,
        top: 300,
        page: this.currentPage,
        startTime: this.start,
        endTime: this.end
      })
      .then((response) => {
        console.log(response)
        this.list = this.list.concat(response.data.data.content)
        this.loading = false
      })
    },
    loadTop () {
      this.pullRefresh()
    },
    handleTopChange (status) {
      this.topStatus = status
      if(status == 'loading'){
        this.roll = true
      }
    },
    // 下拉更新
    pullRefresh () {
      axios.post('/alarm/match', {
        feature: localStorage.targetFeature,
        similarity: this.threshold,
        types: '2',
        cameraIds: this.cameraIds,
        top: 300,
        startTime: this.start,
        endTime: this.end
      })
      .then((response) => {
        this.currentPage = 0
        // 下拉刷新归位
        this.$refs.loadmore.onTopLoaded();
        this.roll = false
        this.total = response.data.data.totalElements
        this.list = response.data.data.content
      })
    },
    getIds () {
      let temp = JSON.parse(localStorage.checkedCameras)
      let arr = []
      for(let i=0;i<temp.length;i++){
        arr.push(JSON.parse(temp[i]).id)
      }
      this.cameraIds = arr.join(',')
    },
    queryList () {
      this.getIds()
      axios.post('/alarm/match', {
        feature: localStorage.targetFeature,
        similarity: this.threshold,
        types: '2',
        cameraIds: this.cameraIds,
        top: 300
      })
      .then((response) => {
        this.currentPage = 0
        this.spinnerFlag = false
        this.total = response.data.data.totalElements
        this.list = response.data.data.content
      })
    },
    // datePicker
    saveDate (data) {
      this.startTime = data.startTime
      this.endTime = data.endTime
      this.dateRange = this.transformDate(this.startTime.time) + " - " + this.transformDate(this.endTime.time)
      this.datePickerFlag = false
      this.spinnerFlag = true
      // 重新获取筛选时间后的list
      this.start = this.convertToServer(data.startTime.time)
      this.end = this.convertToServer(data.endTime.time + 86400000)
      this.currentPage = 0
      axios.post('/alarm/match', {
        feature: localStorage.targetFeature,
        similarity: this.threshold,
        types: '2',
        cameraIds: this.cameraIds,
        top: 300,
        page: this.currentPage,
        startTime: this.start,
        endTime: this.end
      })
      .then((response) => {
        this.total = response.data.data.totalElements
        this.list = response.data.data.content
        this.spinnerFlag = false
        this.toTop()
      })
    },
    transformDate (time){
      if(time){
        var d = new Date(time);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month  =  month < 10 ? '0' + month : '' + month;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        return  year+ '/' + month + '/' + day;
      }
    },
    convertToServer (time){
      if(time){
        var d = new Date(time);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month  =  month < 10 ? '0' + month : '' + month;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        return  year+ '-' + month + '-' + day + ' 00:00';
      }
    }
  },
  name: 'capturedList',
  components: {
    spotImage,
    Spinner,
    Snake,
    datePicker 
  },
  created () {
    // get threshold
    if(!localStorage.threshold){
      this.threshold = 85
    }else{
      this.threshold = localStorage.threshold
    }
    // get cameraIds
    if(!localStorage.checkedCameras){
      let cameras = []
      axios.get('/camera')
        .then((response) => {
          for(let i=0;i<response.data.data.length;i++){
            cameras.push(JSON.stringify(response.data.data[i]))
          }
          localStorage.checkedCameras = JSON.stringify(cameras)
          this.queryList()
        })
    }else{
      this.queryList()
    }
  },
  filters: {
    date: function (value) {
      var d = new Date(value);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      month  =  month < 10 ? '0' + month : '' + month;
      var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
      var hour = d.getHours() <10 ? '0' + d.getHours() : '' + d.getHours();
      var minutes = d.getMinutes() <10 ? '0' + d.getMinutes() : '' + d.getMinutes();
      return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes;
    }
  }
}
</script>

<style lang="scss" scoped>
  .inner_wrap{
    width: 100%;
    position: absolute;
    /*background-color: #fff;*/
    top:0;
    bottom:9px;
    color: #757575;
    /*border: 1px solid red;*/
    .top{
      position: fixed;
      right: 20px;
      bottom: 100px;
    }
    .filter_bar{
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #b8b8b8;
      border-bottom: 1px solid #b8b8b8;
      background-color: white;
      .input_wrap{
        width: 50%;
        text-align: center;
        position: relative;
        img{
          position: absolute;
          width: 16px;
          top:7px;
          right:12px;
        }
        .title{
          font-size: 12px;
          color: #b8b8b8;
          text-align: left;
          padding-left: 10px;
        }
        input{
          width: 85%;
          outline: none;
          border: 1px solid #b8b8b8;
          border-radius: 5px;
          font-size: 12px;
          padding:5px;
          color: #b8b8b8;
          margin: 3px 0;
        }
        input::-webkit-input-placeholder {
          color: #b8b8b8;
          font-size: 12px;
        }
      }
    }
    .item_wrap{
      height: calc(100% - 26px);
      /*border:1px solid red;*/
      box-sizing: border-box;
      overflow-y: scroll;
      padding: 0 2%;
      li{
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        margin-top: 2.5%;
        .pic{
          width: 20%;
          float: left;
          dt{
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            overflow: hidden;
            position: relative;
            border-radius: 4px;
            img{
              width: 100%;
              top: 50%;
              transform: translateY(-50%);
              position: absolute;
              border-radius: 4px;
            }
          }
          dd{
            font-size: 12px;
            text-align: center;
            margin-top: 6px;
          }
        }
        .score{
          float: left;
          color: #4a87e3;
          margin-top: 7%;
          margin-left: 10px;
          span{
            font-size: 20px;
          }
        }
        .info_wrap{
          width: 40%;
          float: right;
          margin-top: 10px;
          margin-right: 10px;
          font-size: 12px;
          p{
            text-align: center;
             word-wrap: break-word; 
          }
          .addr{
            margin-top: 15%;
            color: #7b7b7b;
          }
        }
      }
      li.no_more{
        background-color: #e4e9ef;
        text-align: center;
        color: #aaa;
        font-size: 12px;
        border: none;
        padding: 5px;
      }
      li.loading{
        background-color: #e4e9ef;
        color: #aaa;
        font-size: 12px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        .word{
          margin-left: 10px;
        }
      }
    }
  }
</style>