<template>
  <div class="inner_wrapper">
    <transition name="fade">
      <spot-image v-if="imgFlag" @closePage="closePage" :img="targetImg"></spot-image>
    </transition>
    <div class="content_wrap">
      <div class="img_wrap" v-if="person">
        <img :src="'http://' + person.serverIp + ':8000/image/' + person.facePath" alt="" @click="showImg($event)">
      </div>
      <ul class="category">
        <li>
          <img src="../../assets/images/facedb.png" alt="">
          <span class="key">人&ensp;脸&ensp;库</span>
          <span class="value"></span>
        </li>
        <li>
          <img src="../../assets/images/person.png" alt="">
          <span class="key">姓&ensp;&ensp;&ensp;&ensp;名</span>
          <span class="value">陌生人</span>
        </li>
        <li>
          <img src="../../assets/images/idcard.png" alt="">
          <span class="key">证&ensp;件&ensp;号</span>
          <span class="value"></span>
        </li>
        <li>
          <img src="../../assets/images/alarm_camera.png" alt="">
          <span class="key">抓拍相机</span>
          <span class="value">{{ person.cameraName }}</span>
        </li>
        <li>
          <img src="../../assets/images/calendar.png" alt="">
          <span class="key">抓拍时间</span>
          <span class="value">{{ person.createDate | date }}</span>
        </li>
        <li>
          <img src="../../assets/images/alarm_state.png" alt="">
          <span class="key">告警状态</span>
          <span class="value general" :class="[{'undeal': person.status=='未处理'},{'confirmed': person.status=='已确认'},{'misreport': person.status=='误报'}]">{{ person.status }}</span>
        </li>
        <li>
          <img src="../../assets/images/alarm_address.png" alt="">
          <span class="key">抓拍位置</span>
          <span class="value">{{ person.address }}</span>
        </li>
      </ul>
    </div>
    <div class="footer">
      <p class="confirmed" @click="confirmed">已确认</p>
      <p class="mis_report" @click="missReport">误报</p>
    </div>
  </div>
</template>

<script>
import spotImage from '@/components/general/spotImage'

export default {
  data () {
    return {
      imgFlag: null,
      targetImg: null,
      id: null,
      alarmId: null,
      person: {serverIp: '', facePath: ''}
    }
  },
  name: 'alarmDetails',
  components: {
    spotImage
  },
  methods: {
    closePage () {
      this.imgFlag = false
    },
    showImg (e) {
      this.imgFlag = true
      this.targetImg = e.target.src
    },
    dealFun (num) {
      axios.post('/alarm/dispose/' + this.id, {
        alarmId: this.id,
        status: num,
        reporter: 'guest_admin'
      })
      .then((response) => {
        this.showMsg(response.data.data.message, 'success')
      })
      .catch((err) => {
        this.showMsg('error', 'error')
      })
    },
    transformStatus (obj) {
      if(obj.status == 0){
        obj.status = '未处理'
      }else if(obj.status == 2){
        obj.status = '已确认'
      }else if(obj.status == 3){
        obj.status = '误报'
      }
    },
    confirmed () {
      this.dealFun(2)
    },
    missReport () {
      this.dealFun(3)
    }
  },
  created () {
    this.id = this.$route.query.personId
    axios.get('/alarm/' + this.id)
    .then((response) => {
      this.transformStatus(response.data.data)
      this.person = response.data.data
      console.log(response)
    })
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
      return  year+ '年' + month + '月' + day + '日 ' + hour + ':' + minutes;
    }
  }
}
</script>
 
<style lang="scss" scoped>
  .inner_wrapper{
    width: 100%;
    top:0px;
    bottom:0px;
    /*background-color: red;*/
    position: absolute;
    z-index: 999;
    .content_wrap{
      width: 100%;
      position: absolute;
      bottom: 40px;
      top:0;
      /*background-color: pink;*/
      overflow-y: scroll;
      .img_wrap{
        width: 100%;
        height: 0;
        padding-bottom: 90%;
        background-color: #4a87e3;
        position: relative;
        overflow: hidden;
        img{
          position: absolute;
          width: 100%;
          top:50%;
          transform: translateY(-50%);
        }
      }
      .category{
        font-size: 12px;
        background-color: #fafafa;
        li{
          display: flex;
          align-items: center;
          padding-left: 20px;
          height: 40px;
          border-bottom: 1px solid #b8b8b8;
          .key{
            color: #999;
          }
          .value{
            margin-left: 30px;
            color: #111;
          }
          .general{
            color:white;
            padding: 3px 10px;
            border-radius: 5px;
          }
          .undeal{
            background-color: #ff4444;
          }
          .confirmed{
            background-color: #4a87e3;
          }
          .misreport{
            background-color: #aaa;
          }
          img{
            width: 15px;
            margin-right: 10px;
          }
        }
      }
    }
    .footer{
      width: 100%;
      height: 40px;
      position: fixed;
      bottom: 0;
      p{
        width: 50%;
        float: left;
        line-height: 40px;
        font-size: 13px;
        text-align: center;
      }
      .confirmed{
        background-color: #4a87e3;
        color: white;
      }
      .mis_report{
        background-color: #e4e9ef;
        color: #585858;
      }
    }
  }
</style>