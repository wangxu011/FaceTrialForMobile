exports.install = function (Vue, options) {
  Vue.prototype.showMsg = function (msg, type) {
    if(!type){
      type = 'warning'
    }
    this.$message({
      message: msg,
      type: type,
      duration: 1500,
      center: true
    })
  }
}