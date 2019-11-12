// Endpoint class
function Endpoint(address) {
	var ClosedState = 0;
    var ConnectingState = 1;
    var ActiveState = 2;
    var reconnectTries = 0;
    
    console.log("connecting to " + address);
    var webSocket = null;
    var state = ClosedState;     
    
    var that = this;

    var incomingMessage = null;    

    open();
    
    function open() {
        if (webSocket != null) {
            webSocket.onopen = null;
            webSocket.onclose = null;
            webSocket.onmessage = null;
        }
        
        outgoingArray = [];

        webSocket = new window.WebSocket(address, ["WSNetMQ"]);
        webSocket.binaryType = "arraybuffer";
        state = ConnectingState;

        webSocket.onopen = onopen;
        webSocket.onclose = onclose;
        webSocket.onmessage = onmessage;

        reconnectTries++;
    }
    
    function onopen (e) {
        console.log("WebSocket opened to " + address);
        reconnectTries = 0;

        state = ActiveState;

        if (that.activated != null) {
            that.activated(that);        
        }               
    }

    function onclose(e) {
        console.log("WebSocket closed " + address);
        var stateBefore = state;
        state = ClosedState;

        if (stateBefore == ActiveState && that.deactivated != null) {
            that.deactivated(that);
        }
        
        if (reconnectTries > 10) {
            window.setTimeout(open, 2000);
        } else {
            open();
        }
    }

    function onmessage(ev) {
        if (ev.data instanceof Blob) {
            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function () {
                processFrame(this.result);
            };
            fileReader.readAsArrayBuffer(ev.data);
        } else if (ev.data instanceof ArrayBuffer) {
            processFrame(ev.data);
        }
        // Other message type are not supported and will just be dropped
    }

    function processFrame(frame) {
        var view = new Uint8Array(frame);
        var more = view[0];

        if (incomingMessage == null) {
            incomingMessage = new JSMQ.Message();
        }

        incomingMessage.addBuffer(view.subarray(1));

        // last message
        if (more == 0) {
            if (that.onMessage != null) {
                that.onMessage(that, incomingMessage);
            }

            incomingMessage = null;
        }
    }
    
    // activated event, when the socket is open
    this.activated = null;
    
    // deactivated event
    this.deactivated = null;

    this.onMessage = null;
    
    this.getIsActive = function() {
        return state == ActiveState;
    };    

    this.write = function (message) {
        var messageSize = message.getSize();
        
        for (var j = 0; j < messageSize; j++) {
            var frame = message.getBuffer(j);

            var data = new Uint8Array(frame.length + 1);
            data[0] = j == messageSize - 1 ? 0 : 1; // set the more byte

            data.set(frame, 1);

            webSocket.send(data);
        }        
    };    
}

// LoadBalancer

function LB() {
    var endpoints = [];    
    var current = 0;
    var isActive = false;
    
    this.writeActivated = null;

    var that = this;

    this.attach = function(endpoint) {
        endpoints.push(endpoint);        
		console.log('LB now has ' + endpoints.length + ' endpoints');

        if (!isActive) {
            isActive = true;

            if (that.writeActivated != null)
                that.writeActivated();
        }        
    };

    this.terminated = function(endpoint) {
        var index = endpoints.indexOf(endpoint);        

        if (current == endpoints.length - 1) {
            current = 0;
        }
        
        endpoints.splice(index, 1);
    };

    this.send = function (message) {        
        if (endpoints.length == 0) {
            isActive = false;
            return false;
        }

        endpoints[current].write(message);        
        current = (current + 1) % endpoints.length;
                
        return true;
    };

    this.getHasOut = function () {
        if (inprogress)
            return true;

        return endpoints.length > 0;
    };
}

// SocketBase Class

function SocketBase(xattachEndpoint, xendpointTerminated, xhasOut, xsend, xonMessage) {

    this.onMessage = null;
    this.sendReady = null;

    var endpoints = [];

    function onEndpointActivated(endpoint) {
        xattachEndpoint(endpoint);
    }

    function onEndpointDeactivated(endpoint) {        
        xendpointTerminated(endpoint);               
    }

    this.connect = function (address) {        
        var endpoint = new Endpoint(address);
        endpoint.activated = onEndpointActivated;
        endpoint.deactivated = onEndpointDeactivated;
        endpoint.onMessage = xonMessage;
        endpoints.push(endpoint);
		console.log('pushed new endPoint: ' + address);
    };

    this.disconnect = function(address) {
        // TODO: implement disconnect
    };
    
    this.send = function (message) {        
        return xsend(message);                
    };
   
    this.getHasOut = function() {
        return xhasOut();
    };
}

// JSMQ namespace
function JSMQ() {
}

JSMQ.useBase64 = true;

JSMQ.Dealer = function () {

    var lb = new LB();

    var that = new SocketBase(xattachEndpoint, xendpointTerminated, xhasOut, xsend, xonMessage);

    lb.writeActivated = function () {
        if (that.sendReady != null) {
            that.sendReady(that);
        }
    };

    function xattachEndpoint(endpoint) {
        lb.attach(endpoint);
    }

    function xendpointTerminated(endpoint) {
        lb.terminated(endpoint);
    }

    function xhasOut() {
        return lb.getHasOut();
    }

    function xsend(message) {
        return lb.send(message);
    }

    function xonMessage(endpoint, message) {
        if (that.onMessage != null) {
            that.onMessage(message);
        }
    }

    return that;
};

