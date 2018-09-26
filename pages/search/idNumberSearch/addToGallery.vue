<template>
  <div class="first_wrap" v-loading.fullscreen="fullScreen"
  element-loading-background="rgba(0, 0, 0, 0.6)"
  element-loading-text="人脸检测中. . .">
    <div class="top_wrap">
      <input type="file" id="selectPic" @change="uploadPic($event)" hidden>
      <label for="selectPic" class="label"></label>
      <div class="img_wrap" v-if="target">
        <img :src="target" alt="">
        <p class="signal" @click="removeTarget()">×</p>
      </div>
      <p class="add_to_g" @click="addToGallery()">添加到库</p>
    </div>
    <div class="bottom_wrap">
      <ul class="category">
        <li>
          <span class="key">姓&ensp;&ensp;&ensp;&ensp;名</span>
          <span class="value">
            <input type="text" placeholder="输入人员的姓名" v-model="name">
          </span>
        </li>
        <li>
          <span class="key">证&ensp;件&ensp;号</span>
          <span class="value">
            <input type="text" placeholder="输入人员的身份证号" v-model="idNum">
          </span>
        </li>
        <li @click="turnToGallery()">
          <span class="key">人&ensp;脸&ensp;库</span>
          <span class="value">
            <input type="text" placeholder="选择要注册到哪个人脸库" readonly v-model="facedb">
            <i class="iconfont icon-left"></i>
          </span>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  data () {
    return {
      name: null,
      idNum: null,
      facedb: null,
      facedbID: null,
      target: null,
      faceImage: null,
      feature: null,
      gender: null,
      fullScreen: false
    }
  },
  name: 'addToGallery',
  components: {
  },
  created () {
    if(this.$route.query.idNum){
      this.idNum = this.$route.query.idNum
    }
    if(this.$route.query.target){
      const result = this.$route.query.target
      this.target = 'data:image/jpeg;base64,' + result
      this.fullScreen = true
      axios.post('/tool/detectFace', {image: result})
      .then((response) => {
        this.fullScreen = false
        if(!response.data.data.result.length){
          this.showMsg('未检测到人脸', 'error')
        }else{
          this.gender = response.data.data.result[0].gender
          this.faceImage = response.data.data.result[0].face_image
          this.feature = response.data.data.result[0].feature
        }
        console.log(response)
      })
    }
  },
  methods: {
    turnToGallery () {
      this.$router.push({
        path: '/search/addToGallery/selectDB'
      })
    },
    addToGallery () {
      if(!this.target){
        this.showMsg('请选择头像')
        return
      }
      if(!this.name){
        this.showMsg('请输入姓名')
        return
      }
      if(!this.idNum){
        this.showMsg('请输入身份证号')
        return
      }
      if(!this.facedb){
        this.showMsg('请选择一个人像库')
        return
      }
      axios.post('/person', {
        name: this.name,
        idCard: this.idNum,
        gender: this.gender,
        dbId: this.facedbID, 
        features: this.feature,
        imageData: this.faceImage,
        validTo: "2099-01-31"
      })
        .then((response) => {
          console.log(response)
          this.showMsg(response.data.data.message, 'success')
        })
        .catch((error) => {
          this.showMsg('Forbidden', 'error')
        })
    },
    removeTarget () {
      this.target = null
    },
    uploadPic (e) {
      const _this = this
      let fileReader = new FileReader()
      fileReader.onload = function(ev){
        _this.fullScreen = true
        _this.target = ev.target.result
        const finalResult = ev.target.result.split(',')[1]
        axios.post('/tool/detectFace', {image: finalResult})
          .then((response) => {
            _this.fullScreen = false
            if(!response.data.data.result.length){
              _this.showMsg('未检测到人脸', 'error')
            }else{
              _this.target = 'data:image/jpeg;base64,'+response.data.data.result[0].face_image
              _this.gender = response.data.data.result[0].gender
              _this.faceImage = response.data.data.result[0].face_image
              _this.feature = response.data.data.result[0].feature
            }
            // console.log(response)
          })
      }
      fileReader.readAsDataURL(e.target.files[0])
      e.target.value = ''
    }
  },
  watch: {
    $route: function (val) {
      if(val.query.data){
        this.facedb = JSON.parse(val.query.data).name
        this.facedbID = JSON.parse(val.query.data).id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .first_wrap{
    width: 100%;
    position: absolute;
    top:0px;
    bottom:-40px;
    background-color: #e4e9ef;
    .top_wrap{
      width: 97%;
      margin: 8px auto;
      background-color: #fafafa;
      padding: 8px 0;
      border-radius: 5px;
      position: relative;
      .label{
        display: block;
        width: 120px;
        height: 130px;
        background-image: url("../../../assets/images/default.png");
        background-size: cover;
        background-position: center;
        /*border: 1px solid red;*/
        margin: 0 auto;
      }
      .img_wrap{
        width: 120px;
        height: 130px;
        position: absolute;
        /*border:1px solid green;*/
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        img{
          width: 100%;
          height: 100%;
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
      .add_to_g{
        width: 120px;
        margin: 0 auto;
        margin-top: 8px;
        color: #fff;
        background-color: #4a87e3;
        text-align: center;
        border-radius: 5px;
        font-size: 12px;
        line-height: 2em;
      }
    }
    .bottom_wrap{
      width: 97%;
      margin: 0 auto;
      height: calc(100% - 200px);
      background-color: #fafafa;
      border-radius: 5px;
      .category{
        font-size: 12px;
        li{
          padding-left: 30px;
          line-height: 40px;
          border-bottom: 1px solid #b8b8b8;
          .key{
            color: #999;
          }
          .value{
            margin-left: 30px;
            input{
              outline: none;
              border:none;
              font-size: 12px;
              background-color: #fafafa;
            }
            i{
              transform: rotate(-180deg);
              position: absolute;
              right: 20px;
              font-size: 14px;
            }
          }
        }
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