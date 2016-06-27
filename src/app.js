/**
 * Garagebble v1.0.2
 *
 * Author: Alberto Roura
 * Website: https://albertoroura.com
 *
 * WhatchApp to open/close a garage door
 * with a Particle Photon, a hall sensor,
 * and a remote transmitter.
 */

var UI = require('ui'),
    ajax = require('ajax'),
    api = 'https://api.particle.io/v1/devices/',
    deviceId = 'DEVICE_ID',
    access_token = 'YOUR_TOKEN',
    url_base = api + deviceId,
    status,
    main_card = new UI.Card({
        title: 'Garage door'
    }),
    garagebble = {
        callFunction: function (functionName) {
            this.update('Sending...');
            ajax({
                url: url_base + '/' + functionName + '?access_token=' + access_token,
                data: {args: status == 'open' ? 'closed' : 'open'},
                method: 'POST',
                type: 'json'
            }, function (data) {
                status = data.return_value === 1 ? 'open' : 'closed';
                garagebble.update('Currently:', status);
            }, function () {
                garagebble.update('Error');
            });
        },
        getVariable: function (variable) {
            this.update('Fetching...');
            ajax({
                url: url_base + '/' + variable + '?access_token=' + access_token,
                method: 'GET',
                type: 'json'
            }, function (data) {
                status = data.result;
                garagebble.update('Currently:', status);
            }, function () {
                garagebble.update('Error');
            });
        },
        update: function (message, sub) {
            main_card.subtitle(message).body(sub);
        }
    };

/**
 * App starts here
 */

main_card.show();

garagebble.getVariable('status');

main_card.on('click', 'up', function () {
    garagebble.update('Hi Jenny, this button does nothing lol');
});
main_card.on('click', 'select', function () {
    garagebble.callFunction('door');
});
main_card.on('click', 'down', function () {
    garagebble.getVariable('status');
});