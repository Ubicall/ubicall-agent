AGENT.comms = (function () {

    var errornotification = null;
    var clearErrorTimer = null;

    var subscriptions = {};
    var ws;

    function connectWS() {
        var path = location.hostname + ":" + location.port + document.location.pathname;
        path = path + (path.slice(-1) == "/" ? "" : "/") + "comms";
        path = "ws" + (document.location.protocol == "https:" ? "s" : "") + "://" + path;

        function completeConnection() {
            for (var t in subscriptions) {
                if (subscriptions.hasOwnProperty(t)) {
                    ws.send(JSON.stringify({subscribe: t}));
                }
            }
        }

        ws = new WebSocket(path);
        ws.onopen = function () {
            if (errornotification) {
                clearErrorTimer = setTimeout(function () {
                    errornotification.close();
                    errornotification = null;
                }, 1000);
            }
            completeConnection();
        }
        ws.onmessage = function (event) {
            var msg = JSON.parse(event.data);
            if (msg.topic) {
                for (var t in subscriptions) {
                    if (subscriptions.hasOwnProperty(t)) {
                        var re = new RegExp("^" + t.replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g, "\\$1").replace(/\+/g, "[^/]+").replace(/\/#$/, "(\/.*)?") + "$");
                        if (re.test(msg.topic)) {
                            var subscribers = subscriptions[t];
                            if (subscribers) {
                                for (var i = 0; i < subscribers.length; i++) {
                                    subscribers[i](msg.topic, msg.data);
                                }
                            }
                        }
                    }
                }
            }
        };
        ws.onclose = function () {
            if (errornotification == null) {
                errornotification = AGENT.notify("<b>Error</b>: Lost connection to server", "error", true);
            } else if (clearErrorTimer) {
                clearTimeout(clearErrorTimer);
                clearErrorTimer = null;
            }
            setTimeout(connectWS, 1000);
        }
    }

    function subscribe(topic, callback) {
        if (subscriptions[topic] == null) {
            subscriptions[topic] = [];
        }
        subscriptions[topic].push(callback);
        if (ws && ws.readyState == 1) {
            ws.send(JSON.stringify({subscribe: topic}));
        }
    }

    function unsubscribe(topic, callback) {
        if (subscriptions[topic]) {
            for (var i = 0; i < subscriptions[topic].length; i++) {
                if (subscriptions[topic][i] === callback) {
                    subscriptions[topic].splice(i, 1);
                    break;
                }
            }
            if (subscriptions[topic].length === 0) {
                delete subscriptions[topic];
            }
        }
    }

    return {
        connect: connectWS,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    }
})();
