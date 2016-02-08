(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Device = function() { }
$hxExpose(Device, "Device");
Device.__name__ = true;
Device.init = function() {
	if(typeof(Common) != "undefined") {
		Device.widgetAPI = new Common.API.Widget();
		Device.tvKey = new Common.API.TVKeyValue();
	} else Device.tvKey = { };
}
Device.ready = function() {
	try {
		Device.widgetAPI.sendReadyEvent();
	} catch( err ) {
		console.log("failed to invoke widgetAPI sendReadyEvent: " + Std.string(err));
	}
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var KeyboardConstants = function() { }
KeyboardConstants.__name__ = true;
var Main = function() {
	try {
		this.createChildren();
	} catch( err ) {
		console.log(err);
	}
};
$hxExpose(Main, "Main");
Main.__name__ = true;
Main.main = function() {
	Device.init();
	Device.ready();
	js.Browser.window.onload = function(_) {
		Main.start();
		console.log("in window load");
	};
}
Main.start = function() {
	Main.app = new Main();
}
Main.prototype = {
	createChildren: function() {
		var doc = js.Browser.document;
		this.videoPlayer = new components.VideoPlayerUI();
		doc.body.appendChild(this.videoPlayer.view);
		this.videoPlayer.loadLinks();
	}
	,__class__: Main
}
var IMap = function() { }
IMap.__name__ = true;
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
var components = {}
components.BaseComponent = function() {
	this.createView();
	this.createChildren();
};
components.BaseComponent.__name__ = true;
components.BaseComponent.prototype = {
	createChildren: function() {
	}
	,createView: function() {
		var doc = js.Browser.document;
		this.view = doc.createElement("div");
	}
	,__class__: components.BaseComponent
}
components.Header = function() {
	components.BaseComponent.call(this);
};
components.Header.__name__ = true;
components.Header.__super__ = components.BaseComponent;
components.Header.prototype = $extend(components.BaseComponent.prototype,{
	createView: function() {
		components.BaseComponent.prototype.createView.call(this);
		this.view.className = "header itemFont";
		this.view.innerHTML = "Select item";
	}
	,__class__: components.Header
});
components.Player = function() {
	this.duration = 0;
	this.currentTime = -1;
	this.state = -1;
	this.statusChanged = new msignal.Signal1();
	this.timeProgress = new msignal.Signal1();
	this.bitRateChange = new msignal.Signal1();
	this.videoResolutionChange = new msignal.Signal1();
	this.init();
};
components.Player.__name__ = true;
components.Player.prototype = {
	handlePauseKey: function() {
		var _g = this;
		switch(_g.state) {
		case components.Player.PLAYING:
			this.pauseVideo();
			break;
		case components.Player.PAUSED:
			this.resumeVideo();
			break;
		default:
			console.log("Ignoring pause key, not in correct state");
		}
	}
	,handlePlayKey: function() {
		var _g = this;
		switch(_g.state) {
		case components.Player.STOPPED:
			this.playVideo();
			break;
		case components.Player.PAUSED:
			this.resumeVideo();
			break;
		default:
			console.log("Ignoring play key, not in correct state");
		}
	}
	,handlePlayerKeyPress: function(keyCode) {
		switch(keyCode) {
		case 71:
			this.handlePlayKey();
			this.statusChanged.dispatch("Key play");
			break;
		case 70:
			this.stopVideo();
			this.statusChanged.dispatch("Key stop");
			break;
		case 74:
			this.handlePauseKey();
			this.statusChanged.dispatch("Key pause");
			break;
		case 72:
			this.plugin.JumpBackward(-30);
			this.statusChanged.dispatch("Key forward");
			break;
		case 69:
			this.plugin.JumpBackward(30);
			this.statusChanged.dispatch("Key rewind");
			break;
		}
	}
	,resumeVideo: function() {
		this.state = components.Player.PLAYING;
		this.plugin.Resume();
	}
	,stopVideo: function() {
		if(this.state != components.Player.STOPPED) {
			this.state = components.Player.STOPPED;
			this.plugin.Stop();
			this.checkTimer.stop();
		} else console.log("Ignoring the request, not in right state");
	}
	,pauseVideo: function() {
		this.state = components.Player.PAUSED;
		this.plugin.Pause();
	}
	,playVideo: function() {
		if(this.url == null) this.statusChanged.dispatch("No videos to play"); else {
			this.state = components.Player.PLAYING;
			this.plugin.Play(this.url);
		}
	}
	,setCurTime: function(time) {
		this.currentTime = time;
		try {
			this.timeProgress.dispatch("Playing at time: " + time + " / " + this.duration);
		} catch( error ) {
			console.log(error);
		}
	}
	,onStreamInfoReady: function() {
		this.duration = this.plugin.GetDuration();
		this.statusChanged.dispatch("Streaming");
		this.checkTimer = new haxe.Timer(1000);
		this.checkTimer.run = $bind(this,this.updateVideoInfo);
	}
	,updateVideoInfo: function() {
		var availableBitRates = "";
		var currentBitRates = "";
		try {
			availableBitRates = this.plugin.GetAvailableBitrates();
			currentBitRates = this.plugin.GetCurrentBitrates();
		} catch( error ) {
			console.log(error);
		}
		this.bitRateChange.dispatch("BitRate: " + currentBitRates + " / available: " + availableBitRates);
		var resolution = -1;
		try {
			resolution = this.plugin.GetVideoHeight();
		} catch( error ) {
			console.log(error);
		}
		this.videoResolutionChange.dispatch(resolution);
	}
	,onBufferingComplete: function() {
		this.statusChanged.dispatch("Playing");
	}
	,onBufferingProgress: function(percent) {
		this.statusChanged.dispatch("Bufferring " + percent + "% ");
	}
	,onRenderError: function() {
		this.statusChanged.dispatch("Video render error");
		this.stopVideo();
	}
	,onRenderComplete: function() {
		this.statusChanged.dispatch("Video is over");
	}
	,onNetworkDisconnected: function() {
		this.statusChanged.dispatch("Network is disconnected");
		this.stopVideo();
	}
	,onStreamNotFound: function() {
		this.statusChanged.dispatch("Stream not found");
		this.stopVideo();
	}
	,onAuthenticationFailed: function() {
		this.statusChanged.dispatch("Authentication failed");
		this.stopVideo();
	}
	,onConnectionFailed: function() {
		this.statusChanged.dispatch("Connection failed");
		this.stopVideo();
	}
	,init: function() {
		var _g = this;
		this.state = components.Player.STOPPED;
		this.plugin = js.Browser.document.getElementById("pluginPlayer");
		if(!this.plugin) return false;
		this.plugin.OnCurrentPlayTime = "Player.setCurTime";
		this.plugin.OnStreamInfoReady = "Player.onStreamInfoReady";
		this.plugin.OnBufferingStart = "Player.onBufferingStart";
		this.plugin.OnBufferingProgress = "Player.onBufferingProgress";
		this.plugin.OnBufferingComplete = "Player.onBufferingComplete";
		this.plugin.OnRenderError = "Player.onRenderError";
		this.plugin.OnRenderComplete = "Player.onRenderComplete";
		this.plugin.OnConnectionFailed = "Player.onConnectionFailed";
		this.plugin.OnAuthenticationFailed = "Player.onAuthenticationFailed";
		this.plugin.OnStreamNotFound = "Player.onStreamNotFound";
		this.plugin.OnNetworkDisconnected = "Player.onNetworkDisconnected";
		window.Player = this;
		js.Browser.window.onunload = function(_) {
			if(_g.plugin != null) _g.plugin.Stop();
		};
		return true;
	}
	,setData: function(item) {
		var r = new EReg("(.*?)\\.(mpd|mkv)$","i");
		if(r.match(item.url)) this.url = item.url + "|COMPONENT=HAS"; else this.url = item.url;
		console.log("URL received: " + this.url);
		this.statusChanged.dispatch("Press play");
		this.timeProgress.dispatch("");
		this.bitRateChange.dispatch("");
		this.videoResolutionChange.dispatch(-1);
		this.stopVideo();
	}
	,__class__: components.Player
}
components.VideoItemInfo = function() {
	components.BaseComponent.call(this);
};
components.VideoItemInfo.__name__ = true;
components.VideoItemInfo.__super__ = components.BaseComponent;
components.VideoItemInfo.prototype = $extend(components.BaseComponent.prototype,{
	setVideoResolution: function(resolution) {
		this.videoResolution.innerHTML = resolution > -1?"Resolution: " + resolution + "p":"";
	}
	,setBitRate: function(bitRateData) {
		this.bitRate.innerHTML = bitRateData;
	}
	,setTimeProgress: function(timeLapsed) {
		this.timeLapse.innerHTML = timeLapsed;
	}
	,setStatus: function(statusVal) {
		this.status.innerHTML = statusVal;
	}
	,setData: function(item) {
		this.name.innerHTML = item.url;
	}
	,createChildren: function() {
		components.BaseComponent.prototype.createChildren.call(this);
		this.videoResolution = js.Browser.document.createElement("div");
		this.videoResolution.className = "videoResolution itemFont";
		this.view.appendChild(this.videoResolution);
		this.bitRate = js.Browser.document.createElement("div");
		this.bitRate.className = "avaialbleBitRate itemFont";
		this.view.appendChild(this.bitRate);
		this.timeLapse = js.Browser.document.createElement("div");
		this.timeLapse.className = "timeLapse itemFont";
		this.view.appendChild(this.timeLapse);
		this.status = js.Browser.document.createElement("div");
		this.status.className = "status itemFont";
		this.view.appendChild(this.status);
		this.name = js.Browser.document.createElement("div");
		this.name.className = "name itemFont";
		this.view.appendChild(this.name);
	}
	,createView: function() {
		components.BaseComponent.prototype.createView.call(this);
	}
	,__class__: components.VideoItemInfo
});
components.VideoList = function() {
	this.visibleLines = 17;
	components.BaseComponent.call(this);
	this.selectedItemChanged = new msignal.Signal1();
	this.playerKeyPressed = new msignal.Signal1();
	this.model = new model.VideoListModel();
	this.addModelHandlers();
	this.set_scroll(0);
};
components.VideoList.__name__ = true;
components.VideoList.__super__ = components.BaseComponent;
components.VideoList.prototype = $extend(components.BaseComponent.prototype,{
	set_scroll: function(value) {
		if(this.videoListItems != null) {
			var top = this.videoListItems[value].offsetTop;
			this.view.scrollTop = top;
		}
		return this.scroll = value;
	}
	,set_feedUrl: function(value) {
		this.model.clear();
		this.model.loadLinks(value);
		return this.feedUrl = value;
	}
	,model_selectedIndexChanged: function(itemIndex) {
		if(this.videoListItems.length > 0 && itemIndex >= 0) {
			var item = this.videoListItems[itemIndex];
			if(itemIndex - this.scroll < 0) this.set_scroll(itemIndex); else if(itemIndex - this.scroll >= this.visibleLines) this.set_scroll(itemIndex - this.visibleLines);
			item.focus();
		}
	}
	,view_keyDownHandler: function(event) {
		console.log("key pressed: " + event.keyCode);
		switch(event.keyCode) {
		case 4:
			event.preventDefault();
			this.model.selectFirst();
			this.playerKeyPressed.dispatch(4);
			break;
		case 5:
			event.preventDefault();
			this.model.selectLast();
			this.playerKeyPressed.dispatch(5);
			break;
		case 29460:
			event.preventDefault();
			this.model.selectPrevious();
			this.playerKeyPressed.dispatch(29460);
			break;
		case 29461:
			event.preventDefault();
			this.model.selectNext();
			this.playerKeyPressed.dispatch(29461);
			break;
		case 29443:
			event.preventDefault();
			if(this.model.get_currentItem() != null) {
				this.selectedItemChanged.dispatch(this.model.get_currentItem());
				this.playerKeyPressed.dispatch(29443);
			}
			break;
		case 71:
			this.playerKeyPressed.dispatch(71);
			break;
		case 70:
			this.playerKeyPressed.dispatch(70);
			break;
		case 74:
			this.playerKeyPressed.dispatch(74);
			break;
		case 72:
			this.playerKeyPressed.dispatch(72);
			break;
		case 69:
			this.playerKeyPressed.dispatch(69);
			break;
		default:
			console.log("Unhandled key");
		}
	}
	,model_itemsChanged: function() {
		var doc = js.Browser.document;
		var fragments = doc.createDocumentFragment();
		var itemIndex = 0;
		this.videoListItems = [];
		var _g = 0, _g1 = this.model.videoLinks;
		while(_g < _g1.length) {
			var videoURLInfo = _g1[_g];
			++_g;
			var videoDiv = doc.createElement("div");
			videoDiv.innerHTML = videoURLInfo.name;
			videoDiv.className = "listItem itemFont";
			itemIndex++;
			videoDiv.tabIndex = itemIndex;
			fragments.appendChild(videoDiv);
			this.videoListItems.push(videoDiv);
		}
		this.view.appendChild(fragments);
		this.model.selectFirst();
	}
	,addModelHandlers: function() {
		this.model.itemLoad.add($bind(this,this.model_itemsChanged));
		this.model.selectedIndexChange.add($bind(this,this.model_selectedIndexChanged));
	}
	,createView: function() {
		components.BaseComponent.prototype.createView.call(this);
		this.view.className = "listGroup";
		this.view.onkeydown = $bind(this,this.view_keyDownHandler);
	}
	,__class__: components.VideoList
});
components.VideoPlayerUI = function() {
	components.BaseComponent.call(this);
};
components.VideoPlayerUI.__name__ = true;
components.VideoPlayerUI.__super__ = components.BaseComponent;
components.VideoPlayerUI.prototype = $extend(components.BaseComponent.prototype,{
	loadLinks: function() {
		this.videoList.set_feedUrl("http://pax.t-online.de/dash/app/sources.json");
	}
	,videoResolutionChange: function(resolution) {
		this.itemInfo.setVideoResolution(resolution);
	}
	,bitRateChange: function(bitRate) {
		this.itemInfo.setBitRate(bitRate);
	}
	,playerTimeProgress: function(timeLapse) {
		this.itemInfo.setTimeProgress(timeLapse);
	}
	,playerStatusChanged: function(status) {
		this.itemInfo.setStatus(status);
	}
	,playerKeyPressed: function(keyCode) {
		this.player.handlePlayerKeyPress(keyCode);
	}
	,selectedItemChanged: function(item) {
		this.player.setData(item);
		this.itemInfo.setData(item);
	}
	,createChildren: function() {
		this.player = new components.Player();
		this.player.statusChanged.add($bind(this,this.playerStatusChanged));
		this.player.timeProgress.add($bind(this,this.playerTimeProgress));
		this.player.bitRateChange.add($bind(this,this.bitRateChange));
		this.player.videoResolutionChange.add($bind(this,this.videoResolutionChange));
		var header = new components.Header();
		this.view.appendChild(header.view);
		this.videoList = new components.VideoList();
		this.view.appendChild(this.videoList.view);
		this.videoList.selectedItemChanged.add($bind(this,this.selectedItemChanged));
		this.videoList.playerKeyPressed.add($bind(this,this.playerKeyPressed));
		this.itemInfo = new components.VideoItemInfo();
		this.view.appendChild(this.itemInfo.view);
	}
	,__class__: components.VideoPlayerUI
});
var haxe = {}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new haxe.ds.StringMap();
	this.params = new haxe.ds.StringMap();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(me.responseData = r.responseText); else if(s == null) me.onError("Failed to connect or resolve host"); else switch(s) {
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,__class__: haxe.Http
}
haxe.Json = function() {
};
haxe.Json.__name__ = true;
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.prototype = {
	parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45, digit = !minus, zero = c == 48;
		var point = false, e = false, pm = false, end = false;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		return i == f?i:f;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "";
					break;
				case 102:
					buf.b += "";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,__class__: haxe.Json
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,__class__: haxe.ds.StringMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
}
js.Lib = function() { }
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
var model = {}
model.VideoListModel = function() {
	this.itemLoad = new msignal.Signal0();
	this.selectedIndexChange = new msignal.Signal1();
	this.videoLinks = new Array();
};
model.VideoListModel.__name__ = true;
model.VideoListModel.prototype = {
	get_currentItem: function() {
		return this.videoLinks[this.currentItemIndex];
	}
	,dispatchSelectionChange: function() {
		if(this.videoLinks.length > 0) this.selectedIndexChange.dispatch(this.currentItemIndex);
	}
	,clear: function() {
		this.videoLinks = [];
		this.currentItemIndex = -1;
		this.currentItem = null;
	}
	,selectLast: function() {
		this.currentItemIndex = this.videoLinks.length - 1;
		this.dispatchSelectionChange();
	}
	,selectFirst: function() {
		this.currentItemIndex = 0;
		this.dispatchSelectionChange();
	}
	,selectPrevious: function() {
		if(this.currentItemIndex > 0) this.currentItemIndex--; else this.currentItemIndex = this.videoLinks.length - 1;
		this.dispatchSelectionChange();
	}
	,selectNext: function() {
		if(this.currentItemIndex < this.videoLinks.length - 1) this.currentItemIndex++; else this.currentItemIndex = 0;
		this.dispatchSelectionChange();
	}
	,loadLinks: function(feedUrl) {
		var _g2 = this;
		var loader = new haxe.Http(feedUrl);
		loader.onData = function(raw) {
			try {
				var linksObject = haxe.Json.parse(raw);
				var _g = 0, _g1 = linksObject.items;
				while(_g < _g1.length) {
					var videoURLInfo = _g1[_g];
					++_g;
					_g2.videoLinks.push(videoURLInfo);
				}
				var _g = 0, _g1 = linksObject.comment;
				while(_g < _g1.length) {
					var videoURLInfo = _g1[_g];
					++_g;
					_g2.videoLinks.push(videoURLInfo);
				}
				_g2.itemLoad.dispatch();
			} catch( err ) {
				js.Lib.alert("error with reading data: " + Std.string(err));
			}
		};
		loader.onError = function(error) {
			console.log("error with receiving data: " + error);
		};
		loader.request();
	}
	,__class__: model.VideoListModel
}
var msignal = {}
msignal.Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
msignal.Signal.__name__ = true;
msignal.Signal.prototype = {
	get_numListeners: function() {
		return this.slots.get_length();
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw "You cannot addOnce() then add() the same listener without removing the relationship first.";
		return false;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,removeAll: function() {
		this.slots = msignal.SlotList.NIL;
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,add: function(listener) {
		return this.registerListener(listener);
	}
	,__class__: msignal.Signal
}
msignal.Signal0 = function() {
	msignal.Signal.call(this);
};
msignal.Signal0.__name__ = true;
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot0(this,listener,once,priority);
	}
	,dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal0
});
msignal.Signal1 = function(type) {
	msignal.Signal.call(this,[type]);
};
msignal.Signal1.__name__ = true;
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot1(this,listener,once,priority);
	}
	,dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
