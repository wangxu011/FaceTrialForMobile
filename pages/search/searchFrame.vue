<template>
  <div style="width:100%;height:100%;" v-loading.fullscreen="fullScreen"
  element-loading-background="rgba(0, 0, 0, 0.6)"
  element-loading-text="人脸检测中. . .">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">人像比对</mt-tab-item>
      <mt-tab-item id="2">证件盘查</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <input type="file" accept="image/*" id="uploadPic" hidden @change="uploadPic($event)">
        <label for="uploadPic" class="symbol">
          <i class="iconfont icon-camera"></i>
        </label>
        <div class="img_wrap" v-if="targetPic">
          <img :src="targetPic" alt="">
          <p class="signal" @click="targetPic=null">×</p>
        </div>
        <p class="word">上传图片与人像库或告警记录进行比对</p>
        <p class="research" v-if="targetPic" @click="research()">重新查询</p>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <dl>
          <dt>
            <i class="iconfont icon-idcard"></i> 
          </dt>
          <dd>
            身份证查询
          </dd>
        </dl>
        <p class="item">
          <input type="text" placeholder="输入证件号与库中人员进行比对" v-model="idNum">
        </p>
        <p class="item" style="margin-top: 5%;">
          <button type="button" @click="searchPerson()">查询</button>
        </p>
      </mt-tab-container-item>
    </mt-tab-container>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Exif from 'exif-js'

export default {
  data () {
    return {
      selected: '1',
      idNum: null,
      fullScreen: false,
      targetPic: null,
      Orientation: null
    }
  },
  name: 'searchFrame',
  components: {
    
  },
  methods: {
    rotateImg (img, direction, canvas, ctx) {
      let height = img.height;    
      let width = img.width;
      switch (direction) {    
        case 8:
          canvas.width = height;    
          canvas.height = width;  
          ctx.rotate(-Math.PI / 2);  
          ctx.drawImage(img, 0, 0, -width, height);    
          break;    
        case 6:    
          canvas.width = height;    
          canvas.height = width;    
          ctx.rotate(Math.PI / 2);    
          ctx.drawImage(img, 0, 0, width, -height);    
          break;    
        case 3:
          canvas.width = width;    
          canvas.height = height;    
          ctx.rotate(Math.PI);    
          ctx.drawImage(img, 0, 0, -width, -height);    
          break;    
      }
    },
    convertToCanvas (img, orientation) {
      let canvas = document.createElement("canvas")
      let ctx = canvas.getContext('2d')
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      if(orientation && orientation != 1){
        switch(orientation){
          case 6://需要顺时针（向右）90度旋转
            this.rotateImg(img,6,canvas,ctx)
            break;
          case 8://需要逆时针（向左）90度旋转
            this.rotateImg(img,8,canvas,ctx)
            break;
          case 3://需要180度旋转
            this.rotateImg(img,3,canvas,ctx)
            break;
        }
      }else{
        ctx.drawImage(img, 0, 0, width, height)
      }
      return canvas.toDataURL('image/jpeg')
    },
    postImg (img) {
      axios.post('/tool/detectFace', {image: img})
      .then((response) => {
        this.fullScreen = false
        if(!response.data.data.result.length){
          this.showMsg('未检测到人脸', 'error')
          this.targetPic = null
        }else{
          localStorage.targetImage = response.data.data.result[0].face_image
          localStorage.targetFeature = response.data.data.result[0].feature
          this.targetPic = 'data:image/jpeg;base64,'+response.data.data.result[0].face_image
          this.$router.push({
            path: '/search/searchResult'
          })
        }
        // console.log(response)
      })
    },
    research () {
      this.$router.push({
        path: '/search/searchResult'
      })
    },
    uploadPic (e) {
      this.fullScreen = true
      const _this = this
      // fix the orientation of the picture token by phone
      Exif.getData(e.target.files[0], function(){
        _this.Orientation = Exif.getTag(this, 'Orientation')
        // alert(_this.Orientation)
      })
      let fileReader = new FileReader()
      fileReader.onload = function(ev){
        let img = new Image()
        img.src = ev.target.result
        img.onload = function(){
          _this.targetPic = _this.convertToCanvas(img, _this.Orientation)
          // alert( _this.targetPic)
          const finalResult = _this.targetPic.split(',')[1]
          _this.postImg(finalResult)
        }
      }
      fileReader.readAsDataURL(e.target.files[0])
      e.target.value = ''
    },
    searchPerson () {
      if(!this.idNum){
        this.$message({
          message: '身份证号码不能为空',
          type: 'warning',
          duration: 1500,
          center: true
        })
      }else{
        // 跳转到人员详情
        this.$router.push({
          path: '/search/personDetails',
          query: {
            idNum: this.idNum
          }
        })
      }
    }
  },
  created () {
    if(!localStorage.serverIP){
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mint-tab-container{
    width: 96%;
    position: absolute;
    box-sizing: border-box;
    top:48px;
    bottom: 8px;
    left: 2%;
    right: 2%;
    background-color: #fff;
    border-radius: 5px;
    .symbol{
      display: block;
      width: 180px;
      height: 180px;
      border: 1px solid #4a87e3;
      margin: 0 auto;
      border-radius: 50%;
      background-color: #edf3fc;
      margin-top: 120px;
      position: relative;
      i{
        position: absolute;
        font-size: 60px;
        color: #4a87e3;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .img_wrap{
      width: 180px;
      height: 180px;
      position: absolute;
      /*border:1px solid green;*/
      border-radius: 50%;
      top: 120px;
      left: 50%;
      transform: translateX(-50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .signal{
        width: 12px;
        height: 12px;
        position: absolute;
        border:1px solid white;
        border-radius: 50%;
        color:white;
        background-color: red;
        line-height: 11px;
        text-align: center;
        font-size: 12px;
        top: -2px;
        right: -3px;
      }
    }
    .word{
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
    }
    .research{
      width: 70%;
      margin: 20px auto;
      text-align: center;
      line-height: 2.5em;
      background-color: #4a87e3;
      color: white;
      border-radius: 5px;
      font-size: 13px;
    }
    dl{
      margin-top: 25%;
      dt{
        text-align: center;
        i{
          font-size: 80px;
          color: #4a87e3;
        }
      }
      dd{
        text-align: center;
      }
    }
    .item{
      width: 80%;
      margin: 0 auto;
      margin-top: 10%;
      input[type='text']{
        width: 100%;
        outline: none;
        border: 1px solid #4a87e3;
        border-radius: 5px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding: 5px;
        padding-left: 15px;
      }
      button{
        width: 100%;
        outline: none;
        border: none;
        background-color: #4a87e3;
        border-radius: 5px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        text-align: center;
        color: white;
      }
    }
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active{
    transform: translateX(500px);
    opacity: 0;
  }
</style>