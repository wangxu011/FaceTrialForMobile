<template>
  <div class="innest_wrap">
    <div class="inner_wrap">
      <div class="tip">
        <p>选择要参与搜索的人像库</p>
        <p>选中后每次搜索时都将默认与做这些人像库进行匹配</p>
      </div>
      <div class="content_wrap">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedGalleries" @change="handleCheckedGalleriesChange">
          <el-checkbox v-for="(gallery, index) in galleries" :label="gallery" :key="index">{{ JSON.parse(gallery).name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/general/Pagination'

export default {
  data () {
    return {
      checkAll: null,
      galleries: [],
      checkedGalleries: []
    }
  },
  name: 'selectGallery',
  methods: {
    handleCheckAllChange(val) {
      this.checkedGalleries = val ? this.galleries : [];
    },
    handleCheckedGalleriesChange(value) {
      this.checkAll = value.length === this.galleries.length;
    },
    // query from localStorage
    queryFromLocalStorage () {
      if(!localStorage.checkedGalleries){
        this.checkedGalleries = this.galleries
      }else{
        this.checkedGalleries = JSON.parse(localStorage.checkedGalleries)
      }
      this.checkAll = this.checkedGalleries.length==this.galleries.length ? true : false
    }
  },
  created () {
    if(localStorage.galleries){
      this.galleries = JSON.parse(localStorage.galleries)
      this.queryFromLocalStorage()
    }else{
      axios.get('/facedb/black')
        .then((response) => {
          for(let i=0;i<response.data.data.length;i++){
            this.galleries.push(JSON.stringify(response.data.data[i]))
          }
          localStorage.galleries = JSON.stringify(this.galleries)
          this.queryFromLocalStorage()
        })
    }
  },
  destroyed () {
    localStorage.checkedGalleries = JSON.stringify(this.checkedGalleries)
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
        box-sizing: border-box;
      }
    }
  }
</style>