msignal.Signal2.__name__ = true;
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot2(this,listener,once,priority);
	}
	,dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal2
});
msignal.Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal.Slot.__name__ = true;
msignal.Slot.prototype = {
	set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,remove: function() {
		this.signal.remove(this.listener);
	}
	,__class__: msignal.Slot
}
msignal.Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot0.__name__ = true;
msignal.Slot0.__super__ = msignal.Slot;
msignal.Slot0.prototype = $extend(msignal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal.Slot0
});
msignal.Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot1.__name__ = true;
msignal.Slot1.__super__ = msignal.Slot;
msignal.Slot1.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal.Slot1
});
msignal.Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot2.__name__ = true;
msignal.Slot2.__super__ = msignal.Slot;
msignal.Slot2.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal.Slot2
});
msignal.SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal.SlotList.NIL != null) throw "Parameters head and tail are null. Use the NIL element instead.";
		this.nonEmpty = false;
	} else if(head == null) throw "Parameter head cannot be null."; else {
		this.head = head;
		this.tail = tail == null?msignal.SlotList.NIL:tail;
		this.nonEmpty = true;
	}
};
msignal.SlotList.__name__ = true;
msignal.SlotList.prototype = {
	find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		if(this.tail == msignal.SlotList.NIL) return new msignal.SlotList(slot).prepend(this.head);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
	}
	,get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal.SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,__class__: msignal.SlotList
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
msignal.SlotList.NIL = new msignal.SlotList(null,null);
KeyboardConstants.ENTER = 29443;
KeyboardConstants.PLAY = 71;
KeyboardConstants.LEFT = 4;
KeyboardConstants.UP = 29460;
KeyboardConstants.RIGHT = 5;
KeyboardConstants.DOWN = 29461;
KeyboardConstants.STOP = 70;
KeyboardConstants.PAUSE = 74;
KeyboardConstants.FF = 72;
KeyboardConstants.RW = 69;
components.Player.STOPPED = 0;
components.Player.PLAYING = 1;
components.Player.PAUSED = 2;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();

//@ sourceMappingURL=app.js.map