<template>
  <div class="innest_wrap">
    <div class="inner_wrap">
      <div class="tip">
        <p>选择要参与搜索的相机</p>
        <p>选中后每次搜索时都将默认搜索这些相机抓拍到的数据</p>
      </div>
      <div class="content_wrap">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCameras" @change="handleCheckedCamerasChange">
          <el-checkbox v-for="camera in cameras" :label="camera" :key="camera">{{ JSON.parse(camera).name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      checkAll: null,
      cameras: [],
      checkedCameras: []
    }
  },
  name: 'selectCamera',
  methods: {
    handleCheckAllChange(val) {
      this.checkedCameras = val ? this.cameras : [];
    },
    handleCheckedCamerasChange(value) {
      this.checkAll = value.length === this.cameras.length;
    },
    // query from localStorage
    queryFromLocalStorage () {
      if(!localStorage.checkedCameras){
        this.checkedCameras = this.cameras
      }else{
        this.checkedCameras = JSON.parse(localStorage.checkedCameras)
      }
      this.checkAll = this.checkedCameras.length==this.cameras.length ? true : false
    }
  },
  created () {
    if(localStorage.cameras){
      this.cameras = JSON.parse(localStorage.cameras)
      this.queryFromLocalStorage()
    }else{
      axios.get('/camera')
        .then((response) => {
          for(let i=0;i<response.data.data.length;i++){
            this.cameras.push(JSON.stringify(response.data.data[i]))
          }
          localStorage.cameras = JSON.stringify(this.cameras)
          this.queryFromLocalStorage()
        })
    }
  },
  destroyed () {
    localStorage.checkedCameras = JSON.stringify(this.checkedCameras)
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
        top: 61px;
        bottom: 0px;
        overflow-y: scroll;
        /*border: 1px solid red;*/
        box-sizing: border-box;
      }
    }
  }
  
</style>