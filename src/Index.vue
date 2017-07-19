<template>
  <div>

    <div class="add-device">
      <img class="add-device-img" src="./assets/add.png" @click="addDevice"/>
    </div>

    <div class="weui-cells">
      <a class="weui-cell weui-cell_access" v-for="device in deviceList" @click="deviceDetail(device)">
      <!--
        <div class="weui-cell__hd"><img src="./assets/device-logo.png"></div>-->
        <div class="weui-cell__bd"><p>嘉憬调奶器</p></div>
        <div class="weui-cell__ft">{{device.online ? '在线' : '离线'}}</div>
      </a>
    </div>
<!--
    <template v-if="!deviceList.length">
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" @click="deviceDetail()">
          <div class="weui-cell__hd"><img src="./assets/device-logo.png"></div>
          <div class="weui-cell__bd"><p>虚拟设备</p></div>
          <div class="weui-cell__ft">离线</div>
        </a>
      </div>
    </template>
-->
  </div>
</template>

<script>
  import Weixin from './weixin';
  import {Toast} from 'mint-ui';
  export default{

    data: function () {
      return {
        deviceList: [],
      }
    },


    created: function () {
      if (window.devices) {
        this.devicesReady(window.devices);
      } else {
        window.devicesReady = this.devicesReady;
      }
    },

    methods: {
      devicesReady: function (devices) {

        console.log('index device ready');
        console.log(devices[0]);
        //this.deviceList=devices;
        var self = this;
        devices.forEach(function (device) {
          self.deviceList.push(device)
        })
        console.log(devices[0])
      },
      addDevice: function () {
        Toast('add device')

        window.wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          }
        });
      },
      deviceDetail: function (device) {

        console.log('deviceDetail');
        if (device) {
          window.router.push("/main/" + device.id)
        } else {
          window.router.push("/main/0")
        }

      }
    }

  }

</script>

<style scoped>
  @import '../static/css/weui.css';

  .add-device {
    text-align: center;
    padding: 30px;
  }

  .add-device-img {
    height: 40px;
    width: 40px;
    border: 2px solid #9999ff;
    box-shadow: 0 0 3px #eee;
    border-radius: 50px;
    background: #fff;
    padding: 15px;
  }

  .weui-cells {
    background: rgba(0, 0, 0, 0.1);
  }

  .weui-cell {
    background: rgba(0, 0, 0, 0.1);
  }

  .weui-cell img {
    width: 50px;
    border-radius: 50px;
    border: 1px solid #8888ff;
    margin-right: 10px;
    display: block
  }

  .weui-cell .weui-cell__bd p {
    color: #fff;
  }
</style>
