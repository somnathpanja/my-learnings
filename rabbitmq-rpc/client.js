var rpc = require('amqp-rpc').factory({
    conn_options: {url: "amqp://guest:guest@localhost:5672", heartbeat: 10}
});

rpc.call('withoutCB', {}, function (msg) {
    console.log('withoutCB results:', msg);  //output: please run function without cb parameter
});

rpc.call('withoutCB', {}); //output message on server side console

rpc.call('say.Hello', {name: 'John'}, function (msg) {
    console.log('results of say.Hello:', msg);  //output: Hello John!
});

rpc.on('shutdown', function(err){
    console.log('ccccc' + err);
});

var doRPCCall = function() {
    rpc.call('inc', 5, function (err) {
        if(err) console.log(err);

        console.log('results of inc:', arguments);  //output: [6,4,7]
    });

    setTimeout(doRPCCall, 2000);
};

doRPCCall();

