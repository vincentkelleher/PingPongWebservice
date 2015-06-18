var util = require('util');
var radio = require('nrf').connect('/dev/spidev0.0', 25, 22);
var EventEmitter = require('events').EventEmitter;

var GameListener = function() {
    var self = this;

    radio.channel(0x4c)
         .dataRate('1Mbps')
         .crcBytes(2)
         .autoRetransmit({count:15, delay:4000});

    var rx = radio.openPipe('rx', 0xF0F0F0F0E1),
        tx = radio.openPipe('tx', 0xF0F0F0F0D2);

    this.open = function() {
        radio.begin(function () {
            rx.on('readable', function(buffer) {
                var data = rx.read().toString();
                console.log("Received %s from the RX stream...", data);

                self.emit('RXData', data.split('').reverse().join(''));
            });
        });
    };

    this.close = function(callback) {
        console.log('Closing the radio streams...');

        radio.end(callback);
    };
};

util.inherits(GameListener, EventEmitter);

module.exports = GameListener;