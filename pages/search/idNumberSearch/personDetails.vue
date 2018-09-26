<template>
  <div class="first_wrap" v-loading.fullscreen="fullScreen"
  element-loading-background="rgba(0, 0, 0, 0.6)"
  element-loading-text="身份证信息搜索中">
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1" v-if="person">
        <div class="img_wrap">
          <img :src="'http://115.29.176.23:8080'+person.faceUrl" alt="">
        </div>
        <ul class="category">
          <li style="border-top: 1px solid #b8b8b8;">
            <span class="key">姓&ensp;&ensp;&ensp;&ensp;名</span>
            <span class="value">{{ person.name }}</span>
          </li>
          <li>
            <span class="key">证&ensp;件&ensp;号</span>
            <span class="value">{{ person.idCard }}</span>
          </li>
          <li>
            <span class="key">人&ensp;脸&ensp;库</span>
            <span class="value">{{ person.facedb.name }}</span>
          </li>
          <li>
            <span class="key">抓拍记录</span>
            <span class="value"><i>{{ capturedTime }}</i>条抓拍记录</span>
          </li>
        </ul>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" v-else>
        <dl>
          <dt>
            <i class="iconfont icon-idcard"></i>
          </dt>
          <dd>
            证件号有误或不在库中
          </dd>
        </dl>
        <p class="add_to_gallery" @click="addToGallery(idNum)">添加到库</p>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
// import Layout from './components/general/Layout'

export default {
  data () {
    return {
      ids: null,
      idNum: null,
      fullScreen: true,
      selected: null,
      person: null,
      capturedTime: null   //抓拍记录的次数
    }
  },
  name: 'personDetails',
  methods: {
    addToGallery (num) {
      this.$router.push({
        path: '/search/addToGallery',
        query: {
          idNum: num
        }
      })
    },
    getCapturedList (id) {
      axios.post('/alarm/query',{personId: id})
        .then((response) => {
          this.capturedTime = response.data.data.totalElements
        })
    },
    queryDetail () {
      let checkedGalleries = JSON.parse(localStorage.checkedGalleries)
      let tempID = []
      for(let j=0;j<checkedGalleries.length;j++){
        tempID.push(JSON.parse(checkedGalleries[j]).id)
      }
      this.ids = tempID.join(',')
      this.idNum = this.$route.query.idNum
      axios.post('/person/query',{dbIds:this.ids,idCard:this.idNum})
        .then((response) => {
          // console.log(response)
          this.fullScreen = false
          if(response.data.data.content.length){          //当搜索结果有人的时候，显示第一个人
            this.person = response.data.data.content[0]
            this.selected = '1'
            this.getCapturedList(this.person.id)
          }else{
            this.selected = '2'
          }
        })
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
          this.queryDetail()
        })
    }else{
      this.queryDetail()
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
    background-color: #fafafa;
    .img_wrap{
      width: 50%;
      height: 0;
      padding-bottom: 50%;
      margin: 10px auto;
      position: relative;
      overflow: hidden;
      img{
        position: absolute;
        width: 90%;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
      }
    }
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
          i{
            padding: 3px 7px;
            background-color: #4a87e3;
            color: #fff;
            border-radius: 3px;
            margin-right: 5px;
          }
        }
      }
    }
    dl{
      margin-top: 50%;
      dt{
        text-align: center;
        i{
          font-size: 70px;
          color: #999;
        }
      }
      dd{
        text-align: center;
        color: #b8b8b8;
        font-size: 14px;
      }
    }
    .add_to_gallery{
      width: 45%;
      margin: 7% auto;
      color: #fff;
      background-color: #4a87e3;
      text-align: center;
      border-radius: 5px;
      font-size: 14px;
      line-height: 2.5em;
    }
  }
</style>