'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.comms
 * @description
 * # comms
 * subscribe to published events from server like
 *['queues:updated', 'calls:updated', 'call:wait:agent',
 * 'call:wait:client','call:complete', 'call:agent:problem', 'call:client:problem']
 * Service in the agentUiApp as socket connection between frontend and client and backend one
 */
angular.module('agentUiApp')
  .service('comms', function ($q, $location , $rootScope , Auth, AuthToken) {
    var subscriptions = {};
    var ws;
    var pendingAuth = true;

    // depend on angular will inject same instance of comms service
    // in all other component so connectWs is called first time it work

    // unable to create Interceptor like AuthInterceptor , to add Auth Header to ws request
    // and there is now way to do this as http://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api/4361358#4361358
    // so i will make auth request separately then on success this client is authenticated
    // otherwise what should i do ?logout , maybe
    (function connectWS() {
      var path = location.hostname + ":" + location.port + document.location.pathname;
      path = path + (path.slice(-1) == "/" ? "" : "/") + "comms";
      path = "ws" + (document.location.protocol == "https:" ? "s" : "") + "://" + path;
      Auth.isLoggedIn().then(function success() {
        function completeConnection() {
          for (var t in subscriptions) {
            if (subscriptions.hasOwnProperty(t)) {
              ws.send(JSON.stringify({subscribe: t}));
            }
          }
        }


        ws = new WebSocket(path);
        ws.onopen = function () {
          if (pendingAuth) {
            ws.send(JSON.stringify({auth: AuthToken.getToken(), method: "Bearer"}));
          } else {
            completeConnection();
          }
          $rootScope.$broadcast("system:connected",{message : "connected back to server"});
        };
        ws.onmessage = function (event) {
          var msg = JSON.parse(event.data);
          if (msg.auth == "fail") { // Re Authenticate
            pendingAuth = true;
            ws.send(JSON.stringify({auth: AuthToken.getToken(), method: "Bearer"}));
          } else if (pendingAuth && msg.auth == "ok") {
            pendingAuth = false;
            completeConnection();
          } else if (msg.topic) {
            for (var t in subscriptions) {
              if (subscriptions.hasOwnProperty(t) && t == msg.topic) {
                var subscribers = subscriptions[t];
                if (subscribers) {
                  for (var i = 0; i < subscribers.length; i++) {
                    subscribers[i](msg.topic, msg.data);
                  }
                }
              }
            }
          }
        };
        ws.onclose = function (event) {
          //TODO: check event code and reason , if has no privilege then forward to login
          //$rootScope.$broadcast("system:error:disconnected",{message : "Lost connection to server"});
          // should re Re-authenticate again
          pendingAuth = true;
          setTimeout(connectWS, 1000);
        };


      }, function error(err) { //user not logged in
          Auth.logout();
      });
    })();

    function _sendErrorHappen(err) {
      if (ws && ws.readyState == 1) {
        ws.send(JSON.stringify({
          info: {token: AuthToken.getToken(), date: new Date().now},
          error: err
        }));
      }
    }

    function _subscribe(topic, callback) {
      if (subscriptions[topic] == null) {
        subscriptions[topic] = [];
      }
      subscriptions[topic].push(callback);
      if (ws && ws.readyState == 1) {
        ws.send(JSON.stringify({subscribe: topic}));
      }
    }

    function subscribe(topic, callback) {
      if (!AuthToken.payload() || !AuthToken.payload().lic) {
        _sendErrorHappen({message: "payload or lic is missed"});
      } else {
        if (topic.constructor === Array) {
          for (var top in topic) {
            _subscribe(top, callback);
          }
        } else {
          _subscribe(topic, callback);
        }
      }
    }

    function _unsubscribe(topic, callback) {
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

    function unsubscribe(topic, callback) {
      if (!AuthToken.payload() || !AuthToken.payload().lic) {
        _sendErrorHappen({message: "payload or lic is missed"});
      } else {
        if (topic.constructor === Array) {
          for (var top in topic) {
            _unsubscribe(top, callback);
          }
        } else {
          _unsubscribe(topic, callback);
        }
      }
    }

    return {
      subscribe: subscribe,
      unsubscribe: unsubscribe
    }
  });
