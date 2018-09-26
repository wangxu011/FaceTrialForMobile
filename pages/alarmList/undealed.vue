<template>
  <div class="inner_wrap" ref="toTop" @scroll="handleScroll($event)">
    <transition name="fade">
      <spot-image v-if="imgFlag" @closePage="closePage" :img="targetImg"></spot-image>
    </transition>
    <img src="../../assets/images/top.png" alt="" class="top" v-if="topFlag" @click="toTop">
    <transition name="drop">
      <div v-if="spinnerFlag">
        <spinner style="top:2%;"></spinner>
      </div>
    </transition>
    <mt-loadmore :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange">
      <ul v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" infinite-scroll-disabled="preventDulplicate">
        <li class="item_wrap" v-for="(item, index) in list" :key="index" @click="turnToDetails(item.id)">
          <p class="time">{{ item.createDate | date }}</p>
          <div class="pic_wrap">
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
          <p class="place">
            <img src="../../assets/images/camera.png" alt="">
            {{ item.cameraName }}
          </p>
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
</template>

<script>
import spotImage from '@/components/general/spotImage'
import Spinner from '@/components/general/Spinner'
import Snake from '@/components/general/Snake'
//WebSocket
import '@/webSocket/sockjs.js'
import '@/webSocket/stomp.min.js'

export default {
  data () {
    return {
      imgFlag: null,
      targetImg: null,
      topFlag: null,
      currentPage: null,
      loading: null,
      topStatus: null,
      roll: null,
      spinnerFlag: true,
      list: [],
      total: null,
      socket: null,
      stompClient: null,
      preventDulplicate: null
    }
  },
  created () {
    this.queryList()
  },
  mounted () {
    this.connect()
  },
  name: 'undealed',
  components: {
    spotImage,
    Spinner,
    Snake
  },
  methods: {
    closePage () {
      this.imgFlag = false
    },
    showImg (e) {
      this.imgFlag = true
      this.targetImg = e.target.src
    },
    //WebSocket-connect
    connect () {
      if(localStorage.serverIP){
        this.socket = new SockJS("http://"+ localStorage.serverIP +"/connect")
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, this.responseCallback, this.onFailed);
      }else{
        return
      }
    },
    // websoket连接失败
    onFailed (frame) {
      console.log('STOMP: Attempting connection');
      let RealTimeMessage = this;
      setTimeout(RealTimeMessage.connect, 3000);
      console.log('STOMP: 3秒后重连');
    },
    // websoket连接成功
    responseCallback (frame) {
      let _this = this;
      this.stompClient.subscribe("/topic/user/guest_admin/alarm", function(frame) {
        // console.log(JSON.parse(frame.body))
        let resultObj = {
          id: null,
          serverIp: null,
          scenePath: null,
          cameraName: null,
          createDate: null
        }
        const tempObj = JSON.parse(frame.body)
        resultObj.id = tempObj.id
        resultObj.cameraName = tempObj.cameraName
        resultObj.createDate = tempObj.timestamp
        resultObj.serverIp = tempObj.alarmServerIp
        resultObj.scenePath = tempObj.scenePath.split('e/')[1]
        console.log(resultObj)
        _this.list.unshift(resultObj)
      });
    },
    // WebSocket-disconnect
    disconnect () {
      if(this.stompClient != null){
        this.stompClient.disconnect()
      }
    },
    toTop () {
      this.$refs.toTop.scrollTop = 0
    },
    handleScroll (e) {
      if(e.target.scrollTop == 0){
        this.connect()
      }else{
        this.disconnect()
      }
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
        status: 0,
        page: this.currentPage,
        // sort: 'createDate,desc'
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
        status: 0,
        // sort: 'createDate,desc'
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
    turnToDetails (id) {
      this.$router.push({
        path: '/alarmList/alarmDetails',
        query: {
          personId: id
        }
      })
    }
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
      var seconds = d.getSeconds() <10 ? '0' + d.getSeconds() : '' + d.getSeconds();
      return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }
  },
  destroyed () {
    this.disconnect()
  }
}
</script>

<style lang="scss" scoped>
  .inner_wrap{
    width: 100%;
    position: absolute;
    top:0;
    bottom: 0;
    overflow-y: scroll;
    .top{
      position: fixed;
      right: 20px;
      bottom: 100px;
      z-index: 10;
    }
    .item_wrap{
      width: 97%;
      margin:0 auto;
      margin-top: 8px;
      .time{
        font-size: 12px;
        background-color: #d5e0ee;
        text-align: center;
        line-height: 2em;
      }
      .pic_wrap{
        background-color: white;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d0d0d0;
        padding: 10px 15px;
        dl{
          width: 35%;
          /*border:1px solid red;*/
          dt{
            width: 80%;
            /*height: 28.5vw;*/
            /*text-align: center;*/
            height: 0;
            padding-bottom: 80%;
            margin:0 auto;
            position: relative;
            overflow: hidden;
            img{
              position: absolute;
              width: 100%;
              top:50%;
              transform: translateY(-50%);
            }
          }
          dd{
            text-align: center;
            font-size: 12px;
            margin-top: 5px;
          }
        }
      }
      .place{
        display: flex;
        align-items: center;
        line-height: 2em;
        font-size: 12px;
        background-color: white;
        border-radius: 0 0 5px 5px;
        padding-left: 20px;
        img{
          width: 18px;
          margin-right: 10px;
        }
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
</style>