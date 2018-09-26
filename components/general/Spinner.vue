<template>
  <div class="mint-spinner-snake">
  </div>
</template>

<script>

export default {
  name: 'Spinner',
  components: {
  }
}
</script>

<style lang="scss" scoped>
  .mint-spinner-snake {
    -webkit-animation: mint-spinner-rotate .8s infinite linear;
    animation: mint-spinner-rotate .8s infinite linear;
    border: 3px solid transparent;
    border-radius: 50%;
    margin:0 auto;
    border-top-color: #4a87e3; 
    border-left-color: #4a87e3; 
    border-bottom-color: #4a87e3; 
    height: 20px; 
    width: 20px;
    position: absolute;
    left: calc(50% - 10px);
    top:10%;
  }
  @keyframes mint-spinner-rotate{
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
    }
  }
</style>