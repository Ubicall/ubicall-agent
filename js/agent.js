var AGENT = (function () {
    function loadPeers() {
        $.ajax({
            headers: {
                "Accept": "application/json"
            },
            cache: false,
            url: 'peers',
            success: function (nodes) {
                AGENT.comms.subscribe("PeerStatus", function (topic, msg) {
                    alert("message");
                });
            }
        });
    }


    $(function () {

        if ((window.location.hostname !== "localhost") && (window.location.hostname !== "127.0.0.1")) {
            document.title = window.location.hostname + ": IVR Designer";
        }

        ace.require("ace/ext/language_tools");

        RED.settings.init(loadEditor);
    });


    return {};
})();
