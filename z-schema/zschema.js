var schema = new require('./schema.json');
var ZSchema = require('z-schema');

var macRegexp = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");
ZSchema.registerFormat("MAC", function (str) {
  return macRegexp.test(str);
});

ZSchema.registerFormat("IP_OR_HOST", function (str) {
  return true;
});

var validator = new ZSchema();

var data = TechSupport = {
  customerId: "usa",
  type: "mytype",
  "socketId": "dfsddfsdfs",
  "data": {
    "mac": "C1:00:0C:00:00:73",
    "mode": "mode",
    "model": "model",
    "stream": "start",
    "eType": "hi"
  }
};

var data = {
  type: 'cns-ws.actions.troubleshoot',
  customerId: '9ee194ed794944839226e91eaa0aa057',
  socketId: 'CNS1448962683659NG:qT5n3ESEpKD9-fAsAAAB',
  data: {
    mac: '00:04:56:01:02:03',
    eType: 'Gambit',
    mode: 'wi-fi',
    model: '',
    command: '',
    arguments: {},
    duration: 0,
    stream: 'stop',
    extra: 111111
  }
};

data = {
  type: 'cns-ws.actions.troubleshoot',
  customerId: '9ee194ed794944839226e91eaa0aa057',
  socketId: 'CNS1448962683659NG:Q0p-6I-yiaM48RuzAAAB',
  data: {
    mac: '00:04:56:01:02:03',
    eType: 'Gambit',
    mode: 'wi-fi',
    model: '',
    command: 'tcpdump',
    arguments: {
      interface: 'eth0',
      count: 1
    },
    duration: 60,
    stream: 'start'
  }
};
data = {
  type: 'cns-ws.actions.troubleshoot',
  customerId: '9ee194ed794944839226e91eaa0aa057',
  socketId: 'CNS1448962683659NG:Q0p-6I-yiaM48RuzAAAB',
  data: {
    mac: '00:04:56:01:02:03',
    eType: 'C3VoIP',
    mode: 'wi-fi',
    model: '',
    command: 'tcpdump',
    arguments: {
      interface: 'eth0'
    },
    duration: 60,
    stream: 'start'
  }
};

var data = {
  type: 'cns-ws.actions.troubleshoot',
  customerId: '9ee194ed794944839226e91eaa0aa057',
  socketId: 'CNS1448962683659NG:CqBz6BsJdnsO9WQlAAAC',
  data: {
    mac: '00:04:56:01:02:03',
    eType: 'Gambit',
    mode: 'wi-fi',
    model: '',
    command: '',
    arguments: {
      host: 'google.com',
      dontFrag: false,
      showTtl: false,
      verbose: false,
      traceMethod: 'ICMP'
    },
    duration: 0,
    stream: 'stop'
  }
};
//var data = {
//  type: 'cns-ws.actions.latency',
//  customerId: '9ee194ed794944839226e91eaa0aa057',
//  socketId: 'CNS1448962683659NG:9cDeR_VgRnwuKmNcAAAB',
//  data: {
//    mac: '00:04:56:CD:F1:FA',
//    eType: 'ePMP',
//    mode: 'sm',
//    model: '1000',
//    stream: 'start',
//    destination: '192.168.11.2'
//  }
//};
//var data = {
//  deviceInfo: {
//    mac: 'C1:00:0C:00:00:73',
//    mode: 'wi-fi',
//    type: 'Falcon',
//    model: '',
//    activeSwVersion: '1.0.4',
//    inActiveSwVersion: 'Not Applicable',
//    hwVersion: '11',
//    serialNo: 'SN-C1:00:0C:00:00:73',
//    pMAC: 'C1:00:0B:00:00:24',
//    cid: 'IND',
//    refresh: 3
//  },
//  type: 'device.actions.refresh.offline'
//};

//var data = TroubleShoot= {
//  customerId: "usa",
//  type: "mytype",
//  city: "bangalore",
//  "data" : {
//    "mac": "a:b:c",
//    "type": "asdasd",
//    "stream" : "start",
//    "socketId": "dfsddfsdfs",
//    "command" : "ping",
//    "duration":12,
//    "arguments": ""
//  }
//};
// compile & validate schemas first, z-schema will automatically handle array
var allSchemasValid = validator.validateSchema(schema);
// allSchemasValid === true
var errors = validator.getLastErrors();
// now validate our data against the last schema

var valid = validator.validate(data, "Action:Web:TroubleShoot");
var errors = validator.getLastErrors();
console.log("IsValid=" + valid + " error=" + ((errors) ? errors[0].message : " Success.."));



