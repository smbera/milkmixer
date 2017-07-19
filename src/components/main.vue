<template>
  <div>
    <img class="warn_bg" :src="device.data.errCode==1?onoff.warn_bg:'' ">
    <div class="status">
      <img src="../assets/status_bg.gif">
      <p class="tem">{{device.data.currentTemperature}}℃</p>
      <p class="target_tem">目标：{{device.data.setTemperature}}℃</p>
      <p class="work_status">工作中</p>
    </div>
    <div class="wrap">
      <div class="wrap-item" @click="togglewarm()">
        <img :src="device.data.temperatureMode==1?onoff.warm_on:onoff.warm_off">
        <p>温调</p>
      </div>
      <div class="wrap-item" @click="togglehot()">
        <img :src="device.data.temperatureMode==2?onoff.hot_on:onoff.hot_off">
        <p>热调</p>
      </div>
      <div class="wrap-item" @click="togglerice()">
        <img :src="device.data.temperatureMode==3?onoff.rice_on:onoff.rice_off">
        <p>米糊</p>
      </div>
      <div class="wrap-item wrap-item-noright" @click="togglecoffee()">
        <img :src="device.data.temperatureMode==4?onoff.coffee_on:onoff.coffee_off">
        <p>咖啡</p>
      </div>
    </div>
    <div class="wrap wrapNoTop">
      <div class="wrap-item" @click="toggletea()">
        <img :src="device.data.temperatureMode==5?onoff.tea_on:onoff.tea_off">
        <p>泡茶</p>
      </div>
      <div class="wrap-item" @click="toggleboil()">
        <img :src="device.data.temperatureMode==6?onoff.boil_on:onoff.boil_off">
        <p>沸腾</p>
      </div>
      <div class="wrap-item" @click="toggledechlorinate()">
        <img :src="device.data.temperatureMode==7?onoff.dechlorinate_on:onoff.dechlorinate_off">
        <p>除氯</p>
      </div>
      <div class="wrap-item wrap-item-noright" @click="toggletemset()" @click.stop="showPicker2">
        <img :src="temset?onoff.temset_on:onoff.temset_off">
        <p>温度设置</p>
      </div>
    </div>

    <div class="timing_off">
      <div class="off_type">
        <span>定时关机</span>
        <div class="btn">
          <label @click="toggletiming_off_single()">
            <span>单次</span>
            <img :src="device.data.powerOffOnce?onoff.timing_on:onoff.timing_off">
          </label>
          <label @click="toggletiming_off_cycle()">
            <span>循环</span>
            <img :src="device.data.powerOffCycle?onoff.timing_on:onoff.timing_off">
          </label>
        </div>
      </div>
      <div class="off_time">
        <span>关机时间</span>
        <label @click.stop="showPicker">{{timeShow}}<img src="../assets/arrow.jpg"/> </label>
      </div>
    </div>

    <div class="timing_off">
      <div class="off_type">
        <span>定时开机</span>
        <div class="btn">
          <label @click="toggletiming_on_single()">
            <span>单次</span>
            <img :src="device.data.powerOnOnce?onoff.timing_on:onoff.timing_off">
          </label>
          <label @click="toggletiming_on_cycle()">
            <span>循环</span>
            <img :src="device.data.powerOnCycle?onoff.timing_on:onoff.timing_off">
          </label>
        </div>
      </div>
      <div class="off_time">
        <span>开机时间</span>
        <label @click.stop="showPicker1">{{timeShow1}}<img src="../assets/arrow.jpg"/> </label>
      </div>
    </div>

    <div class="picker-bg" v-show="timePickerShow" @click.stop="hidePicker">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择关机时间</div>
        <mt-picker :slots="timeSlots" @change="onTimeValueChange"></mt-picker>
        <div class="picker-btn" @click="timePickerOk">确定</div>
      </div>
    </div>
    <div class="picker-bg" v-show="timePickerShow1" @click.stop="hidePicker1">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择开机时间</div>
        <mt-picker :slots="timeSlots" @change="onTimeValueChange1"></mt-picker>
        <div class="picker-btn" @click="timePickerOk1">确定</div>
      </div>
    </div>
    <div class="picker-bg" v-show="temPickerShow" @click.stop="hidePicker2">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择目标温度</div>
        <mt-picker :slots="temSlots" @change="onTemValueChange"></mt-picker>
        <div class="picker-btn" @click="temPickerOk">确定</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {Toast} from 'mint-ui';

  export default{
    data: function () {
      return {
        device: {
          id: 0,
          online: true,
          data: {
            mode: 2,     //表示设备工作模式，可APP设置可设备上报，0x00：关机，0x01：待机，0x02：开机
            setTemperature: 33,     //表示设备温度设定，可APP设置可设备上报，0x00 ~0x8c：对应0到100
            currentTemperature: 44,     //表示设备当前温度，只可设备上报，0x00 ~0x8c：对应0到100
            temperatureMode: 3,      //表示设备恒温模式，可APP设置可设备上报，0x01：温调，0x02：热调，0x03：米糊，0x04：咖啡，0x05：泡茶，0x06：沸腾，0x07：除氯
            powerOn: true,      //表示设备定时开机控制，可APP设置可设备上报，0x00：取消定时开机，0x01：打开定时开机
            powerOnOnce: true,      //表示设备定时开机单次控制，可APP设置可设备上报，0x00：取消单次选择，0x01：打开单次选择
            powerOnCycle: false,     //表示设备定时开机循环控制，可APP设置可设备上报，0x00：取消循环选择，0x01：打开循环选择
            powerOnTime: 300,      //表示设备定时开机时间，可APP设置可设备上报，0x00：取消定时；，0x01 ~0x5a0：对应1到1440分钟；，如设置5小时=300分钟=0x012C，则高字节为0x01，低字节11为0x2C。
            powerOff: false,     //表示设备定时关机控制，可APP设置可设备上报，0x00：取消定时关机，0x01：打开定时关机
            powerOffOnce: true,     //表示设备定时关机单次控制，可APP设置可设备上报，0x00：取消单次选择，0x01：打开单次选择
            powerOffCycle: false,      //表示设备定时关机循环控制，可APP设置可设备上报，0x00：取消循环选择，0x01：打开循环选择
            powerOffTime: 700,     //表示设备定时关机时间，可APP设置可设备上报，0x00：取消定时；，0x01 ~0x5a0：对应1到1440分钟；，如设置5小时=300分钟=0x012C，则高字节为0x01，低字节11为0x2C。
            errCode: 1,      //表示设备干烧故障报警提示，只可设备上报，0x01：干烧报警
          }
        },
        onoff: {
          warn_bg: require("../assets/warn_bg.png"),
          warm_on: require("../assets/warm_on.png"),
          warm_off: require("../assets/warm_off.png"),
          hot_on: require("../assets/hot_on.png"),
          hot_off: require("../assets/hot_off.png"),
          rice_on: require("../assets/rice_on.png"),
          rice_off: require("../assets/rice_off.png"),
          coffee_on: require("../assets/coffee_on.png"),
          coffee_off: require("../assets/coffee_off.png"),
          tea_on: require("../assets/tea_on.png"),
          tea_off: require("../assets/tea_off.png"),
          boil_on: require("../assets/boil_on.png"),
          boil_off: require("../assets/boil_off.png"),
          dechlorinate_on: require("../assets/dechlorinate_on.png"),
          dechlorinate_off: require("../assets/dechlorinate_off.png"),
          temset_on: require("../assets/temset_on.png"),
          temset_off: require("../assets/temset_off.png"),
          timing_off: require("../assets/timing_once.png"),
          timing_on: require("../assets/timing_circulation.png")
        },
//        warn: true,
//        target_tem: 41,
//        warm: false,
//        hot: false,
//        rice: false,
//        coffee: false,
//        tea: false,
//        boil: false,
//        dechlorinate: false,
        temset: false,
//        off_type_single: false,
//        off_type_cycle: false,
//        off_time: 100,
        timePickerShow: false,
        timePicker: "",
//        on_type_single: false,
//        on_type_cycle: false,
//        on_time: 200,
        timePickerShow1: false,
        timePicker1: "",
        temPickerShow: false,
        temPicker: ""
      }
    },
    computed: {
      timeSlots: function () {
        return [
          {
            flex: 1,
            values: this.createDataArray(0, 23, 1),
          }, {
            flex: 1,
            divider: true,
            content: '小时',
          }, {
            flex: 1,
            values: this.createDataArray(0, 59, 1),
          }, {
            flex: 1,
            divider: true,
            content: '分钟',
          }
        ];
      },
      temSlots: function () {
        return [
          {
            flex: 2,
            values: this.createDataArray(0, 100, 1),
          }, {
            flex: 1,
            divider: true,
            content: '摄氏度',
          }
        ];
      },
      timeShow: function () {
        var starttime = this.device.data.powerOffTime;
        var hShow = parseInt(starttime / 60) < 10 ? '0' + parseInt(starttime / 60) : parseInt(starttime / 60);
        var mShow = starttime % 60 < 10 ? '0' + starttime % 60 : starttime % 60;
        return hShow + ' : ' + mShow;
      },
      timeShow1: function () {
        var starttime = this.device.data.powerOnTime;
        var hShow = parseInt(starttime / 60) < 10 ? '0' + parseInt(starttime / 60) : parseInt(starttime / 60);
        var mShow = starttime % 60 < 10 ? '0' + starttime % 60 : starttime % 60;
        return hShow + ' : ' + mShow;
      }
    },
    created: function () {
      if (window.devices) {
        this.devicesReady(devices);
      } else {
        window.devicesReady = this.devicesReady;
      }

      //发送数据端点的方法
      this.setDataPoint(0, 2);
    },
    methods: {
      devicesReady: function (devices) {
        var vm = this;
        console.log('Main deviceReady');
        var deviceId = this.$route.params.deviceId;
//        console.log(deviceId);
        devices.forEach(function (item) {
          if (item.id == deviceId) {
            vm.device = item;
            //          console.log(item);
          }
        })
      },
      togglewarm: function () {
//        this.warm = !this.warm;
//        if (this.warm == true) {
//          this.hot = false;
//          this.rice = false;
//          this.coffee = false;
//          this.tea = false;
//          this.boil = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 1) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);
        } else {
//          this.device.data.temperatureMode=1;
          this.setDataPoint(3, 1);
        }

      },
      togglehot: function () {
//        this.hot = !this.hot;
//        if (this.hot == true) {
//          this.warm = false;
//          this.rice = false;
//          this.coffee = false;
//          this.tea = false;
//          this.boil = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 2) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=2;
          this.setDataPoint(3, 2);

        }

      },
      togglerice: function () {
//        this.rice = !this.rice;
//        if (this.rice == true) {
//          this.warm = false;
//          this.hot = false;
//          this.coffee = false;
//          this.tea = false;
//          this.boil = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 3) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=3;
          this.setDataPoint(3, 3);

        }
      },
      togglecoffee: function () {
//        this.coffee = !this.coffee;
//        if (this.coffee == true) {
//          this.warm = false;
//          this.hot = false;
//          this.rice = false;
//          this.tea = false;
//          this.boil = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 4) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=4;
          this.setDataPoint(3, 4);

        }
      },
      toggletea: function () {
//        this.tea = !this.tea;
//        if (this.tea == true) {
//          this.warm = false;
//          this.hot = false;
//          this.rice = false;
//          this.coffee = false;
//          this.boil = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 5) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=5;
          this.setDataPoint(3, 5);

        }
      },
      toggleboil: function () {
//        this.boil = !this.boil;
//        if (this.boil == true) {
//          this.warm = false;
//          this.hot = false;
//          this.rice = false;
//          this.coffee = false;
//          this.tea = false;
//          this.dechlorinate = false;
//        }
        if (this.device.data.temperatureMode == 6) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=6;
          this.setDataPoint(3, 6);

        }
      },
      toggledechlorinate: function () {
//        this.dechlorinate = !this.dechlorinate;
//        if (this.dechlorinate == true) {
//          this.warm = false;
//          this.hot = false;
//          this.rice = false;
//          this.coffee = false;
//          this.tea = false;
//          this.boil = false;
//        }
        if (this.device.data.temperatureMode == 7) {
//          this.device.data.temperatureMode=0;
          this.setDataPoint(3, 0);

        } else {
//          this.device.data.temperatureMode=7;
          this.setDataPoint(3, 7);

        }
      },
      toggletemset: function () {
        this.temset = !this.temset;
      },
      toggletiming_off_single: function () {
        if (this.device.data.powerOffCycle == true) {
//          this.device.data.powerOffCycle = false;
//          this.device.data.powerOffOnce = true;

          this.setDataPoint(10, 0);
          this.setDataPoint(9, 1);
        } else {
//          this.device.data.powerOffOnce = !this.device.data.powerOffOnce;
          let bool2num;
          if (!this.device.data.powerOffOnce == true) {
            bool2num = 1;
          } else {
            bool2num = 0;
          }
          this.setDataPoint(9, bool2num);
        }
      },
      toggletiming_off_cycle: function () {
        if (this.device.data.powerOffOnce == true) {
//          this.device.data.powerOffOnce = false;
//          this.device.data.powerOffCycle = true;

          this.setDataPoint(9, 0);
          this.setDataPoint(10, 1);
        } else {
//          this.device.data.powerOffCycle = !this.device.data.powerOffCycle;
          let bool2num;
          if (!this.device.data.powerOffCycle == true) {
            bool2num = 1;
          } else {
            bool2num = 0;
          }
          this.setDataPoint(10, bool2num);
        }
      },
      createDataArray: function (from, to, divider) {
        var dataArray = [];
        for (var i = from; i <= to; i += divider) {
          dataArray.push(i);
        }
        return dataArray;
      },
      onTimeValueChange(picker, values) {
        this.timePicker = picker;
      },
      showPicker: function () {
        this.timePickerShow = true;
      },
      hidePicker: function () {
        this.timePickerShow = false;
      },
      timePickerOk: function () {
        this.hidePicker();
        if (this.timePicker) {
          var h = this.timePicker.getValues()[0];
          var m = this.timePicker.getValues()[1];
          if (h == undefined) {
            h = 0;
          }
          this.setDataPoint(11, h * 60 + m);
//          this.off_time = h * 60 + m;
        }
      },
      toggletiming_on_single: function () {
        if (this.device.data.powerOnCycle == true) {
//          this.device.data.powerOnCycle = false;
//          this.device.data.powerOnOnce = true;
          this.setDataPoint(6, 0);
          this.setDataPoint(5, 1);
        } else {
//          this.device.data.powerOnOnce = !this.device.data.powerOnOnce;
          let bool2num;
          if (!this.device.data.powerOnOnce == true) {
            bool2num = 1;
          } else {
            bool2num = 0;
          }
          this.setDataPoint(5, bool2num);
        }
      },
      toggletiming_on_cycle: function () {
        if (this.device.data.powerOnOnce == true) {
//          this.device.data.powerOnOnce = false;
//          this.device.data.powerOnCycle = true;
          this.setDataPoint(5, 0);
          this.setDataPoint(6, 1);
        } else {
//          this.device.data.powerOnCycle = !this.device.data.powerOnCycle;
          let bool2num;
          if (!this.device.data.powerOnCycle == true) {
            bool2num = 1;
          } else {
            bool2num = 0;
          }
          this.setDataPoint(6, bool2num);
        }
      },
      onTimeValueChange1(picker, values) {
        this.timePicker1 = picker;
      },
      showPicker1: function () {
        this.timePickerShow1 = true;
      },
      hidePicker1: function () {
        this.timePickerShow1 = false;
      },
      timePickerOk1: function () {
        this.hidePicker1();
        if (this.timePicker1) {
          var h = this.timePicker1.getValues()[0];
          var m = this.timePicker1.getValues()[1];
          if (h == undefined) {
            h = 0;
          }
          this.setDataPoint(7, h * 60 + m);
//          this.on_time = h * 60 + m;
        }
      },
      onTemValueChange(picker, values) {
        this.temPicker = picker;
      },
      showPicker2: function () {
        this.temPickerShow = true;
      },
      hidePicker2: function () {
        this.temPickerShow = false;
      },
      temPickerOk: function () {
        this.hidePicker2();
        if (this.temPicker) {
          var t = this.temPicker.getValues()[0];
          if (t == undefined) {
            t = 0;
          }
//          this.target_tem = t;
          this.setDataPoint(1, t);
        }
      },

      //发送数据端点
      setDataPoint(index, value){

        console.log("setDataPoint  index=" + index + ",value=" + value)

        var that = this;
        if (this.device.id == 0) {
          return;
        }
        var datapoints = [];
        datapoints.push({
          index: index,
          value: value
        })

        this.device.emit("senddata", {
          type: "datapoint",
          data: datapoints
        }, function (res) {
          if (res.status === 0) {
            console.log('send success')

          } else if (res.status === 10) { // 离线
            console.log(res.msg)
            console.log('设备不在线');
            Toast('设备不在线');
          } else {
            console.log(res)
            console.log('操作失败');
            Toast('操作失败');
          }
        })

      },

    }
  }
