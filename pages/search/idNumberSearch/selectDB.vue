<template>
  <div class="second_wrap">
    <div class="inner_wrap">
      <div class="tip">
        <p>选择要注册到哪个人像库</p>
      </div>
      <div class="content_wrap">
        <el-radio-group v-model="selectedDB" @change="handleRadio">
          <el-radio v-for="(gallery, index) in galleries" :label="gallery" :key="index">{{ JSON.parse(gallery).name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      selectedDB: null,
      galleries: []
    }
  }, 
  name: 'selectDB',
  methods: {
    handleRadio (val) {
      console.log(val)
      this.$router.push({
        path: '/search/addToGallery',
        query: { data: val }
      })
    }
  },
  created () {
    if(localStorage.galleries){
      this.galleries = JSON.parse(localStorage.galleries)
    }else{
      axios.get('/facedb/black')
        .then((response) => {
          for(let i=0;i<response.data.data.length;i++){
            this.galleries.push(JSON.stringify(response.data.data[i]))
          }
          localStorage.galleries = JSON.stringify(this.galleries)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .second_wrap{
    width: 100%;
    top:0;
    bottom:0;
    background-color: #e4e9ef;
    position: absolute;
    .inner_wrap{
      width: 96%;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      top:8px;
      bottom: 7px;
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
        }
      }
      .content_wrap{
        width: 100%;
        position: absolute;
        top: 37px;
        bottom: 0px;
        overflow-y: scroll;
        box-sizing: border-box;
      }
    }
  }
</style>