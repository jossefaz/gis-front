export var  WSkubeMQ = (function() {
  var _this = null;
  var _props = null;
  var _url = null;
  var _channel = null;
  var _client_id = null;
  var _group = null;

  function WSkubeMQ(url, channel, client_id, group, props) {
    _this = this;
    _props = props;
    _url = url;
    _channel = channel;
    _client_id = client_id;
    _group = group;

    if (_props && _props.IsDebugEcho) {
      _this._ws = new WebSocket('ws://html5rocks.websocket.org/echo', ['soap', 'xmpp']);
    } else {
      _this._ws = new WebSocket('ws://' + _url + '/subscribe/events?client_id=' + _client_id + '&channel=' + _channel + '&group=' + _group + '&subscribe_type=events', 'echo-protocol');
    }

    _bindEvents(url, channel, client_id, group, props);

    return { 
      sendMessage: sendMessage,
      changeChannel: changeChannel
    };
  }

  // private functions
  function _bindEvents() {
    _this._ws.onmessage = _onmessage;
    _this._ws.onopen = _onopen;
    _this._ws.onclose = _onclose;
    _this._ws.onerror = _onerror;
  }

  function _onmessage(event) {
    console.log('Response from server: ' + event.data);
    if (_props && typeof _props.onMessage === 'function') {
      var result = null
      if (_props && _props.IsDebugEcho)
        result = { EventID :"Debug Echo",Channel:"Debug Echo",Body: event.data };
      else
        result = JSON.parse(event.data);

      if (typeof _props.decoder === 'function')
        result.Body  = _props.decoder.apply(this, [result.Body]);

      _props.onMessage(result);
    }
  }
  function _onopen (event) {
    console.log('Connection open on channel ' + _channel);
  }

  function _onclose (event) {
    console.log('Connection closed on channel ' + _channel);
  }

  function _onerror (event) {
    console.log('Connection error on channel ' + _channel);
    if (_props && typeof _props.onError === 'function') {
      _props.onError(event.type);
    }
  }

  // public function
  function sendMessage(message) {
    _this._ws.send(message);
    console.log('Message sent: ' + message);
  }

  // public function
  function changeChannel(newChannel) {
    _this._ws.close(); // TODO: check connection status before closing

    _channel = newChannel;

    if (_props && _props.IsDebugEcho) {
      _this._ws = new WebSocket('ws://html5rocks.websocket.org/echo', ['soap', 'xmpp']);
    } else {
      _this._ws = new WebSocket('ws://' + _url + '/subscribe/events?client_id=' + _client_id + '&channel=' + _channel + '&group=' + _group + '&subscribe_type=events', 'echo-protocol');
    }

    _bindEvents();

    if (_props && typeof _props.onChannelChanged === 'function') {
      _props.onChannelChanged.apply(this, [newChannel]);
    }
  }

  return WSkubeMQ;
})();


////////////////////////
// instantiation sample
////////////////////////

// var ws = new WSkubeMQ('172.17.22.215:9090', 'yoni', 'e1', '', {
//   IsDebugEcho: document.getElementById('debugEcho').checked,
//   decoder: Base64.decode,
//   onMessage: function(jsonMsg) {
//     document.getElementById('chatTA').value += 'Received: ' + JSON.Stringify(jsonMsg) + '\n';
//   },
//   onError: function(error) {
//     document.getElementById('chatTA').value += 'Channel error: ' + error + '\n';
//   },
//   onChannelChanged: function(newChannel) {
//     document.getElementById('chatTA').value += 'Channel changed to: ' + newChannel + '\n';
//   }
// });