</script>

<style scoped>
  .warn_bg {
    width: 13%;
    left: 10%;
    top: 10%;
    position: absolute;
  }

  .status {
    width: 100%;
    height: 100%;
    position: relative;
    margin-bottom: 20px;
  }

  .status img {
    width: 30%;
    height: 30%;
    margin-left: 35%;
    margin-top: 15%;
  }

  .status p {
    position: absolute;
    font-weight: bold;
  }

  .status .tem {
    top: 42%;
    left: 40%;
    right: 40%;
    text-align: center;
    color: #3881b8;
    font-size: 2.4rem;
  }

  .status .target_tem {
    top: 60%;
    left: 40%;
    right: 40%;
    text-align: center;
    color: #898989;
    font-size: 1.2rem;
  }

  .status .work_status {
    top: 68%;
    left: 40%;
    right: 40%;
    text-align: center;
    color: #3881b8;
    font-size: 1.2rem;
  }

  .wrap {
    display: flex;
    border: 2px solid #efefef;
  }

  .wrapNoTop {
    border-top: none;
  }

  .wrap .wrap-item {
    flex: 1;
    text-align: center;
    padding-top: 5px;
    border-right: 2px solid #efefef;
  }

  .wrap .wrap-item-noright {
    border-right: none;
  }

  .wrap .wrap-item img {
    width: 50px;
    height: 50px;
  }

  .timing_off {
    margin-bottom: 30px;
  }

  .timing_off .off_type, .off_time {
    position: relative;
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #efefef;
    line-height: 50px;
  }

  .timing_off .off_type img {
    height: 50px;
  }

  .timing_off .off_type span, .off_time span {
    margin-left: 20px;
  }

  .timing_off .off_time img {
    width: 15px;
    height: 15px;
    margin-left: 5px;
    margin-top: 16px;
    vertical-align: top;
  }

  .timing_off .off_type .btn {
    float: right;
    height: 50px;
  }

  .timing_off .off_type label {
    float: left;
    height: 50px;
    padding-right: 40px;
  }

  .timing_off .off_type label span {
    margin-left: 0px;
    vertical-align: top;
  }

  .timing_off .off_time label {
    position: absolute;
    right: 28px;
  }

  .picker-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    z-index: 88;
  }

  .picker-container {
    width: 80%;
    margin: 80px 10%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 5px;
    box-shadow: 0 0 5px #666;
  }

  .picker-title {
    text-align: center;
    padding: 15px;
    color: #111;
    border-bottom: 1px solid #ddd;
  }

  .picker-btn {
    padding: 15px;
    text-align: center;
    border-top: 1px solid #ddd;
    color: #9999ff;
  }
</style>
