<template>
  <div class="inner_wrap">
    <transition name="fade">
      <spot-image v-if="imgFlag" @closePage="closePage" :img="targetImg"></spot-image>
    </transition>
    <img src="../../assets/images/top.png" alt="" class="top" v-if="topFlag" @click="toTop">
    <transition name="drop">
      <div v-show="spinnerFlag">
        <spinner style="top:calc(40px + 1%);z-index:2;"></spinner>
      </div>
    </transition>
    <div class="filter_bar">
      <p class="input_wrap" style="border-right:1px solid #b8b8b8;">
        <input type="text" placeholder="姓名筛选">
        <img src="../../assets/images/person.png" alt="">
      </p>
      <p class="input_wrap">
        <input type="text" placeholder="时间筛选" @click="datePickerFlag=true" readonly="readonly" v-model="dateRange">
        <img src="../../assets/images/calendar.png" alt="">
      </p>
    </div>
    <div class="item_container" ref="toTop" @scroll="handleScroll($event)">
      <mt-loadmore :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange">
        <ul v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" infinite-scroll-disabled="preventDulplicate">
          <li class="item_wrap clearfix" v-for="(item, index) in list" :key="index" @click="turnToDetails(item.id, item)">
            <div class="contrast_wrap">
              <dl>
                <dt>
                  <img :src="'http://' + item.serverIp + ':8000/image/' + item.scenePath" alt="" @click.stop="showImg($event)">
                </dt>
                <dd>现场图片</dd>
              </dl>
              <dl>
                <dt>
                  <img src="../../assets/images/default.png" alt="">
                </dt>
                <dd>陌生人</dd>
              </dl>
            </div>
            <div class="word_wrap">
              <p style="margin-top: 5px;">{{ item.createDate | date }}</p>
              <p style="margin-top: 30px;">{{ item.cameraName }}</p>
            </div>
            <img src="../../assets/images/signal.png" class="signal">
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
      <date-picker v-if="datePickerFlag" @notSaveDate="datePickerFlag=false" @saveDate="saveDate" :start="startTime" :end="endTime"></date-picker>
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
      start: null,
      end: null,
      startTime: null,
      endTime: null,
      dateRange: null,
      datePickerFlag: false,
      // new 
      topFlag: null,
      currentPage: null,
      loading: null,
      topStatus: null,
      roll: null,
      spinnerFlag: true,
      list: [],
      total: null,
      preventDulplicate: null
    }
  },
  components: {
    spotImage,
    Spinner,
    Snake,
    datePicker
  },
  name: 'allAlarms',
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
      this.preventDulplicate = true
      this.loading = true
      this.currentPage ++
      axios.post('/alarm/query', {
        types: '1,4',
        page: this.currentPage,
        startTime: this.start,
        endTime: this.end,
        sort: 'createDate,desc'
      })
      .then((response) => {
        console.log(response)
        this.list = this.list.concat(response.data.data.content)
        this.loading = false
        this.preventDulplicate = false
      })
    },
    loadTop () {
      this.queryList()
    },
    handleTopChange (status) {
      this.topStatus = status
      if(status == 'loading'){
        this.roll = true
      }
    },
    queryList () {
      axios.post('/alarm/query', {
        types: '1,4',
        sort: 'createDate,desc'
      })
      .then((response) => {
        console.log(response)
        this.total = response.data.data.totalElements
        this.list = response.data.data.content
        this.roll = false
        this.$refs.loadmore.onTopLoaded();
        this.spinnerFlag = false
        this.currentPage = 0
      })
      .catch((error) => {
        this.$router.push({
          path: '/'
        })
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
    turnToDetails (id) {
      this.$router.push({
        path: '/alarmList/alarmDetails',
        query: {
          personId: id
        }
      })
    },
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
      axios.post('/alarm/query', {
        types: '1,4',
        page: this.currentPage,
        startTime: this.start,
        endTime: this.end,
        sort: 'createDate,desc'
      })
      .then((response) => {
        this.total = response.data.data.totalElements
        this.list = response.data.data.content
        this.spinnerFlag = false
        this.toTop()
      })
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
  created () {
    this.queryList()
  },
  filters: {
    date: function(value){
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
  .drop-leave-active{
    transition: all 2s;
  }
  .drop-enter, .drop-leave-active{
    transform: translateY(-500px);
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active{
    transform: translateX(500px);
    opacity: 0;
  }
  .inner_wrap{
    width: 100%;
    top: 0px;
    bottom: 0px;
    position: absolute;
    /*background-color: red;*/
    .top{
      position: fixed;
      right: 20px;
      bottom: 100px;
      z-index: 10;
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
    .item_container{
      width: 97%;
      position: absolute;
      left: 1.5%;
      right: 1.5%;
      top: 34px;
      bottom: 0;
      /*border: 1px solid yellow;*/
      overflow-y: scroll;
      box-sizing: border-box;
      font-size: 12px;
      .item_wrap{
        background-color: white;
        border-radius: 5px;
        margin-top: 8px;
        padding:10px;
        position: relative;
        .contrast_wrap{
          width: 55%;
          display: flex;
          justify-content: space-between;
          float: left;
          /*border: 1px solid red;*/
          dl{
            width: 36%;
            /*border:1px solid red;*/
            dt{
              width: 80%;
              height: 0;
              padding-bottom: 80%;
              margin:0 auto;
              position: relative;
              overflow: hidden;
              border-radius: 3px;
              img{
                position: absolute;
                width: 100%;
                top:50%;
                transform: translateY(-50%);
                border-radius: 3px;
              }
            }
            dd{
              text-align: center;
              font-size: 12px;
              margin-top: 5px;
            }
          }
        }
        .word_wrap{
          width: 42%;
          float: left;
          margin-left: 3%;
        }
        .signal{
          position: absolute;
          top:0;
          right:0;
          width: 28px;
          border-radius: 0 5px 0 0;
        }
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
      li.no_more{
        background-color: #e4e9ef;
        text-align: center;
        color: #aaa;
        font-size: 12px;
        border: none;
        padding: 5px;
      }
    }
  }
</style>