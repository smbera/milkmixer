import XSDK from 'xlink-jssdk'
import Vue from 'vue'
import config from "./app-config"

var isDebug = true;
var openid = "oVTvT0shR6UT_jdihydtBdJg45rc";
var userid = "";
var authorize = "";

function getSearchCode() { // 获取url上的code参数
  var search = window.location.search
  var searchs = {}
  var strs = []
  if (search.indexOf('?') !== -1) {
    search = search.substr(1)
    strs = search.split('&')
    for (var i = 0; i < strs.length; i++) {
      searchs[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
    }
  }

  return searchs['code']
}

function getOpenId(code) {

  var url = config.getOpenIdUrl(code)

  console.log("getOpenId:" + url);

  Vue.http.get(url).then(function (res) {
    console.log(res.body);
    var user = res.body;
    openid = user.open_id;
    userid = user.user_id;
    getUserAuthorize(openid);
  }).catch(function (err) {
    console.log("getOpenId err");

    window.parent.location = config.getOauthUrl()

  })

}

function getUserAuthorize(openid) {

  var url = config.getUserAuthorizeUrl(openid)

  console.log("getUserAuthorize:" + url)

  Vue.http.get(url).then(function (res) {
    console.log("getUserAuthorize:")
    console.log(res.body);
    authorize = res.body.authorize;
    userid = res.body.user_id;
    getDevices(openid);
  }).catch(function (err) {
    console.log(err);
  })
}


function getDevices(openid) {

  var url = config.getDevicesUrl(openid)

  Vue.http.get(url).then(function (res) {
    console.log("getDevices:")
    console.log(res)
    var devices = [];
    res.body.devices.forEach(function (item) {

      devices.push({
        device_id: item.device_id,
        device_pid: item.device_pid,
        device_type: item.device_type,

        id: item.device_id,
        mac: item.device_mac,
        pid: item.device_pid,
      });
    });
    initSDK(devices);
  }).catch(function (err) {
    console.log(err)
  })
}

function addDeviceInfo(device) {


  device.online = false;
  device.data = {

    /*
     mode:0,     //表示设备工作模式，可APP设置可设备上报，0x00：关机，0x01：待机，0x02：开机
     setTemperature:0,     //表示设备温度设定，可APP设置可设备上报，0x00 ~0x8c：对应0到100
     currentTemperature:0,     //表示设备当前温度，只可设备上报，0x00 ~0x8c：对应0到100
     temperatureMode:0,      //表示设备恒温模式，可APP设置可设备上报，0x01：温调，0x02：热调，0x03：米糊，0x04：咖啡，0x05：泡茶，0x06：沸腾，0x07：除氯
     powerOn:0,      //表示设备定时开机控制，可APP设置可设备上报，0x00：取消定时开机，0x01：打开定时开机
     powerOnOnce:0,      //表示设备定时开机单次控制，可APP设置可设备上报，0x00：取消单次选择，0x01：打开单次选择
     powerOnCycle:0,     //表示设备定时开机循环控制，可APP设置可设备上报，0x00：取消循环选择，0x01：打开循环选择
     powerOnTime:0,      //表示设备定时开机时间，可APP设置可设备上报，0x00：取消定时；，0x01 ~0x5a0：对应1到1440分钟；，如设置5小时=300分钟=0x012C，则高字节为0x01，低字节11为0x2C。
     powerOff:0,     //表示设备定时关机控制，可APP设置可设备上报，0x00：取消定时关机，0x01：打开定时关机
     powerOffOnce:0,     //表示设备定时关机单次控制，可APP设置可设备上报，0x00：取消单次选择，0x01：打开单次选择
     powerOffCycle:0,      //表示设备定时关机循环控制，可APP设置可设备上报，0x00：取消循环选择，0x01：打开循环选择
     powerOffTime:0,     //表示设备定时关机时间，可APP设置可设备上报，0x00：取消定时；，0x01 ~0x5a0：对应1到1440分钟；，如设置5小时=300分钟=0x012C，则高字节为0x01，低字节11为0x2C。
     errCode:0,      //表示设备干烧故障报警提示，只可设备上报，0x01：干烧报警
     */
    //测试数据
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

  };
}

function initSDK(devices) {
  console.log('initSDK');


  var ws = new XSDK('websocket', { // xsdk微信应用接口的是基于socket.io实现的。

    host: 'http://cm.xlink.cn:23777',
    userid: userid + "",
    authorize: authorize,
    dp_version: 2,
  });

  ws.on('ready', function () {

    console.log('websocket ready');
    ws.emit('adddevices', devices);

  }).on('devicesready', function (xDevices) {
    console.log('devicesready');
    if (!xDevices || xDevices.length <= 0) {
      return;
    }

    for (var i = 0; i < devices.length; i++) {
      xDevices[i].id = devices[i].device_id;
      xDevices[i].userid = userid;
      xDevices[i].token = userid;
    }

    xDevices.forEach(function (device) {

      addDeviceInfo(device);

      device.on('statuschange', function (data) { // 0表示离线 1表示在线
        console.log('device on statuschange:' + data)
        device.online = data;
      }).on('data', function (data) {
        console.log('device on data')
        updateDeviceDataPoint(device, data)

      }).on("connect", function (data) {
        console.log("connect");
        device.online = true;
      });

      device.emit("connect")
      device.emit("probe", function (res) {
        if (res.status === 0) { // 获取成功
          updateDeviceDataPoint(device, res)
        } else if (res.status === 10) {
          console.log(res.msg) // 设备离线
        } else {
          console.log(res)
        }
      });

    })

    window.devices = xDevices;
    if (window.devicesReady) {
      window.devicesReady(window.devices);
    }
    console.log('window.devicesReady');
  })
}

function updateDeviceDataPoint(device, data) {

  if (data.type != "datapoint") {
    //return;
  }

  for (var i = 0; i < data.data.length; i++) {
    var datapoint = data.data[i];
    switch (datapoint.index) {
      case 0:
        device.data.mode = datapoint.value;
        break;
      case 1:
        device.data.setTemperature = datapoint.value;
        break;
      case 2:
        device.data.currentTemperature = datapoint.value;
        break;
      case 3:
        device.data.temperatureMode = datapoint.value;
        break;
      case 4:
        device.data.powerOn = datapoint.value;
        break;
      case 5:
        device.data.powerOnOnce = datapoint.value;
        break;
      case 6:
        device.data.powerOnCycle = datapoint.value;
        break;
      case 7:
        device.data.powerOnTime = datapoint.value;
        break;
      case 8:
        device.data.powerOff = datapoint.value;
        break;
      case 9:
        device.data.powerOffOnce = datapoint.value;
        break;
      case 10:
        device.data.powerOffCycle = datapoint.value;
        break;
      case 11:
        device.data.powerOffTime = datapoint.value;
        break;
      case 12:
        device.data.errCode = datapoint.value;
        break;

    }
  }
}

function init() {
  console.log('xLinkSDK init');

  if (isDebug) {
    getUserAuthorize(openid);
    return;
  }
  var code = getSearchCode();
  getOpenId(code);
}

export default init
