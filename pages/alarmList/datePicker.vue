<template>
  <div class="datePicker_wrap">
    <div class="header">
      <i class="iconfont icon-left" @click="notSaveDate()"></i>
      选择时间
      <span class="confirm" @click="saveDate()">确定</span>
    </div>
    <div class="time_line">
      <p>起始时间 <span class="select_date">{{ startTime.time | date }}</span></p>
      <p>结束时间 <span class="select_date">{{ endTime.time | date }}</span></p>
    </div>
    <div class="date_wrap">
      <p class="year_month">{{ select.year }}年{{ select.month }}月</p>
      <table @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <thead>
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index1) in list" :key="index1">
            <td v-for="(day, index2) in week" @click="pickDay($event,day,index1,index2)" :key="index2" >
              <span :class="{selected:day.selected}" v-circle>{{ day.day }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  props: {
    today: {
      type: Number,
      default() {
        return new Date().getTime()
      }
    },
    start: {
      type: Object
    },
    end: {
      type: Object
    }
  },
  data () {
    return {
      startTime: {time:null,row:null,column:null},
      endTime: {time:null,row:null,column:null},
      selectedList: [],
      select: {
        year: '',
        month: ''
      },
      list: [],           //日历的二维数组集合
      currentMonthFirstDay: null, // 当前月的1号属于星期几
      currentMonthLastDate: null,  // 当前月的最后一天是几号
      startX: null,
      endX: null
    }
  },
  name: 'datePicker',
  created () {
    //处理上次选中的日期在日历中为选中状态
    if(this.start && this.end){
      let date1 = {
        year: new Date(this.start.time).getFullYear(),
        month: new Date(this.start.time).getMonth() + 1,
        day: new Date(this.start.time).getDate(),
        row: this.start.row,
        column: this.start.column
      }
      let date2 = {
        year: new Date(this.end.time).getFullYear(),
        month: new Date(this.end.time).getMonth() + 1,
        day: new Date(this.end.time).getDate(),
        row: this.end.row,
        column: this.end.column
      }
      this.selectedList.push(date1)
      this.selectedList.push(date2)
    }
    this.transform(this.today)
  },
  methods: {
    transform (time) {
      const date = new Date(time)
      this.select.year = date.getFullYear()
      this.select.month = date.getMonth() + 1

      this.currentMonthFirstDay = new Date(this.select.year, this.select.month-1, 1, 0).getDay()
      this.currentMonthLastDate = new Date(this.select.year, this.select.month, 0).getDate()
      this.getDateList()
    },
    getDateList () {
      this.list = []
      let list = []
      /*
      **获取日历的第一行数据
      */
      for (let i=0;i<7;i++) {
        if(i < this.currentMonthFirstDay){
          list.push('')
        }else{
          list.push({
            year: this.select.year,
            month: this.select.month,
            day: i-this.currentMonthFirstDay+1,
            selected: false
          })
        }
      }
      this.list.push(list)
      /*
      **获取日历的下面数据
      */
      //第一行有几天
      const daysInFirstRow = 7 - this.currentMonthFirstDay
      //第二行的第一天
      let firstDayInRow = daysInFirstRow + 1
      //除去第一行的剩余总天数
      const leftDays = this.currentMonthLastDate - daysInFirstRow
      //除去第一行的剩余总周数（也就是剩余有几行）
      const leftWeeks = Math.ceil(leftDays / 7)
      //最后一行的天数
      const lastRowDays = leftDays % 7
      for (let i=0;i<leftWeeks;i++) {
        if(i != leftWeeks - 1){
          this.list.push(this.getWeekList(firstDayInRow, firstDayInRow + 6))
        }else{
          if(lastRowDays == 0){
            this.list.push(this.getWeekList(firstDayInRow, firstDayInRow + 6))
          }else{
            let tempList = []
            for(let i=0;i<7;i++){
              if(i<lastRowDays){
                tempList.push({
                  year: this.select.year,
                  month: this.select.month,
                  day: firstDayInRow,
                  selected: false
                })
                firstDayInRow++
              }else{
                tempList.push('')
              }
            }
            this.list.push(tempList)
          }
        }
        firstDayInRow = firstDayInRow + 7
      }
    },
    getWeekList (start, end) {
      let list = []
      for(let i=start;i<=end;i++) {
        list.push({
          year: this.select.year,
          month: this.select.month,
          day: i,
          selected: false
        })
      }
      return list
    },
    pickDay (ev,day,index1,index2) {
      if(!ev.target.innerHTML){
        return
      }
      day.selected = !day.selected
      if(day.selected){
        this.selectedList.push({
          year: day.year,
          month: day.month,
          row: index1,
          column: index2,
          day: day.day
        }) 
      }else{
        this.selectedList.forEach((data,index) => {
          if(day.day == data.day && day.year == data.year && day.month == data.month){
            this.selectedList.splice(index,1)
          }
        })
      }
      // console.log(this.selectedList)
    },
    touchStart (ev) {
      // console.log(ev)
      this.startX = ev.changedTouches[0].clientX
    },
    touchMove (ev) {
      // console.log(ev)
    },
    touchEnd (ev) {
      this.endX = ev.changedTouches[0].clientX
      let value = this.endX-this.startX
      if(value < -20){
        this.transform(new Date(this.select.year, this.select.month, 1).getTime())
      }
      if(value > 20){
        this.transform(new Date(this.select.year, this.select.month-2, 1).getTime())
      }
    },
    notSaveDate () {
      this.$emit("notSaveDate","nothing")
    },
    saveDate () {
      if(this.selectedList.length!=2){
        Message({
          message: '请选择起始时间与结束时间',
          duration: 2000,
          type: 'warning'
        })
      }else{
        this.$emit("saveDate",{startTime: this.startTime,endTime: this.endTime})
      }
    }
  },
  directives: {
    circle: {
      inserted: function(el, binding){
        el.style.height = el.offsetWidth + 'px'
        el.style.lineHeight = el.offsetWidth + 'px'
      }
    }
  },
  watch: {
    selectedList: function(val){
      switch (val.length) {
        case 0:
          this.startTime = {time:null,row:null,column:null}
          this.endTime = {time:null,row:null,column:null}
          break;
        case 1:
          this.startTime = {time:new Date(val[0].year, val[0].month-1, val[0].day).getTime(),row:val[0].row,column:val[0].column}
          this.endTime = {time:null,row:null,column:null}
          break;
        case 2:
          const stamp1 = new Date(val[0].year, val[0].month-1, val[0].day).getTime()
          const stamp2 = new Date(val[1].year, val[1].month-1, val[1].day).getTime()
          if(stamp1 > stamp2){
            this.startTime = {time:stamp2,row: val[1].row, column: val[1].column}
            this.endTime = {time:stamp1,row: val[0].row, column: val[0].column}
          }else{
            this.endTime = {time:stamp2,row: val[1].row, column: val[1].column}
            this.startTime = {time:stamp1,row: val[0].row, column: val[0].column}
          }
          break;
        default: 
          if(this.list[val[0].row][val[0].column].selected){
            this.list[val[0].row][val[0].column].selected = false
          }
          val.shift()
      }
    },
    list: function(val){
      //在翻页之后选中的日期依旧为选中状态
      if(this.selectedList){
        for(let i=0;i<val.length;i++){
          for(let j=0;j<7;j++){
            for(let k=0;k<this.selectedList.length;k++){
              const dayStamp = new Date(val[i][j].year, val[i][j].month, val[i][j].day).getTime()
              const selectedStamp = new Date(this.selectedList[k].year, this.selectedList[k].month, this.selectedList[k].day).getTime()
              if(dayStamp == selectedStamp){
                val[i][j].selected = true
              }
            }
          }
        }
      }
    }
  },
  filters: {
    date: function(value){
      if(value){
        var d = new Date(value);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month  =  month < 10 ? '0' + month : '' + month;
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        return  year+ '-' + month + '-' + day;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.datePicker_wrap{
		width: 100%;
    top:-80px;
    bottom:-40px;
    background-color: #fafafa;
    position: absolute;
    z-index: 999;
    .header{
      width: 100%;
      height: 40px;
      background-color: #4a87e3;
      line-height: 40px;
      color: white;
      text-align: center;
      font-size: 14px;
      position: relative; 
      i{
        font-size: 20px;
        position: absolute;
        left:20px;
      }
      .confirm{
        position: absolute;
        right: 20px;
      }
    }
    .time_line{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #b8b8b8;
      p{
        width: 50%;
        font-size: 12px;
        line-height: 35px;
        padding-left: 5px; 
        color: #999;
        .select_date{
          font-size: 12px;
          color: #000;
          margin-left: 10px;
          font-weight: 600;
        }
      }
    }
    .date_wrap{
      background-color: #fff;
      .year_month{
        text-align: center;
        line-height: 2.5em;
        font-weight: 700;
      }
      table{
        width: 100%;
        font-size: 14px;
        thead{
          th{
            line-height: 3em;
          }
        }
        tbody{
          td{
            text-align: center;
            border-radius: 50%;
            vertical-align: top;
            span{
              width: 75%;
              display: inline-block;
              border-radius: 50%;
            }
          }
          .selected{
            background-color: #4a87e3;
            color: #fff;
          }
        }
      }
    }
	}
</style>