JSMQ.Subscriber = function () {

    var that = new SocketBase(xattachEndpoint, xendpointTerminated, xhasOut, xsend, xonMessage);;

    var subscriptions = [];
    var endpoints = [];

    var isActive = false;

    that.subscribe = function (subscription) {

        if (subscription instanceof Uint8Array) {
            // continue
        }
        else if (subscription instanceof ArrayBuffer) {
            subscription = new Uint8Array(subscription);
        } else {
            var sub = String(subscription);
            if (JSMQ.useBase64)
                sub = Base64.encode(sub);

            subscription = StringUtility.StringToUint8Array(sub);
        }

        // TODO: check if the subscription already exist
        subscriptions.push(subscription);

        var message = createSubscriptionMessage(subscription, true);

        for (var i = 0; i < endpoints.length; i++) {
            endpoints[i].write(message);
        }
    };

    that.unsubscribe = function (subscription) {
        if (subscription instanceof Uint8Array) {
            // continue
        }
        else if (subscription instanceof ArrayBuffer) {
            subscription = new Uint8Array(subscription);

        } else {
            var sub = String(subscription);
            if (JSMQ.useBase64)
                sub = Base64.encode(sub);

            subscription = StringUtility.StringToUint8Array(sub);
        }

        for (var j = 0; j < subscriptions.length; j++) {

            if (subscriptions[j].length == subscription.length) {
                var equal = true;

                for (var k = 0; k < subscriptions[j].length; k++) {
                    if (subscriptions[j][k] != subscription[k]) {
                        equal = false;
                        break;
                    }
                }

                if (equal) {
                    subscriptions.splice(j, 1);
                    break;
                }
            }
        }

        var message = createSubscriptionMessage(subscription, false);

        for (var i = 0; i < endpoints.length; i++) {
            endpoints[i].write(message);
        }
    };

    function createSubscriptionMessage(subscription, subscribe) {
        var frame = new Uint8Array(subscription.length + 1);
        frame[0] = subscribe ? 1 : 0;
        frame.set(subscription, 1);

        var message = new JSMQ.Message();
        message.addBuffer(frame);

        return message;
    };

    function xattachEndpoint(endpoint) {
        endpoints.push(endpoint);

        for (var i = 0; i < subscriptions.length; i++) {
            var message = createSubscriptionMessage(subscriptions[i], true);

            endpoint.write(message);
        }

        if (!isActive) {
            isActive = true;

            if (that.sendReady != null) {
                that.sendReady(that);
            }
        }
    }

    function xendpointTerminated(endpoint) {
        var index = endpoints.indexOf(endpoint);
        endpoints.splice(index, 1);
    }

    function xhasOut() {
        return false;
    }

    function xsend(message, more) {
        throw new "Send not supported on sub socket";
    }

    function xonMessage(endpoint, message) {
        if (that.onMessage != null) {
            that.onMessage(message);
        }
    }

    return that;
};

JSMQ.Message = function () {
    var frames = [];

    this.getSize = function () {
        return frames.length;
    };

    // add string at the begining of the message
    this.prependString = function (str) {
        str = String(str);
        if (JSM.useBase64)
            str = Base64.encode(str);

        // one more byte is saved for the more byte
        var buffer = new Uint8Array(str.length);

        StringUtility.StringToUint8Array(str, buffer);

        frames.splice(0, 0, buffer);
    };


    // add the string at the end of the message
    this.addString = function (str) {
        str = String(str);
        if (JSMQ.useBase64)
            str = Base64.encode(str);

        // one more byte is saved for the more byte
        var buffer = new Uint8Array(str.length);

        StringUtility.StringToUint8Array(str, buffer);
        frames.push(buffer);
    };

    // pop a string from the begining of the message
    this.popString = function () {
        var frame = this.popBuffer();

        if (JSMQ.useBase64)
            return Base64.decode(StringUtility.Uint8ArrayToString(frame));
        else
            return StringUtility.Uint8ArrayToString(frame);
    };

    this.popBuffer = function () {
        var frame = frames[0];
        frames.splice(0, 1);

        return frame;
    };

    // addd buffer at the end of the message
    this.addBuffer = function (buffer) {

        if (buffer instanceof ArrayBuffer) {
            frames.push(new Uint8Array(buffer));
        }
        else if (buffer instanceof Uint8Array) {
            frames.push(buffer);
        } else {
            throw new "unknown buffer type";
        }
    };

    // return Uint8Array at location i
    this.getBuffer = function (i) {
        return frames[i];
    };
};

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};

function StringUtility()
{ }

StringUtility.StringToUint8Array = function (str, buffer) {
    if (typeof buffer === 'undefined') {
        buffer = new Uint8Array(str.length);
    }

    for (var i = 0, strLen = str.length; i < strLen; i++) {
        var char = str.charCodeAt(i);

        if (char > 255) {
            // only ASCII are supported at the moment, we will put ? instead
            buffer[i] = "?".charCodeAt();
        } else {
            buffer[i] = char;
        }
    }

    return buffer;
};

StringUtility.Uint8ArrayToString = function (buffer) {
    return String.fromCharCode.apply(null, buffer);
};