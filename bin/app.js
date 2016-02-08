(function ($hx_exports) { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Device = $hx_exports.Device = function() { };
Device.__name__ = ["Device"];
Device.init = function() {
	if(typeof(Common) != "undefined") {
		Device.widgetAPI = new Common.API.Widget();
		Device.tvKey = new Common.API.TVKeyValue();
	} else Device.tvKey = { };
};
Device.ready = function() {
	try {
		Device.widgetAPI.sendReadyEvent();
	} catch( err ) {
		haxe.Log.trace("failed to invoke widgetAPI sendReadyEvent: " + Std.string(err),{ fileName : "Device.hx", lineNumber : 29, className : "Device", methodName : "ready"});
	}
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var JS = function() { };
JS.__name__ = ["JS"];
JS.detectPrefix = function() {
	var styles = Array.prototype.slice.call(window.getComputedStyle(document.documentElement,"")).join("");
	var ereg = new EReg("-(moz|webkit|o|ms)-","");
	if(ereg.match(styles)) return ereg.matched(1); else if(window.navigator.userAgent.toLowerCase().indexOf("presto") >= 0) return "o"; else return "";
};
JS.getPrefixedStyleName = function(name) {
	if(JS.cache.exists(name)) return JS.cache.get(name);
	var prefixed;
	if(JS.prefix == "") prefixed = name; else prefixed = JS.prefix + name.charAt(0).toUpperCase() + HxOverrides.substr(name,1,null);
	var value;
	if(Reflect.field(JS.style,name) != null) value = name; else value = prefixed;
	JS.cache.set(name,value);
	return value;
};
JS.getPrefixedCSSName = function(name) {
	if(JS.prefix == "") return name; else return "-" + JS.prefix + "-" + name;
};
var KeyboardConstants = function() { };
KeyboardConstants.__name__ = ["KeyboardConstants"];
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var Main = $hx_exports.Main = function() {
	try {
		this.createChildren();
	} catch( err ) {
		haxe.Log.trace(err,{ fileName : "Main.hx", lineNumber : 23, className : "Main", methodName : "new"});
	}
};
Main.__name__ = ["Main"];
Main.main = function() {
	Device.init();
	Device.ready();
	window.onload = function(_) {
		Main.start();
		haxe.Log.trace("in window load",{ fileName : "Main.hx", lineNumber : 34, className : "Main", methodName : "main"});
	};
};
Main.start = function() {
	Main.app = new Main();
};
Main.prototype = {
	createChildren: function() {
		var doc = window.document;
		this.videoPlayer = new components.VideoPlayerUI();
		doc.body.appendChild(this.videoPlayer.view);
		this.videoPlayer.loadLinks();
	}
	,__class__: Main
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var StyleMacro = function() { };
StyleMacro.__name__ = ["StyleMacro"];
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
var XmlType = { __ename__ : ["XmlType"], __constructs__ : [] };
var Xml = function() { };
Xml.__name__ = ["Xml"];
var components = {};
components.BaseComponent = function() {
	this.createView();
	this.createChildren();
};
components.BaseComponent.__name__ = ["components","BaseComponent"];
components.BaseComponent.prototype = {
	createView: function() {
		var doc = window.document;
		this.view = doc.createElement("div");
	}
	,createChildren: function() {
	}
	,__class__: components.BaseComponent
};
var mui = {};
mui.core = {};
mui.core.Changeable = function() { };
mui.core.Changeable.__name__ = ["mui","core","Changeable"];
mui.core.Changeable.prototype = {
	__class__: mui.core.Changeable
};
mui.core.Validator = function() {
	this.valid = true;
	this.stack = [];
};
mui.core.Validator.__name__ = ["mui","core","Validator"];
mui.core.Validator.prototype = {
	invalidate: function(node) {
		this.stack.push(node);
		if(this.valid) {
			this.delayValidation();
			this.valid = false;
		}
	}
	,validate: function() {
		while(this.stack.length > 0) {
			var node = this.stack.shift();
			node.validate();
		}
		this.valid = true;
	}
	,delayValidation: function() {
		mui.Lib.frameRendered.addOnce($bind(this,this.validate));
	}
	,__class__: mui.core.Validator
};
mui.core.Node = function() {
	this.valid = true;
	this.initialValues = { };
	this.previousValues = { };
	this.changed = new msignal.Signal1(Dynamic);
};
mui.core.Node.__name__ = ["mui","core","Node"];
mui.core.Node.__interfaces__ = [mui.core.Changeable];
mui.core.Node.prototype = {
	getInitialValue: function(property) {
		return Reflect.field(this.initialValues,property);
	}
	,getPreviousValue: function(property) {
		return Reflect.field(this.previousValues,property);
	}
	,getChangedValues: function() {
		var changed = { };
		var _g = 0;
		var _g1 = Reflect.fields(this.initialValues);
		while(_g < _g1.length) {
			var property = _g1[_g];
			++_g;
			if(Reflect.field(this,property) != Reflect.field(this.initialValues,property)) changed[property] = true;
		}
		return changed;
	}
	,validate: function() {
		if(this.valid) return;
		this.valid = true;
		var flag = { };
		var hasChanged = false;
		var previousCopy = this.previousValues;
		this.previousValues = { };
		var _g = 0;
		var _g1 = Reflect.fields(previousCopy);
		while(_g < _g1.length) {
			var property = _g1[_g];
			++_g;
			var previousValue = Reflect.field(previousCopy,property);
			var currentValue = Reflect.field(this,property);
			if(currentValue != previousValue) {
				hasChanged = true;
				flag[property] = true;
			}
		}
		if(hasChanged) this.change(flag);
	}
	,changeValue: function(property,value) {
		if(!Object.prototype.hasOwnProperty.call(this.initialValues,property)) {
			this.initialValues[property] = value;
			return value;
		}
		var previousValue = Reflect.field(this,property);
		if(value == previousValue) return value;
		if(!Object.prototype.hasOwnProperty.call(this.previousValues,property)) this.previousValues[property] = previousValue;
		this.invalidate();
		return value;
	}
	,invalidateProperty: function(property) {
		this.previousValues[property] = { };
		this.invalidate();
	}
	,invalidate: function() {
		if(!this.valid) return;
		this.valid = false;
		mui.core.Node.validator.invalidate(this);
	}
	,change: function(flag) {
		this.changed.dispatch(flag);
	}
	,__class__: mui.core.Node
};
mui.display = {};
mui.display.Display = function() {
	mui.core.Node.call(this);
	this.numChildren = 0;
	this.children = [];
	this.set_enabled(true);
	this.parent = null;
	this.index = -1;
	this.set_visible(true);
	this.set_alpha(1);
	this.set_useHandCursor(false);
	this.set_x(0);
	this.set_y(0);
	this.set_scaleX(1);
	this.set_scaleY(1);
	this.set_width(0);
	this.set_height(0);
	this.set_contentWidth(0);
	this.set_contentHeight(0);
	this.set_clip(false);
	this.set_scrollX(0);
	this.set_scrollY(0);
	this.set_left(null);
	this.set_right(null);
	this.set_top(null);
	this.set_bottom(null);
	this.set_centerX(null);
	this.set_centerY(null);
	this.set_resizeX(false);
	this.set_resizeY(false);
	this.set_childOffset(0);
	this._new();
	null;
};
mui.display.Display.__name__ = ["mui","display","Display"];
mui.display.Display.__super__ = mui.core.Node;
mui.display.Display.prototype = $extend(mui.core.Node.prototype,{
	set_scrollX: function(value) {
		return this.scrollX = this.changeValue("scrollX",value);
	}
	,set_scrollY: function(value) {
		return this.scrollY = this.changeValue("scrollY",value);
	}
	,getDebugString: function() {
		if(this.debugClassName == null) {
			var type = Type.getClass(this);
			var name = Type.getClassName(type);
			name = name.split(".").pop();
			this.debugClassName = name.split("_")[0];
		}
		return this.debugClassName;
	}
	,iterator: function() {
		return HxOverrides.iter(this.children);
	}
	,containsDisplay: function(d) {
		var p = d;
		while(p != null) {
			if(p == this) return true;
			p = p.parent;
		}
		return false;
	}
	,get_rootX: function() {
		if(this.parent == null) return 0;
		return this.parent.get_rootX() - this.parent.get_scrollX() + this.x;
	}
	,get_rootY: function() {
		if(this.parent == null) return 0;
		return this.parent.get_rootY() - this.parent.get_scrollY() + this.y;
	}
	,set_contentWidth: function(value) {
		if(this.resizeX) this.set_width(value);
		return this.contentWidth = this.changeValue("contentWidth",value);
	}
	,set_contentHeight: function(value) {
		if(this.resizeY) this.set_height(value);
		return this.contentHeight = this.changeValue("contentHeight",value);
	}
	,get_maxScrollX: function() {
		return Math.round(Math.max(0,this.contentWidth - this.get_width()));
	}
	,get_maxScrollY: function() {
		return Math.round(Math.max(0,this.contentHeight - this.get_height()));
	}
	,set_layout: function(value) {
		if(this.layout != null) this.layout.set_target(null);
		this.layout = this.changeValue("layout",value);
		if(this.layout != null) this.layout.set_target(js.Boot.__cast(this , mui.display.Display));
		return value;
	}
	,addChild: function(child) {
		this.addChildAt(child,this.numChildren);
	}
	,isDescendantOf: function(display) {
		var p = this.parent;
		while(p != null) {
			if(p == display) return true;
			p = p.parent;
		}
		return false;
	}
	,addChildAt: function(child,index) {
		if(!(child != null)) throw "Assertion failed: " + "argument `child` cannot be `null`";
		if(!(child != this)) throw "Assertion failed: " + "argument `child` cannot be be equal to `this`";
		mui.util.Assert.that(!this.isDescendantOf(child),"argument `child` cannot be a parent hierarchy of `this`");
		if(!(index >= 0 && index <= this.numChildren)) throw "Assertion failed: " + "argument `index` is out of bounds";
		if(child.parent != null) child.parent.removeChild(child);
		this.children.splice(index,0,child);
		this.numChildren += 1;
		this._addChildAt(child,index);
		child.parent_addToParentAt(this,index);
		if(this.root != null) child.addToStage(this.root);
		var _g1 = ++index;
		var _g = this.numChildren;
		while(_g1 < _g) {
			var i = _g1++;
			var next = this.children[i];
			next.parent_changeIndex(i);
		}
		this.invalidateProperty("children");
	}
	,removeChild: function(child) {
		var childIndex = this.getChildIndex(child);
		this.removeChildAt(childIndex);
	}
	,removeChildAt: function(index) {
		var child = this.getChildAt(index);
		if(this.root != null) child.removeFromStage();
		HxOverrides.remove(this.children,child);
		this.numChildren -= 1;
		child.parent_removeFromParent();
		this._removeChildAt(child,index);
		var _g1 = index;
		var _g = this.numChildren;
		while(_g1 < _g) {
			var i = _g1++;
			var next = this.children[i];
			next.parent_changeIndex(i);
		}
		this.invalidateProperty("children");
	}
	,releaseChildAt: function(index) {
		return true;
	}
	,getChildIndex: function(child) {
		if(!(child != null)) throw "Assertion failed: " + "argument `child` cannot be `null`";
		if(!(child.parent == this)) throw "Assertion failed: " + "argument `child` must be a child of `this`";
		var _g1 = 0;
		var _g = this.numChildren;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.children[i] == child) return i;
		}
		throw "Assertion failed: " + "argument `child` is child of `this`, but is not in children!";
		return -1;
	}
	,getChildAt: function(index) {
		if(!(index >= 0 && index < this.numChildren)) throw "Assertion failed: " + ("argument `index` is out of bounds (0 <= " + index + " < " + this.numChildren + ")");
		return this.children[index];
	}
	,parent_addToParentAt: function(parent,index) {
		this.parent = this.changeValue("parent",parent);
		this.index = this.changeValue("index",index);
		parent.changed.add($bind(this,this.parentChange));
	}
	,parent_removeFromParent: function() {
		this.parent.changed.remove($bind(this,this.parentChange));
		this.parent = this.changeValue("parent",null);
		this.index = this.changeValue("index",-1);
	}
	,parent_changeIndex: function(index) {
		this.index = this.changeValue("index",index);
	}
	,addToStage: function(root) {
		this.root = root;
		this.addedToStage();
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.addToStage(root);
		}
	}
	,removeFromStage: function() {
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.removeFromStage();
		}
		this.removedFromStage();
		this.root = null;
	}
	,addedToStage: function() {
	}
	,removedFromStage: function() {
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.destroy();
		}
	}
	,change: function(flag) {
		mui.core.Node.prototype.change.call(this,flag);
		if(this.parent != null && (flag.parent || flag.width || flag.height || flag.left || flag.right || flag.top || flag.bottom || flag.centerX || flag.centerY)) this.constrain(this.parent);
		if(this.parent != null && (flag.width || flag.height)) this.parent.childResized(this);
		this._change(flag);
	}
	,childResized: function(child) {
		if(this.layout != null && this.layout.enabled && child.parent == this.layout.target) this.layout.resizeDisplay(child.index);
	}
	,parentChange: function(flag) {
		if(flag.childOffset) {
			this.invalidateProperty("x");
			this.invalidateProperty("y");
		}
		if(flag.width || flag.height) this.invalidateProperty("parent");
	}
	,constrain: function(target) {
		if(target == null) return;
		if(this.centerX == null) {
			if(this.left == null) {
				if(this.right != null) this.set_x(target.get_width() - (this.get_width() + this.right));
			} else {
				this.set_x(this.left);
				if(this.right != null) this.set_width(target.get_width() - (this.left + this.right));
			}
		} else this.set_x(Math.round((target.get_width() - this.get_width()) * this.centerX));
		if(this.centerY == null) {
			if(this.top == null) {
				if(this.bottom != null) this.set_y(target.get_height() - (this.get_height() + this.bottom));
			} else {
				this.set_y(this.top);
				if(this.bottom != null) this.set_height(target.get_height() - (this.top + this.bottom));
			}
		} else this.set_y(Math.round((target.get_height() - this.get_height()) * this.centerY));
	}
	,_new: function() {
		this.element = this.scrollElement = this.createDisplay();
		this.element.className = "view";
		this.element.setAttribute("rel",this.getDebugString());
	}
	,createDisplay: function() {
		return window.document.createElement("div");
	}
	,_addChildAt: function(child,index) {
		if(this.scrollElement.childNodes[index] != null) this.scrollElement.insertBefore(child.element,this.scrollElement.childNodes[index]); else this.scrollElement.appendChild(child.element);
	}
	,_removeChildAt: function(child,index) {
		this.scrollElement.removeChild(child.element);
	}
	,_change: function(flag) {
		if(flag.visible) if(this.visible) this.element.style.visibility = ""; else this.element.style.visibility = "hidden";
		if(flag.alpha) this.setStyle("opacity",Std.string(this.alpha));
		if(flag.x) {
			var offset;
			if(this.parent == null) offset = 0; else offset = this.parent.childOffset;
			this.element.style.left = Std.string(this.x + offset) + "px";
		}
		if(flag.y) {
			var offset1;
			if(this.parent == null) offset1 = 0; else offset1 = this.parent.childOffset;
			this.element.style.top = Std.string(this.y + offset1) + "px";
		}
		if(flag.scaleX || flag.scaleY) {
			this.setStyle(JS.getPrefixedStyleName("transformOrigin"),"top left");
			this.setStyle(JS.getPrefixedStyleName("transform"),"scale(" + this.scaleX + "," + this.scaleY + ")");
		}
		if(flag.clip) {
			if(this.clip) {
				this.element.style.overflow = "hidden";
				this.scrollElement = window.document.createElement("div");
				while(this.element.hasChildNodes()) this.scrollElement.appendChild(this.element.removeChild(this.element.firstChild));
				this.element.appendChild(this.scrollElement);
			} else {
				this.element.style.overflow = null;
				this.element.removeChild(this.scrollElement);
				while(this.scrollElement.hasChildNodes()) this.element.appendChild(this.scrollElement.removeChild(this.scrollElement.firstChild));
				this.scrollElement = this.element;
			}
		}
		if(flag.width) this.element.style.width = this.get_width() + "px";
		if(flag.height) this.element.style.height = this.get_height() + "px";
		if(flag.scrollX || flag.scrollY) this.scrollElement.style[JS.getPrefixedStyleName("transform")] = "translate(" + -this.get_scrollX() + "px," + -this.get_scrollY() + "px)";
	}
	,get_scrollX: function() {
		return this.element.scrollLeft + this.scrollX;
	}
	,get_scrollY: function() {
		return this.element.scrollTop + this.scrollY;
	}
	,setStyle: function(property,value) {
		this.element.style[property] = value;
	}
	,bringToFront: function() {
		if(this.parent == null) return;
		this.element.parentNode.appendChild(this.element);
	}
	,set_enabled: function(v) {
		return this.enabled = this.changeValue("enabled",v);
	}
	,set_visible: function(v) {
		return this.visible = this.changeValue("visible",v);
	}
	,set_clip: function(v) {
		return this.clip = this.changeValue("clip",v);
	}
	,set_useHandCursor: function(v) {
		return this.useHandCursor = this.changeValue("useHandCursor",v);
	}
	,set_alpha: function(v) {
		return this.alpha = this.changeValue("alpha",v);
	}
	,set_x: function(v) {
		return this.x = this.changeValue("x",v);
	}
	,set_y: function(v) {
		return this.y = this.changeValue("y",v);
	}
	,set_width: function(v) {
		return this.width = this.changeValue("width",v);
	}
	,get_width: function() {
		return this.width;
	}
	,set_height: function(v) {
		return this.height = this.changeValue("height",v);
	}
	,get_height: function() {
		return this.height;
	}
	,set_scaleX: function(v) {
		return this.scaleX = this.changeValue("scaleX",v);
	}
	,set_scaleY: function(v) {
		return this.scaleY = this.changeValue("scaleY",v);
	}
	,set_resizeX: function(v) {
		return this.resizeX = this.changeValue("resizeX",v);
	}
	,set_resizeY: function(v) {
		return this.resizeY = this.changeValue("resizeY",v);
	}
	,set_centerX: function(v) {
		return this.centerX = this.changeValue("centerX",v);
	}
	,set_centerY: function(v) {
		return this.centerY = this.changeValue("centerY",v);
	}
	,set_all: function(v) {
		return this.set_bottom(this.set_top(this.set_right(this.set_left(this.all = v))));
	}
	,set_left: function(v) {
		return this.left = this.changeValue("left",v);
	}
	,set_right: function(v) {
		return this.right = this.changeValue("right",v);
	}
	,set_top: function(v) {
		return this.top = this.changeValue("top",v);
	}
	,set_bottom: function(v) {
		return this.bottom = this.changeValue("bottom",v);
	}
	,set_childOffset: function(v) {
		return this.childOffset = this.changeValue("childOffset",v);
	}
	,__class__: mui.display.Display
	,__properties__: {set_layout:"set_layout",get_maxScrollY:"get_maxScrollY",get_maxScrollX:"get_maxScrollX",set_contentHeight:"set_contentHeight",set_contentWidth:"set_contentWidth",get_rootY:"get_rootY",get_rootX:"get_rootX",set_childOffset:"set_childOffset",set_bottom:"set_bottom",set_top:"set_top",set_right:"set_right",set_left:"set_left",set_all:"set_all",set_centerY:"set_centerY",set_centerX:"set_centerX",set_resizeY:"set_resizeY",set_resizeX:"set_resizeX",set_scrollY:"set_scrollY",get_scrollY:"get_scrollY",set_scrollX:"set_scrollX",get_scrollX:"get_scrollX",set_scaleY:"set_scaleY",set_scaleX:"set_scaleX",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",set_y:"set_y",set_x:"set_x",set_alpha:"set_alpha",set_useHandCursor:"set_useHandCursor",set_clip:"set_clip",set_visible:"set_visible",set_enabled:"set_enabled"}
});
mui.display.Rectangle = function() {
	mui.display.Display.call(this);
	this.isRounded = false;
	this.isComplex = false;
	this.set_fill(null);
	this.set_stroke(null);
	this.set_strokeThickness(0.0);
	this.set_radius(0);
	null;
};
mui.display.Rectangle.__name__ = ["mui","display","Rectangle"];
mui.display.Rectangle.__super__ = mui.display.Display;
mui.display.Rectangle.prototype = $extend(mui.display.Display.prototype,{
	set_fill: function(value) {
		if(this.fill != null) this.fill.changed.remove($bind(this,this.fillChange));
		this.fill = this.changeValue("fill",value);
		if(this.fill != null) this.fill.changed.add($bind(this,this.fillChange));
		return this.fill;
	}
	,set_stroke: function(value) {
		if(this.stroke != null) this.stroke.changed.remove($bind(this,this.strokeChange));
		this.stroke = this.changeValue("stroke",value);
		if(this.stroke != null) this.stroke.changed.add($bind(this,this.strokeChange));
		return this.stroke;
	}
	,set_strokeThickness: function(value) {
		value = Math.max(0,value);
		this.set_childOffset(-(value | 0));
		return this.strokeThickness = this.changeValue("strokeThickness",value);
	}
	,fillChange: function(flag) {
		this.invalidateProperty("fill");
	}
	,strokeChange: function(flag) {
		this.invalidateProperty("stroke");
	}
	,change: function(flag) {
		mui.display.Display.prototype.change.call(this,flag);
		if(flag.radiusTopLeft || flag.radiusTopRight || flag.radiusBottomLeft || flag.radiusBottomRight) {
			flag.radius = true;
			this.isRounded = flag.radiusTopLeft > 0 || flag.radiusTopRight > 0 || flag.radiusBottomLeft > 0 || flag.radiusBottomRight > 0;
			this.isComplex = !(this.radiusTopLeft == this.radiusTopRight && this.radiusTopLeft == this.radiusBottomLeft && this.radiusBottomLeft == this.radiusBottomRight);
		}
		this.draw(flag);
	}
	,draw: function(flag) {
		var minSize = Math.min(this.get_width(),this.get_height());
		var strokeThickness = Math.min(this.strokeThickness,minSize * 0.5);
		var strokeThickness2 = strokeThickness * 2;
		var radius = Math.min(this.radiusTopLeft,minSize * 0.5);
		var radius2 = radius * 2;
		var fillRadius2 = Math.max(0,(radius - strokeThickness) * 2);
		if(flag.width || flag.height || flag.strokeThickness) {
			if(!(Math.isNaN(this.get_width()) || Math.isNaN(this.get_height()) || Math.isNaN(strokeThickness))) {
				if(this.get_width() >= 0) this.element.style.width = Std.string(this.get_width() - strokeThickness2) + "px"; else this.element.style.width = null;
				if(this.get_height() >= 0) this.element.style.height = Std.string(this.get_height() - strokeThickness2) + "px"; else this.element.style.height = null;
			}
		}
		if(flag.stroke || flag.strokeThickness) {
			if(strokeThickness > 0) {
				this.setStyle("borderStyle","solid");
				this.setStyle("borderWidth",strokeThickness + "px");
				if(this.stroke != null) this.stroke.applyStroke(this); else this.setStyle("borderColor","transparent");
			} else {
				this.setStyle("borderStyle",null);
				this.setStyle("borderWidth",null);
			}
		}
		if(flag.fill || flag.strokeThickness) {
			if(this.fill != null) this.fill.applyFill(this); else {
				this.setStyle("backgroundPosition","");
				this.setStyle("backgroundImage","");
				this.setStyle("backgroundColor","");
			}
		}
		if(flag.radius || flag.width || flag.height) {
			if(this.isRounded) {
				if(this.isComplex) {
					var sl = Math.min(1,(this.get_height() - strokeThickness) / (this.radiusTopLeft + this.radiusBottomLeft));
					var sr = Math.min(1,(this.get_height() - strokeThickness) / (this.radiusTopRight + this.radiusBottomRight));
					var st = Math.min(1,(this.get_width() - strokeThickness) / (this.radiusTopLeft + this.radiusTopRight));
					var sb = Math.min(1,(this.get_width() - strokeThickness) / (this.radiusBottomLeft + this.radiusBottomRight));
					var tl = Math.floor(this.radiusTopLeft * Math.min(st,sl));
					var tr = Math.floor(this.radiusTopRight * Math.min(st,sr));
					var bl = Math.floor(this.radiusBottomLeft * Math.min(sb,sl));
					var br = Math.floor(this.radiusBottomRight * Math.min(sb,sr));
					var stl;
					if(tl > 0) stl = tl + "px"; else stl = null;
					var str;
					if(tr > 0) str = tr + "px"; else str = null;
					var sbl;
					if(bl > 0) sbl = bl + "px"; else sbl = null;
					var sbr;
					if(br > 0) sbr = br + "px"; else sbr = null;
					this.setStyle("borderTopLeftRadius",stl);
					this.setStyle("borderTopRightRadius",str);
					this.setStyle("borderBottomLeftRadius",sbl);
					this.setStyle("borderBottomRightRadius",sbr);
				} else this.setStyle("borderRadius",radius + "px");
			} else this.setStyle("borderRadius",null);
		}
	}
	,set_radius: function(v) {
		return this.set_radiusBottomRight(this.set_radiusBottomLeft(this.set_radiusTopRight(this.set_radiusTopLeft(this.radius = v))));
	}
	,set_radiusTopLeft: function(v) {
		return this.radiusTopLeft = this.changeValue("radiusTopLeft",v);
	}
	,set_radiusTopRight: function(v) {
		return this.radiusTopRight = this.changeValue("radiusTopRight",v);
	}
	,set_radiusBottomLeft: function(v) {
		return this.radiusBottomLeft = this.changeValue("radiusBottomLeft",v);
	}
	,set_radiusBottomRight: function(v) {
		return this.radiusBottomRight = this.changeValue("radiusBottomRight",v);
	}
	,__class__: mui.display.Rectangle
	,__properties__: $extend(mui.display.Display.prototype.__properties__,{set_radiusBottomRight:"set_radiusBottomRight",set_radiusBottomLeft:"set_radiusBottomLeft",set_radiusTopRight:"set_radiusTopRight",set_radiusTopLeft:"set_radiusTopLeft",set_radius:"set_radius",set_strokeThickness:"set_strokeThickness",set_stroke:"set_stroke",set_fill:"set_fill"})
});
mui.display.AssetLibrary = function() {
	this.assetByURI = new haxe.ds.StringMap();
	this.basePath = "asset/";
	if(mui.util.Param.get_isAvailable()) {
		var baseUrl = mui.util.Param.get("baseUrl");
		if(baseUrl != null) this.basePath = baseUrl + this.basePath;
		var variant = mui.util.Param.get("variant");
		if(variant != null) this.basePath += variant + "/";
	}
};
mui.display.AssetLibrary.__name__ = ["mui","display","AssetLibrary"];
mui.display.AssetLibrary.prototype = {
	load: function(library) {
		var loader = new mui.display.AssetLibraryLoader(this.resolveURI(library + ".json"),this);
		loader.load();
		return loader;
	}
	,getAsset: function(uri) {
		if(this.assetByURI.exists(uri)) return this.assetByURI.get(uri);
		return null;
	}
	,set: function(uri,asset) {
		this.assetByURI.set(uri,asset);
	}
	,resolveURI: function(uri) {
		return this.basePath + (this.subPath == null || this.subPath == ""?"":this.subPath + "/") + uri;
	}
	,getAssetPart: function(asset,id) {
		if(asset.parts != null) {
			var _g = 0;
			var _g1 = asset.parts;
			while(_g < _g1.length) {
				var part = _g1[_g];
				++_g;
				if(part.id == id) return part;
			}
		}
		return null;
	}
	,__class__: mui.display.AssetLibrary
};
mui.util = {};
mui.util.Param = function() { };
mui.util.Param.__name__ = ["mui","util","Param"];
mui.util.Param.__properties__ = {get_isAvailable:"get_isAvailable"}
mui.util.Param.get_isAvailable = function() {
	if(mui.util.Param.checked) return mui.util.Param.isAvailable;
	mui.util.Param.checked = true;
	var string = haxe.Resource.getString("params");
	mui.util.Param.isAvailable = string != null;
	if(mui.util.Param.isAvailable) mui.util.Param.data = JSON.parse(string);
	return mui.util.Param.data != null;
};
mui.util.Param.get = function(key) {
	if(!mui.util.Param.get_isAvailable()) throw "mtask params not available!";
	if(Object.prototype.hasOwnProperty.call(mui.util.Param.data,key)) return Reflect.field(mui.util.Param.data,key);
	return null;
};
var haxe = {};
haxe.Resource = function() { };
haxe.Resource.__name__ = ["haxe","Resource"];
haxe.Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.crypto.Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
haxe.crypto.Base64.__name__ = ["haxe","crypto","Base64"];
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
haxe.crypto.BaseCode.__name__ = ["haxe","crypto","BaseCode"];
haxe.crypto.BaseCode.prototype = {
	initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
mui.display.AssetDisplay = function(uri,part) {
	mui.display.Rectangle.call(this);
	this.assetFrame = 0;
	this.assetFrames = 0;
	this.assetFrameRate = 1;
	this.assetPaused = false;
	if(uri != null) this.setURI(uri,part);
	null;
};
mui.display.AssetDisplay.__name__ = ["mui","display","AssetDisplay"];
mui.display.AssetDisplay.__super__ = mui.display.Rectangle;
mui.display.AssetDisplay.prototype = $extend(mui.display.Rectangle.prototype,{
	setURI: function(uri,part,autoSize) {
		if(autoSize == null) autoSize = true;
		mui.Lib.frameEntered.remove($bind(this,this.nextAssetFrame));
		this.asset = mui.display.AssetDisplay.library.getAsset(uri);
		mui.util.Assert.that(this.asset != null,"asset not found in library: " + mui.display.AssetDisplay.library.resolveURI(uri));
		this.assetURI = uri;
		this.assetPartID = part;
		this.assetCounter = 0;
		if(part != null) {
			this.assetPart = mui.display.AssetDisplay.library.getAssetPart(this.asset,part);
			mui.util.Assert.that(this.assetPart != null,"asset part not found in library: " + mui.display.AssetDisplay.library.resolveURI(uri) + "-" + part);
			this.assetFrames = this.assetPart.frames;
			if(autoSize) {
				this.set_width(this.assetPart.width);
				this.set_height(this.assetPart.height);
			}
			if(!this.assetPaused && this.visible) this._resume();
		} else if(autoSize) {
			this.set_width(this.asset.width);
			this.set_height(this.asset.height);
		}
		this.initAsset();
	}
	,nextAssetFrame: function() {
		if(++this.assetCounter > this.assetFrameRate) {
			if(++this.assetFrame >= this.assetFrames) this.assetFrame = 0;
			this.updateFrame();
			this.assetCounter = 0;
		}
	}
	,change: function(flag) {
		mui.display.Rectangle.prototype.change.call(this,flag);
		if(flag.visible && !this.assetPaused) {
			if(this.visible) this._resume(); else this._pause();
		}
	}
	,pauseAsset: function() {
		this.assetPaused = true;
		this._pause();
	}
	,_pause: function() {
		if(this.assetFrames > 1) mui.Lib.frameEntered.remove($bind(this,this.nextAssetFrame));
	}
	,resumeAsset: function() {
		this.assetPaused = false;
		this._resume();
	}
	,_resume: function() {
		if(this.assetFrames > 1) mui.Lib.frameEntered.add($bind(this,this.nextAssetFrame));
	}
	,addedToStage: function() {
		mui.display.Rectangle.prototype.addedToStage.call(this);
		if(!this.assetPaused && this.visible) this._resume();
	}
	,removedFromStage: function() {
		this._pause();
		mui.display.Rectangle.prototype.removedFromStage.call(this);
	}
	,setPart: function(id) {
		this.assetPartID = id;
		if(this.assetURI != null) {
			this.assetPart = mui.display.AssetDisplay.library.getAssetPart(this.asset,this.assetPartID);
			this.assetFrame = 0;
			this.assetFrames = this.assetPart.frames;
			this.set_width(this.assetPart.width);
			this.set_height(this.assetPart.height);
			this.updateAsset();
		}
	}
	,initAsset: function() {
		this.set_fill(new mui.display.Bitmap(mui.display.AssetDisplay.library.resolveURI(this.assetURI)));
		this.updateAsset();
	}
	,clearAsset: function() {
		this.set_fill(null);
	}
	,updateAsset: function() {
		if(this.assetPart != null) this.setStyle("backgroundPosition","-" + this.assetPart.x + "px -" + this.assetPart.y + "px"); else this.setStyle("backgroundPosition","0px 0px");
	}
	,updateFrame: function() {
		this.setStyle("backgroundPosition","-" + this.get_width() * this.assetFrame + "px -" + this.assetPart.y + "px");
	}
	,__class__: mui.display.AssetDisplay
});
mui.core.DataComponent = function(skin) {
	mui.display.AssetDisplay.call(this);
	this.set_focused(false);
	this.set_selected(false);
	this.set_pressed(false);
	this.set_data(null);
	this.invalidateProperty("focused");
	this.invalidateProperty("selected");
	this.invalidateProperty("enabled");
	this.dispatcher = new mui.util.Dispatcher();
	if(skin != null) this.set_skin(skin);
	null;
};
mui.core.DataComponent.__name__ = ["mui","core","DataComponent"];
mui.core.DataComponent.__super__ = mui.display.AssetDisplay;
mui.core.DataComponent.prototype = $extend(mui.display.AssetDisplay.prototype,{
	action: function() {
	}
	,setAutomationId: function(id) {
	}
	,set_skin: function(value) {
		if(this.skin != null) this.skin.set_target(null);
		this.skin = value;
		if(this.skin != null) this.skin.set_target(this);
		return this.skin;
	}
	,bubble: function(message) {
		this.bubbleFrom(message,this);
	}
	,bubbleFrom: function(message,target) {
		if(this.dispatcher.dispatch(message,target) == true) return;
		if(this.container == null) return;
		this.container.bubbleFrom(message,target);
	}
	,addedToStage: function() {
		mui.display.AssetDisplay.prototype.addedToStage.call(this);
		this.bubble(mui.core.ComponentEvent.COMPONENT_ADDED);
	}
	,removedFromStage: function() {
		this.bubble(mui.core.ComponentEvent.COMPONENT_REMOVED);
		mui.display.AssetDisplay.prototype.removedFromStage.call(this);
	}
	,set_focused: function(value) {
		return this.focused = this.changeValue("focused",value);
	}
	,set_selected: function(value) {
		return this.selected = this.changeValue("selected",value);
	}
	,set_pressed: function(value) {
		return this.pressed = this.changeValue("pressed",value);
	}
	,set_data: function(value) {
		if(value != null) this.updateData(value);
		return this.data = this.changeValue("data",value);
	}
	,updateData: function(newData) {
	}
	,focus: function() {
		if(!this.enabled) return;
		mui.event.Focus.set_current(this);
	}
	,focusIn: function(source) {
		this.set_focused(true);
		if(this.container == null) return;
		this.container.focusIn(this);
	}
	,focusOut: function(source) {
		this.set_focused(false);
		if(this.container == null) return;
		this.container.focusOut(this);
	}
	,__class__: mui.core.DataComponent
	,__properties__: $extend(mui.display.AssetDisplay.prototype.__properties__,{set_data:"set_data",set_pressed:"set_pressed",set_selected:"set_selected",set_focused:"set_focused",set_skin:"set_skin"})
});
mui.core.DataContainer = function(skin) {
	mui.core.DataComponent.call(this,skin);
	this.set_margin(0);
	this.components = new mui.core._Container.ContainerContent();
	this.addChild(this.components);
	this.components.changed.add($bind(this,this.componentsChange));
	this.numComponents = 0;
	this.set_selectedIndex(-1);
	this.numChildren = 0;
	this.set_layout(new mui.layout.Layout());
	this.layout.set_enabled(false);
	this.navigator = new mui.core.Navigator(this);
	this.scroller = new mui.behavior.ScrollBehavior();
	this.scroller.set_enabled(false);
	this.scroller.set_target(this.components);
	null;
};
mui.core.DataContainer.__name__ = ["mui","core","DataContainer"];
mui.core.DataContainer.__super__ = mui.core.DataComponent;
mui.core.DataContainer.prototype = $extend(mui.core.DataComponent.prototype,{
	addedToStage: function() {
		mui.core.DataComponent.prototype.addedToStage.call(this);
		this.scroller.set_running(true);
	}
	,removedFromStage: function() {
		this.scroller.set_running(false);
		mui.core.DataComponent.prototype.removedFromStage.call(this);
	}
	,addChildInfront: function(display) {
		this.addChild(display);
		this.element.appendChild(display.element);
	}
	,change: function(flag) {
		mui.core.DataComponent.prototype.change.call(this,flag);
		if(flag.selectedIndex) this.bubble(mui.core.ContainerEvent.SELECTION_CHANGED);
	}
	,componentsChange: function(flag) {
		if(flag.contentWidth && this.resizeX) this.set_width(this.components.contentWidth + this.marginLeft + this.marginRight);
		if(flag.contentHeight && this.resizeY) this.set_height(this.components.contentHeight + this.marginTop + this.marginBottom);
	}
	,set_layout: function(value) {
		this.invalidateProperty("layout");
		return this.layout = this.components.set_layout(value);
	}
	,set_margin: function(value) {
		return this.set_marginLeft(this.set_marginRight(this.set_marginTop(this.set_marginBottom(value))));
	}
	,set_marginLeft: function(value) {
		this.marginLeft = this.changeValue("marginLeft",value);
		this.resizeComponents();
		return this.marginLeft;
	}
	,set_marginRight: function(value) {
		this.marginRight = this.changeValue("marginRight",value);
		this.resizeComponents();
		return this.marginRight;
	}
	,set_marginTop: function(value) {
		this.marginTop = this.changeValue("marginTop",value);
		this.resizeComponents();
		return this.marginTop;
	}
	,set_marginBottom: function(value) {
		this.marginBottom = this.changeValue("marginBottom",value);
		this.resizeComponents();
		return this.marginBottom;
	}
	,set_width: function(value) {
		mui.core.DataComponent.prototype.set_width.call(this,value);
		this.resizeComponents();
		return value;
	}
	,set_height: function(value) {
		mui.core.DataComponent.prototype.set_height.call(this,value);
		this.resizeComponents();
		return value;
	}
	,resizeComponents: function() {
		if(this.components == null) return;
		this.components.set_x(this.marginLeft);
		this.components.set_y(this.marginTop);
		this.components.set_width(this.get_width() - (this.marginLeft + this.marginRight));
		this.components.set_height(this.get_height() - (this.marginTop + this.marginBottom));
	}
	,addChildAt: function(child,index) {
		mui.core.DataComponent.prototype.addChildAt.call(this,child,index);
		if(js.Boot.__instanceof(child,mui.core.DataComponent)) haxe.Log.trace("warn",{ fileName : "Container.hx", lineNumber : 220, className : "mui.core.DataContainer", methodName : "addChildAt", customParams : ["Should not add component [",Type.getClassName(Type.getClass(child)),"] as child to [",Type.getClassName(Type.getClass(this)),"] , use addComponent or addComponentAt instead."]});
	}
	,addComponent: function(component) {
		this.addComponentAt(component,this.numComponents);
	}
	,addComponentAt: function(component,index) {
		if(component.container != null) component.container.removeComponent(component);
		this.numComponents += 1;
		component.container = this;
		this.components.addChildAt(component,index);
		if(this.selectedIndex == -1) this.set_selectedComponent(this.navigator.closest(component));
		this.invalidateProperty("components");
	}
	,removeComponent: function(component) {
		this.removeComponentAt(this.getComponentIndex(component));
	}
	,removeComponentAt: function(index) {
		var component = this.getComponentAt(index);
		var _g = this;
		_g.set_selectedIndex(_g.selectedIndex - (index <= this.selectedIndex?1:0));
		component.set_focused(component.set_selected(component.set_pressed(false)));
		this.components.removeChildAt(index);
		this.numComponents -= 1;
		component.container = null;
		if(this.selectedIndex > -1) this.set_selectedComponent(this.navigator.closest(this.get_selectedComponent()));
		this.invalidateProperty("components");
	}
	,getComponentIndex: function(component) {
		return this.components.getChildIndex(component);
	}
	,getComponentAt: function(index) {
		var component = this.components.getChildAt(index);
		return component;
	}
	,removeComponents: function() {
		this.set_selectedIndex(-1);
		var _g1 = 0;
		var _g = this.numComponents;
		while(_g1 < _g) {
			var i = _g1++;
			this.removeComponentAt(0);
		}
	}
	,set_selectedIndex: function(value) {
		if(!(value >= -1 && value < this.numComponents)) throw "Assertion failed: " + ("argument `value` is out of bounds: " + value);
		if(!Object.prototype.hasOwnProperty.call(this.initialValues,"selectedIndex")) return this.selectedIndex = this.changeValue("selectedIndex",value);
		if(value == this.selectedIndex) return this.selectedIndex;
		if(this.get_selectedComponent() != null) this.get_selectedComponent().set_selected(false);
		this.selectedIndex = this.changeValue("selectedIndex",value);
		if(this.get_selectedComponent() != null) {
			this.get_selectedComponent().set_selected(true);
			if(this.layout.enabled) this.layout.layoutDisplay(this.selectedIndex);
		}
		if(this.focused) this.focus();
		return this.selectedIndex;
	}
	,get_selectedComponent: function() {
		if(this.selectedIndex == -1 || Math.isNaN(this.selectedIndex)) return null;
		return this.getComponentAt(this.selectedIndex);
	}
	,set_selectedComponent: function(component) {
		this.set_selectedIndex(component == null?-1:this.getComponentIndex(component));
		return component;
	}
	,get_selectedData: function() {
		if(this.get_selectedComponent() == null) return null;
		return this.get_selectedComponent().data;
	}
	,set_selectedData: function(value) {
		var _g1 = 0;
		var _g = this.numComponents;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.getComponentAt(i).data == value) {
				this.set_selectedIndex(i);
				break;
			}
		}
		return value;
	}
	,focus: function() {
		if(!this.enabled) return;
		if(this.get_selectedComponent() != null && this.get_selectedComponent().enabled) this.get_selectedComponent().focus(); else mui.core.DataComponent.prototype.focus.call(this);
	}
	,focusIn: function(source) {
		mui.core.DataComponent.prototype.focusIn.call(this,source);
		if(source == null) return;
		this.set_selectedIndex(this.getComponentIndex(source));
	}
	,__class__: mui.core.DataContainer
	,__properties__: $extend(mui.core.DataComponent.prototype.__properties__,{set_selectedData:"set_selectedData",get_selectedData:"get_selectedData",set_selectedComponent:"set_selectedComponent",get_selectedComponent:"get_selectedComponent",set_selectedIndex:"set_selectedIndex",set_marginBottom:"set_marginBottom",set_marginTop:"set_marginTop",set_marginRight:"set_marginRight",set_marginLeft:"set_marginLeft",set_margin:"set_margin"})
});
components.EndOfPlayScreen = function() {
	mui.core.DataContainer.call(this);
	var baseContainer = new mui.core.DataContainer();
	this.addChild(baseContainer);
	var title = new mui.display.Text();
	title.set_value("ABC");
	baseContainer.addChild(title);
	null;
};
components.EndOfPlayScreen.__name__ = ["components","EndOfPlayScreen"];
components.EndOfPlayScreen.__super__ = mui.core.DataContainer;
components.EndOfPlayScreen.prototype = $extend(mui.core.DataContainer.prototype,{
	__class__: components.EndOfPlayScreen
});
components.Header = function() {
	components.BaseComponent.call(this);
};
components.Header.__name__ = ["components","Header"];
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
components.Player.__name__ = ["components","Player"];
components.Player.prototype = {
	setData: function(item) {
		var r = new EReg("(.*?)\\.(mpd|mkv)$","i");
		if(r.match(item.url)) this.url = item.url + "|COMPONENT=HAS"; else this.url = item.url;
		haxe.Log.trace("URL received: " + this.url,{ fileName : "Player.hx", lineNumber : 52, className : "components.Player", methodName : "setData"});
		this.statusChanged.dispatch("Press play");
		this.timeProgress.dispatch("");
		this.bitRateChange.dispatch("");
		this.videoResolutionChange.dispatch(-1);
		this.stopVideo();
	}
	,init: function() {
		var _g = this;
		this.state = components.Player.STOPPED;
		this.plugin = window.document.getElementById("pluginPlayer");
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
		window.onunload = function(_) {
			if(_g.plugin != null) _g.plugin.Stop();
		};
		return true;
	}
	,onConnectionFailed: function() {
		this.statusChanged.dispatch("Connection failed");
		this.stopVideo();
	}
	,onAuthenticationFailed: function() {
		this.statusChanged.dispatch("Authentication failed");
		this.stopVideo();
	}
	,onStreamNotFound: function() {
		this.statusChanged.dispatch("Stream not found");
		this.stopVideo();
	}
	,onNetworkDisconnected: function() {
		this.statusChanged.dispatch("Network is disconnected");
		this.stopVideo();
	}
	,onRenderComplete: function() {
		this.statusChanged.dispatch("Video is over");
	}
	,onRenderError: function() {
		this.statusChanged.dispatch("Video render error");
		this.stopVideo();
	}
	,onBufferingProgress: function(percent) {
		this.statusChanged.dispatch("Bufferring " + percent + "% ");
	}
	,onBufferingComplete: function() {
		this.statusChanged.dispatch("Playing");
	}
	,updateVideoInfo: function() {
		var availableBitRates = "";
		var currentBitRates = "";
		try {
			availableBitRates = this.plugin.GetAvailableBitrates();
			currentBitRates = this.plugin.GetCurrentBitrates();
		} catch( error ) {
			haxe.Log.trace(error,{ fileName : "Player.hx", lineNumber : 150, className : "components.Player", methodName : "updateVideoInfo"});
		}
		this.bitRateChange.dispatch("BitRate: " + currentBitRates + " / available: " + availableBitRates);
		var resolution = -1;
		try {
			resolution = this.plugin.GetVideoHeight();
		} catch( error1 ) {
			haxe.Log.trace(error1,{ fileName : "Player.hx", lineNumber : 161, className : "components.Player", methodName : "updateVideoInfo"});
		}
		this.videoResolutionChange.dispatch(resolution);
	}
	,onStreamInfoReady: function() {
		this.duration = this.plugin.GetDuration();
		this.statusChanged.dispatch("Streaming");
		this.checkTimer = new haxe.Timer(1000);
		this.checkTimer.run = $bind(this,this.updateVideoInfo);
	}
	,setCurTime: function(time) {
		this.currentTime = time;
		try {
			this.timeProgress.dispatch("Playing at time: " + time + " / " + this.duration);
		} catch( error ) {
			haxe.Log.trace(error,{ fileName : "Player.hx", lineNumber : 184, className : "components.Player", methodName : "setCurTime"});
		}
	}
	,playVideo: function() {
		if(this.url == null) this.statusChanged.dispatch("No videos to play"); else {
			this.state = components.Player.PLAYING;
			this.plugin.Play(this.url);
		}
	}
	,pauseVideo: function() {
		this.state = components.Player.PAUSED;
		this.plugin.Pause();
	}
	,stopVideo: function() {
		if(this.state != components.Player.STOPPED) {
			this.state = components.Player.STOPPED;
			this.plugin.Stop();
			this.checkTimer.stop();
		} else haxe.Log.trace("Ignoring the request, not in right state",{ fileName : "Player.hx", lineNumber : 217, className : "components.Player", methodName : "stopVideo"});
	}
	,resumeVideo: function() {
		this.state = components.Player.PLAYING;
		this.plugin.Resume();
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
	,handlePlayKey: function() {
		var _g = this.state;
		switch(_g) {
		case components.Player.STOPPED:
			this.playVideo();
			break;
		case components.Player.PAUSED:
			this.resumeVideo();
			break;
		default:
			haxe.Log.trace("Ignoring play key, not in correct state",{ fileName : "Player.hx", lineNumber : 264, className : "components.Player", methodName : "handlePlayKey"});
		}
	}
	,handlePauseKey: function() {
		var _g = this.state;
		switch(_g) {
		case components.Player.PLAYING:
			this.pauseVideo();
			break;
		case components.Player.PAUSED:
			this.resumeVideo();
			break;
		default:
			haxe.Log.trace("Ignoring pause key, not in correct state",{ fileName : "Player.hx", lineNumber : 279, className : "components.Player", methodName : "handlePauseKey"});
		}
	}
	,__class__: components.Player
};
components.VideoItemInfo = function() {
	components.BaseComponent.call(this);
};
components.VideoItemInfo.__name__ = ["components","VideoItemInfo"];
components.VideoItemInfo.__super__ = components.BaseComponent;
components.VideoItemInfo.prototype = $extend(components.BaseComponent.prototype,{
	createView: function() {
		components.BaseComponent.prototype.createView.call(this);
	}
	,createChildren: function() {
		components.BaseComponent.prototype.createChildren.call(this);
		var _this = window.document;
		this.videoResolution = _this.createElement("div");
		this.videoResolution.className = "videoResolution itemFont";
		this.view.appendChild(this.videoResolution);
		var _this1 = window.document;
		this.bitRate = _this1.createElement("div");
		this.bitRate.className = "avaialbleBitRate itemFont";
		this.view.appendChild(this.bitRate);
		var _this2 = window.document;
		this.timeLapse = _this2.createElement("div");
		this.timeLapse.className = "timeLapse itemFont";
		this.view.appendChild(this.timeLapse);
		var _this3 = window.document;
		this.status = _this3.createElement("div");
		this.status.className = "status itemFont";
		this.view.appendChild(this.status);
		var _this4 = window.document;
		this.name = _this4.createElement("div");
		this.name.className = "name itemFont";
		this.view.appendChild(this.name);
	}
	,setData: function(item) {
		this.name.innerHTML = item.url;
	}
	,setStatus: function(statusVal) {
		this.status.innerHTML = statusVal;
	}
	,setTimeProgress: function(timeLapsed) {
		this.timeLapse.innerHTML = timeLapsed;
	}
	,setBitRate: function(bitRateData) {
		this.bitRate.innerHTML = bitRateData;
	}
	,setVideoResolution: function(resolution) {
		if(resolution > -1) this.videoResolution.innerHTML = "Resolution: " + resolution + "p"; else this.videoResolution.innerHTML = "";
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
components.VideoList.__name__ = ["components","VideoList"];
components.VideoList.__super__ = components.BaseComponent;
components.VideoList.prototype = $extend(components.BaseComponent.prototype,{
	createView: function() {
		components.BaseComponent.prototype.createView.call(this);
		this.view.className = "listGroup";
		this.view.onkeydown = $bind(this,this.view_keyDownHandler);
	}
	,addModelHandlers: function() {
		this.model.itemLoad.add($bind(this,this.model_itemsChanged));
		this.model.selectedIndexChange.add($bind(this,this.model_selectedIndexChanged));
	}
	,model_itemsChanged: function() {
		var doc = window.document;
		var fragments = doc.createDocumentFragment();
		var itemIndex = 0;
		this.videoListItems = [];
		var _g = 0;
		var _g1 = this.model.videoLinks;
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
	,view_keyDownHandler: function(event) {
		haxe.Log.trace("key pressed: " + event.keyCode,{ fileName : "VideoList.hx", lineNumber : 71, className : "components.VideoList", methodName : "view_keyDownHandler"});
		var _g = event.keyCode;
		switch(_g) {
		case 37:
			event.preventDefault();
			this.model.selectFirst();
			this.playerKeyPressed.dispatch(37);
			break;
		case 39:
			event.preventDefault();
			this.model.selectLast();
			this.playerKeyPressed.dispatch(39);
			break;
		case 38:
			event.preventDefault();
			this.model.selectPrevious();
			this.playerKeyPressed.dispatch(38);
			break;
		case 40:
			event.preventDefault();
			this.model.selectNext();
			this.playerKeyPressed.dispatch(40);
			break;
		case 13:
			event.preventDefault();
			if(this.model.get_currentItem() != null) {
				this.selectedItemChanged.dispatch(this.model.get_currentItem());
				this.playerKeyPressed.dispatch(13);
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
			haxe.Log.trace("Unhandled key",{ fileName : "VideoList.hx", lineNumber : 119, className : "components.VideoList", methodName : "view_keyDownHandler"});
		}
	}
	,model_selectedIndexChanged: function(itemIndex) {
		if(this.videoListItems.length > 0 && itemIndex >= 0) {
			var item = this.videoListItems[itemIndex];
			if(itemIndex - this.scroll < 0) this.set_scroll(itemIndex); else if(itemIndex - this.scroll >= this.visibleLines) this.set_scroll(itemIndex - this.visibleLines);
			item.focus();
		}
	}
	,set_feedUrl: function(value) {
		this.model.clear();
		this.model.loadLinks(value);
		return this.feedUrl = value;
	}
	,set_scroll: function(value) {
		if(this.videoListItems != null) {
			var top = this.videoListItems[value].offsetTop;
			this.view.scrollTop = top;
		}
		return this.scroll = value;
	}
	,__class__: components.VideoList
	,__properties__: {set_scroll:"set_scroll",set_feedUrl:"set_feedUrl"}
});
components.VideoPlayerUI = function() {
	components.BaseComponent.call(this);
};
components.VideoPlayerUI.__name__ = ["components","VideoPlayerUI"];
components.VideoPlayerUI.__super__ = components.BaseComponent;
components.VideoPlayerUI.prototype = $extend(components.BaseComponent.prototype,{
	createChildren: function() {
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
	,selectedItemChanged: function(item) {
		this.player.setData(item);
		this.itemInfo.setData(item);
	}
	,playerKeyPressed: function(keyCode) {
		this.player.handlePlayerKeyPress(keyCode);
	}
	,playerStatusChanged: function(status) {
		this.itemInfo.setStatus(status);
	}
	,playerTimeProgress: function(timeLapse) {
		this.itemInfo.setTimeProgress(timeLapse);
	}
	,bitRateChange: function(bitRate) {
		this.itemInfo.setBitRate(bitRate);
	}
	,videoResolutionChange: function(resolution) {
		this.itemInfo.setVideoResolution(resolution);
	}
	,loadLinks: function() {
		this.videoList.set_feedUrl("http://pax.t-online.de/dash/app/sources.json");
	}
	,__class__: components.VideoPlayerUI
});
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	setHeader: function(header,value) {
		this.headers = Lambda.filter(this.headers,function(h) {
			return h.header != header;
		});
		this.headers.push({ header : header, value : value});
		return this;
	}
	,setPostData: function(data) {
		this.postData = data;
		return this;
	}
	,cancel: function() {
		if(this.req == null) return;
		this.req.abort();
		this.req = null;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
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
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
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
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
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
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Browser = function() { };
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
js.Lib = function() { };
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var mconsole = {};
mconsole.PrinterBase = function() {
	this.printPosition = true;
	this.printLineNumbers = true;
};
mconsole.PrinterBase.__name__ = ["mconsole","PrinterBase"];
mconsole.PrinterBase.prototype = {
	print: function(level,params,indent,pos) {
		params = params.slice();
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			params[i] = Std.string(params[i]);
		}
		var message = params.join(", ");
		var nextPosition = "@ " + pos.className + "." + pos.methodName;
		var nextLineNumber;
		if(pos.lineNumber == null) nextLineNumber = "null"; else nextLineNumber = "" + pos.lineNumber;
		var lineColumn = "";
		var emptyLineColumn = "";
		if(this.printPosition) {
			if(nextPosition != this.position) this.printLine(mconsole.ConsoleColor.none,nextPosition,pos);
		}
		if(this.printLineNumbers) {
			emptyLineColumn = StringTools.lpad(""," ",5);
			if(nextPosition != this.position || nextLineNumber != this.lineNumber) lineColumn = StringTools.lpad(nextLineNumber," ",4) + " "; else lineColumn = emptyLineColumn;
		}
		this.position = nextPosition;
		this.lineNumber = nextLineNumber;
		var color;
		switch(level[1]) {
		case 0:
			color = mconsole.ConsoleColor.white;
			break;
		case 1:
			color = mconsole.ConsoleColor.blue;
			break;
		case 2:
			color = mconsole.ConsoleColor.green;
			break;
		case 3:
			color = mconsole.ConsoleColor.yellow;
			break;
		case 4:
			color = mconsole.ConsoleColor.red;
			break;
		}
		var indent1 = StringTools.lpad(""," ",indent * 2);
		message = lineColumn + indent1 + message;
		message = message.split("\n").join("\n" + emptyLineColumn + indent1);
		this.printLine(color,message,pos);
	}
	,printLine: function(color,line,pos) {
		throw "method not implemented in ConsolePrinterBase";
	}
	,__class__: mconsole.PrinterBase
};
mconsole.Printer = function() { };
mconsole.Printer.__name__ = ["mconsole","Printer"];
mconsole.Printer.prototype = {
	__class__: mconsole.Printer
};
mconsole.ConsoleView = function() {
	mconsole.PrinterBase.call(this);
	this.atBottom = true;
	this.projectHome = "/Users/gauri.gattani/Projects/samsung-4k-player/";
	var document = window.document;
	this.element = document.createElement("pre");
	this.element.id = "console";
	var style = document.createElement("style");
	this.element.appendChild(style);
	var rules = document.createTextNode("#console {\n\tfont-family:monospace;\n\tbackground-color:#002B36;\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\n\tpadding:8px;\n\theight:600px;\n\tmax-height:600px;\n\toverflow-y:scroll;\n\tposition:absolute;\n\tleft:0px;\n\ttop:0px;\n\tright:0px;\n\tmargin:0px;\n\tz-index:10000;\n}\n#console a { text-decoration:none; }\n#console a:hover div { background-color:#063642 }\n#console a div span { display:none; float:right; color:white; }\n#console a:hover div span { display:block; }");
	style.type = "text/css";
	if(style.styleSheet) style.styleSheet.cssText = rules.nodeValue; else style.appendChild(rules);
	var me = this;
	this.element.onscroll = function(e) {
		me.updateScroll();
	};
};
mconsole.ConsoleView.__name__ = ["mconsole","ConsoleView"];
mconsole.ConsoleView.__interfaces__ = [mconsole.Printer];
mconsole.ConsoleView.__super__ = mconsole.PrinterBase;
mconsole.ConsoleView.prototype = $extend(mconsole.PrinterBase.prototype,{
	updateScroll: function() {
		this.atBottom = this.element.scrollTop - (this.element.scrollHeight - this.element.clientHeight) == 0;
	}
	,printLine: function(color,line,pos) {
		var style;
		switch(color[1]) {
		case 0:
			style = "#839496";
			break;
		case 1:
			style = "#ffffff";
			break;
		case 2:
			style = "#248bd2";
			break;
		case 3:
			style = "#859900";
			break;
		case 4:
			style = "#b58900";
			break;
		case 5:
			style = "#dc322f";
			break;
		}
		var file = pos.fileName + ":" + pos.lineNumber;
		var fileName = pos.className.split(".").join("/") + ".hx";
		var link = "";
		this.element.innerHTML = this.element.innerHTML + "<a" + link + "><div style='color:" + style + "'>" + line + "<span>" + file + "</span></div></a>";
		if(this.atBottom) this.element.scrollTop = this.element.scrollHeight;
	}
	,attach: function() {
		window.document.body.appendChild(this.element);
	}
	,remove: function() {
		window.document.body.removeChild(this.element);
	}
	,__class__: mconsole.ConsoleView
});
mconsole.Console = function() { };
mconsole.Console.__name__ = ["mconsole","Console"];
mconsole.Console.start = function() {
	if(mconsole.Console.running) return;
	mconsole.Console.running = true;
	mconsole.Console.previousTrace = haxe.Log.trace;
	haxe.Log.trace = mconsole.Console.haxeTrace;
	if(mconsole.Console.hasConsole) {
	} else {
	}
};
mconsole.Console.stop = function() {
	if(!mconsole.Console.running) return;
	mconsole.Console.running = false;
	haxe.Log.trace = mconsole.Console.previousTrace;
	mconsole.Console.previousTrace = null;
};
mconsole.Console.addPrinter = function(printer) {
	mconsole.Console.removePrinter(printer);
	mconsole.Console.printers.push(printer);
};
mconsole.Console.removePrinter = function(printer) {
	HxOverrides.remove(mconsole.Console.printers,printer);
};
mconsole.Console.haxeTrace = function(value,pos) {
	var params = pos.customParams;
	if(params == null) params = []; else pos.customParams = null;
	var level;
	switch(value) {
	case "log":
		level = mconsole.LogLevel.log;
		break;
	case "warn":
		level = mconsole.LogLevel.warn;
		break;
	case "info":
		level = mconsole.LogLevel.info;
		break;
	case "debug":
		level = mconsole.LogLevel.debug;
		break;
	case "error":
		level = mconsole.LogLevel.error;
		break;
	default:
		params.unshift(value);
		level = mconsole.LogLevel.log;
	}
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole(Std.string(level),params);
	mconsole.Console.print(level,params,pos);
};
mconsole.Console.print = function(level,params,pos) {
	var _g = 0;
	var _g1 = mconsole.Console.printers;
	while(_g < _g1.length) {
		var printer = _g1[_g];
		++_g;
		printer.print(level,params,mconsole.Console.groupDepth,pos);
	}
};
mconsole.Console.log = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("log",[message]);
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
};
mconsole.Console.info = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("info",[message]);
	mconsole.Console.print(mconsole.LogLevel.info,[message],pos);
};
mconsole.Console.debug = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("debug",[message]);
	mconsole.Console.print(mconsole.LogLevel.debug,[message],pos);
};
mconsole.Console.warn = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("warn",[message]);
	mconsole.Console.print(mconsole.LogLevel.warn,[message],pos);
};
mconsole.Console.error = function(message,stack,pos) {
	if(stack == null) stack = haxe.CallStack.callStack();
	var stackTrace;
	if(stack.length > 0) stackTrace = "\n" + mconsole.StackHelper.toString(stack); else stackTrace = "";
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("error",[message]);
	mconsole.Console.print(mconsole.LogLevel.error,["Error: " + Std.string(message) + stackTrace],pos);
};
mconsole.Console.trace = function(pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("trace",[]);
	var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
	mconsole.Console.print(mconsole.LogLevel.error,["Stack trace:\n" + stack],pos);
};
mconsole.Console.assert = function(expression,message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("assert",[expression,message]);
	if(!expression) {
		var stack = mconsole.StackHelper.toString(haxe.CallStack.callStack());
		mconsole.Console.print(mconsole.LogLevel.error,["Assertion failed: " + Std.string(message) + "\n" + stack],pos);
		throw message;
	}
};
mconsole.Console.count = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("count",[title]);
	var position = pos.fileName + ":" + pos.lineNumber;
	var count;
	if(mconsole.Console.counts.exists(position)) count = mconsole.Console.counts.get(position) + 1; else count = 1;
	mconsole.Console.counts.set(position,count);
	mconsole.Console.print(mconsole.LogLevel.log,[title + ": " + count],pos);
};
mconsole.Console.group = function(message,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("group",[message]);
	mconsole.Console.print(mconsole.LogLevel.log,[message],pos);
	mconsole.Console.groupDepth += 1;
};
mconsole.Console.groupEnd = function(pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("groupEnd",[]);
	if(mconsole.Console.groupDepth > 0) mconsole.Console.groupDepth -= 1;
};
mconsole.Console.time = function(name,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("time",[name]);
	mconsole.Console.times.set(name,haxe.Timer.stamp());
};
mconsole.Console.timeEnd = function(name,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("timeEnd",[name]);
	if(mconsole.Console.times.exists(name)) {
		mconsole.Console.print(mconsole.LogLevel.log,[name + ": " + Std["int"]((haxe.Timer.stamp() - mconsole.Console.times.get(name)) * 1000) + "ms"],pos);
		mconsole.Console.times.remove(name);
	}
};
mconsole.Console.markTimeline = function(label,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("markTimeline",[label]);
};
mconsole.Console.profile = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("profile",[title]);
};
mconsole.Console.profileEnd = function(title,pos) {
	if(mconsole.Console.hasConsole) mconsole.Console.callConsole("profileEnd",[title]);
};
mconsole.Console.enterDebugger = function() {
	debugger;
};
mconsole.Console.detectConsole = function() {
	if(console != null && console[mconsole.Console.dirxml] == null) mconsole.Console.dirxml = "log";
	return console != undefined && console.log != undefined && console.warn != undefined;
};
mconsole.Console.callConsole = function(method,params) {
	if(console[method] != null) {
		if(method == "log" && js.Boot.__instanceof(params[0],Xml)) method = mconsole.Console.dirxml;
		if(console[method].apply != null) console[method].apply(console,mconsole.Console.toConsoleValues(params)); else if(Function.prototype.bind != null) Function.prototype.bind.call(console[method],console).apply(console,mconsole.Console.toConsoleValues(params));
	}
};
mconsole.Console.toConsoleValues = function(params) {
	var _g1 = 0;
	var _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		params[i] = mconsole.Console.toConsoleValue(params[i]);
	}
	return params;
};
mconsole.Console.toConsoleValue = function(value) {
	var typeClass = Type.getClass(value);
	var typeName;
	if(typeClass == null) typeName = ""; else typeName = Type.getClassName(typeClass);
	if(typeName == "Xml") {
		var parser = new DOMParser();
		return parser.parseFromString(value.toString(),"text/xml").firstChild;
	} else if(typeName == "Map" || typeName == "StringMap" || typeName == "IntMap") {
		var $native = { };
		var map = value;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			Reflect.setField($native,Std.string(key),mconsole.Console.toConsoleValue(map.get(key)));
		}
		return $native;
	} else {
		{
			var _g = Type["typeof"](value);
			switch(_g[1]) {
			case 7:
				var e = _g[2];
				var native1 = [];
				var name = Type.getEnumName(e) + "." + Type.enumConstructor(value);
				var params = Type.enumParameters(value);
				if(params.length > 0) {
					native1.push(name + "(");
					var _g2 = 0;
					var _g1 = params.length;
					while(_g2 < _g1) {
						var i = _g2++;
						native1.push(mconsole.Console.toConsoleValue(params[i]));
					}
					native1.push(")");
				} else return [name];
				return native1;
			default:
			}
		}
		if(typeName == "Array" || typeName == "List" || typeName == "haxe.FastList") {
			var native2 = [];
			var iterable = value;
			var $it1 = $iterator(iterable)();
			while( $it1.hasNext() ) {
				var i1 = $it1.next();
				native2.push(mconsole.Console.toConsoleValue(i1));
			}
			return native2;
		}
	}
	return value;
};
mconsole.ConsoleMacro = function() { };
mconsole.ConsoleMacro.__name__ = ["mconsole","ConsoleMacro"];
mconsole.LogLevel = { __ename__ : ["mconsole","LogLevel"], __constructs__ : ["log","info","debug","warn","error"] };
mconsole.LogLevel.log = ["log",0];
mconsole.LogLevel.log.toString = $estr;
mconsole.LogLevel.log.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.info = ["info",1];
mconsole.LogLevel.info.toString = $estr;
mconsole.LogLevel.info.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.debug = ["debug",2];
mconsole.LogLevel.debug.toString = $estr;
mconsole.LogLevel.debug.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.warn = ["warn",3];
mconsole.LogLevel.warn.toString = $estr;
mconsole.LogLevel.warn.__enum__ = mconsole.LogLevel;
mconsole.LogLevel.error = ["error",4];
mconsole.LogLevel.error.toString = $estr;
mconsole.LogLevel.error.__enum__ = mconsole.LogLevel;
mconsole.ConsoleColor = { __ename__ : ["mconsole","ConsoleColor"], __constructs__ : ["none","white","blue","green","yellow","red"] };
mconsole.ConsoleColor.none = ["none",0];
mconsole.ConsoleColor.none.toString = $estr;
mconsole.ConsoleColor.none.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.white = ["white",1];
mconsole.ConsoleColor.white.toString = $estr;
mconsole.ConsoleColor.white.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.blue = ["blue",2];
mconsole.ConsoleColor.blue.toString = $estr;
mconsole.ConsoleColor.blue.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.green = ["green",3];
mconsole.ConsoleColor.green.toString = $estr;
mconsole.ConsoleColor.green.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.yellow = ["yellow",4];
mconsole.ConsoleColor.yellow.toString = $estr;
mconsole.ConsoleColor.yellow.__enum__ = mconsole.ConsoleColor;
mconsole.ConsoleColor.red = ["red",5];
mconsole.ConsoleColor.red.toString = $estr;
mconsole.ConsoleColor.red.__enum__ = mconsole.ConsoleColor;
mconsole.StackHelper = function() { };
mconsole.StackHelper.__name__ = ["mconsole","StackHelper"];
mconsole.StackHelper.createFilters = function() {
	var filters = new haxe.ds.StringMap();
	filters.set("@ mconsole.ConsoleRedirect.haxeTrace:59",true);
	return filters;
};
mconsole.StackHelper.toString = function(stack) {
	return "null";
};
mconsole.StackItemHelper = function() { };
mconsole.StackItemHelper.__name__ = ["mconsole","StackItemHelper"];
mconsole.StackItemHelper.toString = function(item,isFirst) {
	if(isFirst == null) isFirst = false;
	switch(item[1]) {
	case 1:
		var module = item[2];
		return module;
	case 3:
		var method = item[3];
		var className = item[2];
		return className + "." + method;
	case 4:
		var v = item[2];
		return "LocalFunction(" + v + ")";
	case 2:
		var line = item[4];
		var file = item[3];
		var s = item[2];
		return (s == null?file.split("::").join(".") + ":" + line:mconsole.StackItemHelper.toString(s)) + ":" + line;
	case 0:
		return "(anonymous function)";
	}
};
var mcore = {};
mcore.util = {};
mcore.util.Colors = function() { };
mcore.util.Colors.__name__ = ["mcore","util","Colors"];
mcore.util.Colors.hexToRGB = function(color) {
	return [(color & 16711680) >> 16,(color & 65280) >> 8,color & 255];
};
mcore.util.Colors.rgbToHex = function(red,green,blue) {
	return red << 16 | green << 8 | blue;
};
mcore.util.Colors.rgbStyle = function(color) {
	var rgb_0 = (color & 16711680) >> 16;
	var rgb_1 = (color & 65280) >> 8;
	var rgb_2 = color & 255;
	return "rgb(" + rgb_0 + "," + rgb_1 + "," + rgb_2 + ")";
};
mcore.util.Colors.rgbaStyle = function(color,alpha) {
	var rgb_0 = (color & 16711680) >> 16;
	var rgb_1 = (color & 65280) >> 8;
	var rgb_2 = color & 255;
	return "rgba(" + rgb_0 + "," + rgb_1 + "," + rgb_2 + "," + alpha + ")";
};
mcore.util.Colors.rgbaStyleToHex = function(rgbStyle) {
	var rgbColorsStr;
	var rgbColorsArr;
	var pos = rgbStyle.indexOf("(") + 1;
	rgbColorsStr = HxOverrides.substr(rgbStyle,pos,11);
	rgbColorsArr = rgbColorsStr.split(",");
	return StringTools.hex(mcore.util.Colors.rgbToHex(Std.parseInt(rgbColorsArr[0]),Std.parseInt(rgbColorsArr[1]),Std.parseInt(rgbColorsArr[2])),6);
};
mcore.util.Floats = function() { };
mcore.util.Floats.__name__ = ["mcore","util","Floats"];
mcore.util.Floats.toString = function(value) {
	if(value == null) return "null"; else return "" + value;
};
mcore.util.Floats.clamp = function(value,minimum,maximum) {
	if(value < minimum) return minimum; else if(value > maximum) return maximum; else return value;
};
mcore.util.Floats.wrap = function(value,minimum,maximum) {
	var index = value - minimum;
	var length = maximum - minimum;
	if(index < 0) index = length + index % length;
	if(index >= length) index %= length;
	return minimum + index;
};
mcore.util.Floats.round = function(value,precision) {
	value = value * Math.pow(10,precision);
	return Math.round(value) / Math.pow(10,precision);
};
var mloader = {};
mloader.Loader = function() { };
mloader.Loader.__name__ = ["mloader","Loader"];
mloader.Loader.prototype = {
	__class__: mloader.Loader
};
mloader.LoaderBase = function(url) {
	this.loaded = new msignal.EventSignal(this);
	this.set_url(this.sanitizeUrl(url));
	this.progress = 0;
	this.loading = false;
};
mloader.LoaderBase.__name__ = ["mloader","LoaderBase"];
mloader.LoaderBase.__interfaces__ = [mloader.Loader];
mloader.LoaderBase.prototype = {
	set_url: function(value) {
		if(value == this.url) return this.url;
		if(this.loading) this.cancel();
		return this.url = this.sanitizeUrl(value);
	}
	,load: function() {
		if(this.loading) return;
		if(this.url == null) throw "No url defined for Loader";
		this.loading = true;
		this.loaded.dispatchType(mloader.LoaderEventType.Start);
		this.loaderLoad();
	}
	,cancel: function() {
		if(!this.loading) return;
		this.loading = false;
		this.loaderCancel();
		this.progress = 0;
		this.content = null;
		this.loaded.dispatchType(mloader.LoaderEventType.Cancel);
	}
	,loaderLoad: function() {
		throw "missing implementation";
	}
	,loaderCancel: function() {
		throw "missing implementation";
	}
	,loaderComplete: function() {
		if(!this.loading) return;
		this.progress = 1;
		this.loading = false;
		this.loaded.dispatchType(mloader.LoaderEventType.Complete);
	}
	,loaderFail: function(error) {
		if(!this.loading) return;
		this.loading = false;
		this.loaded.dispatchType(mloader.LoaderEventType.Fail(error));
	}
	,sanitizeUrl: function(url) {
		var sanitized = url;
		return sanitized;
	}
	,__class__: mloader.LoaderBase
	,__properties__: {set_url:"set_url"}
};
mloader.HttpLoader = function(url,http) {
	mloader.LoaderBase.call(this,url);
	this.headers = new haxe.ds.StringMap();
	if(http == null) http = new haxe.Http("");
	this.http = http;
	http.onData = $bind(this,this.httpData);
	http.onError = $bind(this,this.httpError);
	http.onStatus = $bind(this,this.httpStatus);
};
mloader.HttpLoader.__name__ = ["mloader","HttpLoader"];
mloader.HttpLoader.__super__ = mloader.LoaderBase;
mloader.HttpLoader.prototype = $extend(mloader.LoaderBase.prototype,{
	send: function(data) {
		if(this.loading) this.cancel();
		if(this.url == null) throw "No url defined for Loader";
		this.loading = true;
		this.loaded.dispatchType(mloader.LoaderEventType.Start);
		var contentType = "application/octet-stream";
		if(js.Boot.__instanceof(data,Xml)) {
			data = Std.string(data);
			contentType = "application/xml";
		} else if(!(typeof(data) == "string")) {
			data = JSON.stringify(data);
			contentType = "application/json";
		} else if(typeof(data) == "string" && this.validateJSONdata(data)) contentType = "application/json";
		if(!this.headers.exists("Content-Type")) this.headers.set("Content-Type",contentType);
		this.httpConfigure();
		this.addHeaders();
		this.http.url = this.url;
		this.http.setPostData(data);
		try {
			this.http.request(true);
		} catch( e ) {
			this.loaderFail(mloader.LoaderErrorType.Security(Std.string(e)));
		}
	}
	,loaderLoad: function() {
		this.httpConfigure();
		this.addHeaders();
		this.http.url = this.url;
		try {
			this.http.request(false);
		} catch( e ) {
			this.loaderFail(mloader.LoaderErrorType.Security(Std.string(e)));
		}
	}
	,loaderCancel: function() {
		this.http.cancel();
	}
	,httpConfigure: function() {
	}
	,addHeaders: function() {
		var $it0 = this.headers.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			this.http.setHeader(name,this.headers.get(name));
		}
	}
	,httpData: function(data) {
		this.content = data;
		this.loaderComplete();
	}
	,httpStatus: function(status) {
		this.statusCode = status;
	}
	,httpError: function(error) {
		this.content = this.http.responseData;
		this.loaderFail(mloader.LoaderErrorType.IO(error));
	}
	,httpSecurityError: function(error) {
		this.loaderFail(mloader.LoaderErrorType.Security(error));
	}
	,validateJSONdata: function(data) {
		var isValid = true;
		try {
			JSON.parse(data);
		} catch( error ) {
			isValid = false;
		}
		return isValid;
	}
	,__class__: mloader.HttpLoader
});
mloader.ImageLoader = function(url) {
	mloader.LoaderBase.call(this,url);
};
mloader.ImageLoader.__name__ = ["mloader","ImageLoader"];
mloader.ImageLoader.__super__ = mloader.LoaderBase;
mloader.ImageLoader.prototype = $extend(mloader.LoaderBase.prototype,{
	loaderLoad: function() {
		if(this.image == null) this.content = window.document.createElement("img"); else this.content = this.image;
		this.content.crossOrigin = "Anonymous";
		this.content.onload = $bind(this,this.imageLoad);
		this.content.onerror = $bind(this,this.imageError);
		this.content.src = this.url;
		if(this.content.complete == true && this.content.onload != null) {
			this.content.onload = null;
			this.content.onerror = null;
			this.loaderComplete();
		}
	}
	,loaderCancel: function() {
		this.content.onload = null;
		this.content.onerror = null;
		this.content.src = "";
	}
	,imageLoad: function(event) {
		this.content.onload = null;
		this.content.onerror = null;
		this.loaderComplete();
	}
	,imageError: function(event) {
		if(this.content == null) return;
		this.content.onload = null;
		this.content.onerror = null;
		this.loaderFail(mloader.LoaderErrorType.IO(Std.string(event)));
	}
	,__class__: mloader.ImageLoader
});
mloader.JsonLoader = function(url,http) {
	mloader.HttpLoader.call(this,url,http);
};
mloader.JsonLoader.__name__ = ["mloader","JsonLoader"];
mloader.JsonLoader.__super__ = mloader.HttpLoader;
mloader.JsonLoader.prototype = $extend(mloader.HttpLoader.prototype,{
	httpData: function(data) {
		var raw = null;
		try {
			raw = JSON.parse(data);
		} catch( e ) {
			this.loaderFail(mloader.LoaderErrorType.Format(Std.string(e)));
			return;
		}
		if(this.parseData == null) {
			this.content = raw;
			this.loaderComplete();
			return;
		}
		try {
			this.content = this.parseData(raw);
			this.loaderComplete();
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,mloader.LoaderErrorType) ) {
				var loaderError = $e0;
				this.loaderFail(loaderError);
				return;
			} else {
			var e1 = $e0;
			this.loaderFail(mloader.LoaderErrorType.Data(Std.string(e1),data));
			return;
			}
		}
	}
	,__class__: mloader.JsonLoader
});
mloader.LoaderEventType = { __ename__ : ["mloader","LoaderEventType"], __constructs__ : ["Start","Cancel","Progress","Complete","Fail"] };
mloader.LoaderEventType.Start = ["Start",0];
mloader.LoaderEventType.Start.toString = $estr;
mloader.LoaderEventType.Start.__enum__ = mloader.LoaderEventType;
mloader.LoaderEventType.Cancel = ["Cancel",1];
mloader.LoaderEventType.Cancel.toString = $estr;
mloader.LoaderEventType.Cancel.__enum__ = mloader.LoaderEventType;
mloader.LoaderEventType.Progress = ["Progress",2];
mloader.LoaderEventType.Progress.toString = $estr;
mloader.LoaderEventType.Progress.__enum__ = mloader.LoaderEventType;
mloader.LoaderEventType.Complete = ["Complete",3];
mloader.LoaderEventType.Complete.toString = $estr;
mloader.LoaderEventType.Complete.__enum__ = mloader.LoaderEventType;
mloader.LoaderEventType.Fail = function(error) { var $x = ["Fail",4,error]; $x.__enum__ = mloader.LoaderEventType; $x.toString = $estr; return $x; };
mloader.LoaderErrorType = { __ename__ : ["mloader","LoaderErrorType"], __constructs__ : ["IO","Security","Format","Data"] };
mloader.LoaderErrorType.IO = function(info) { var $x = ["IO",0,info]; $x.__enum__ = mloader.LoaderErrorType; $x.toString = $estr; return $x; };
mloader.LoaderErrorType.Security = function(info) { var $x = ["Security",1,info]; $x.__enum__ = mloader.LoaderErrorType; $x.toString = $estr; return $x; };
mloader.LoaderErrorType.Format = function(info) { var $x = ["Format",2,info]; $x.__enum__ = mloader.LoaderErrorType; $x.toString = $estr; return $x; };
mloader.LoaderErrorType.Data = function(info,data) { var $x = ["Data",3,info,data]; $x.__enum__ = mloader.LoaderErrorType; $x.toString = $estr; return $x; };
mloader.LoaderQueue = function() {
	this.maxLoading = 8;
	this.loaded = new msignal.EventSignal(this);
	this.loading = false;
	this.ignoreFailures = true;
	this.autoLoad = false;
	this.numLoaded = 0;
	this.numFailed = 0;
	this.pendingQueue = [];
	this.activeLoaders = [];
};
mloader.LoaderQueue.__name__ = ["mloader","LoaderQueue"];
mloader.LoaderQueue.__interfaces__ = [mloader.Loader];
mloader.LoaderQueue.prototype = {
	get_size: function() {
		return this.pendingQueue.length + this.activeLoaders.length;
	}
	,get_numPending: function() {
		return this.pendingQueue.length;
	}
	,get_numLoading: function() {
		return this.activeLoaders.length;
	}
	,set_url: function(value) {
		return value;
	}
	,add: function(loader) {
		this.addWithPriority(loader,0);
	}
	,addWithPriority: function(loader,priority) {
		this.pendingQueue.push({ loader : loader, priority : priority});
		this.pendingQueue.sort(function(a,b) {
			return b.priority - a.priority;
		});
		if(this.autoLoad) this.load();
	}
	,remove: function(loader) {
		if(this.containsActiveLoader(loader)) {
			this.removeActiveLoader(loader);
			loader.cancel();
			this.continueLoading();
		} else if(this.containsPendingLoader(loader)) this.removePendingLoader(loader);
	}
	,load: function() {
		if(this.loading) return;
		this.loading = true;
		this.numLoaded = this.numFailed = 0;
		this.loaded.dispatchType(mloader.LoaderEventType.Start);
		if(this.pendingQueue.length > 0) this.continueLoading(); else this.queueCompleted();
	}
	,loaderCompleted: function(loader) {
		loader.loaded.remove($bind(this,this.loaderLoaded));
		HxOverrides.remove(this.activeLoaders,loader);
		this.numLoaded++;
		if(this.numLoaded == 0) this.progress = 0; else this.progress = this.numLoaded / (this.numLoaded + this.get_size());
		this.loaded.dispatchType(mloader.LoaderEventType.Progress);
		if(this.loading) {
			if(this.pendingQueue.length > 0) this.continueLoading(); else if(this.activeLoaders.length == 0) this.queueCompleted();
		} else throw "should not be!";
	}
	,loaderFail: function(loader,error) {
		this.numFailed += 1;
		if(this.ignoreFailures) this.loaderCompleted(loader); else {
			loader.loaded.remove($bind(this,this.loaderLoaded));
			HxOverrides.remove(this.activeLoaders,loader);
			this.loaded.dispatchType(mloader.LoaderEventType.Fail(error));
			this.loading = false;
		}
	}
	,continueLoading: function() {
		while(this.pendingQueue.length > 0 && this.activeLoaders.length < this.maxLoading) {
			var info = this.pendingQueue.shift();
			var loader = info.loader;
			loader.loaded.add($bind(this,this.loaderLoaded));
			this.activeLoaders.push(loader);
			loader.load();
		}
	}
	,queueCompleted: function() {
		this.loaded.dispatchType(mloader.LoaderEventType.Complete);
		this.loading = false;
	}
	,cancel: function() {
		while(this.activeLoaders.length > 0) {
			var loader = this.activeLoaders.pop();
			loader.loaded.remove($bind(this,this.loaderLoaded));
			loader.cancel();
		}
		this.loading = false;
		this.pendingQueue = [];
		this.loaded.dispatchType(mloader.LoaderEventType.Cancel);
	}
	,loaderLoaded: function(event) {
		var loader = event.target;
		{
			var _g = event.type;
			switch(_g[1]) {
			case 3:case 1:
				this.loaderCompleted(loader);
				break;
			case 4:
				var e = _g[2];
				this.loaderFail(loader,e);
				break;
			default:
			}
		}
	}
	,containsActiveLoader: function(loader) {
		var _g = 0;
		var _g1 = this.activeLoaders;
		while(_g < _g1.length) {
			var active = _g1[_g];
			++_g;
			if(active == loader) return true;
		}
		return false;
	}
	,containsPendingLoader: function(loader) {
		var _g = 0;
		var _g1 = this.pendingQueue;
		while(_g < _g1.length) {
			var pending = _g1[_g];
			++_g;
			if(pending.loader == loader) return true;
		}
		return false;
	}
	,removeActiveLoader: function(loader) {
		var i = this.activeLoaders.length;
		while(i-- > 0) if(this.activeLoaders[i] == loader) {
			loader.loaded.remove($bind(this,this.loaderLoaded));
			this.activeLoaders.splice(i,1);
		}
	}
	,removePendingLoader: function(loader) {
		var i = this.pendingQueue.length;
		while(i-- > 0) if(this.pendingQueue[i].loader == loader) this.pendingQueue.splice(i,1);
	}
	,__class__: mloader.LoaderQueue
	,__properties__: {set_url:"set_url",get_numLoading:"get_numLoading",get_numPending:"get_numPending",get_size:"get_size"}
};
var model = {};
model.VideoListModel = function() {
	this.itemLoad = new msignal.Signal0();
	this.selectedIndexChange = new msignal.Signal1();
	this.videoLinks = new Array();
};
model.VideoListModel.__name__ = ["model","VideoListModel"];
model.VideoListModel.prototype = {
	loadLinks: function(feedUrl) {
		var _g2 = this;
		var loader = new haxe.Http(feedUrl);
		loader.onData = function(raw) {
			try {
				var linksObject = JSON.parse(raw);
				var _g = 0;
				var _g1 = linksObject.items;
				while(_g < _g1.length) {
					var videoURLInfo = _g1[_g];
					++_g;
					_g2.videoLinks.push(videoURLInfo);
				}
				var _g3 = 0;
				var _g11 = linksObject.comment;
				while(_g3 < _g11.length) {
					var videoURLInfo1 = _g11[_g3];
					++_g3;
					_g2.videoLinks.push(videoURLInfo1);
				}
				_g2.itemLoad.dispatch();
			} catch( err ) {
				js.Lib.alert("error with reading data: " + Std.string(err));
			}
		};
		loader.onError = function(error) {
			haxe.Log.trace("error with receiving data: " + error,{ fileName : "VideoListModel.hx", lineNumber : 51, className : "model.VideoListModel", methodName : "loadLinks"});
		};
		loader.request();
	}
	,selectNext: function() {
		if(this.currentItemIndex < this.videoLinks.length - 1) this.currentItemIndex++; else this.currentItemIndex = 0;
		this.dispatchSelectionChange();
	}
	,selectPrevious: function() {
		if(this.currentItemIndex > 0) this.currentItemIndex--; else this.currentItemIndex = this.videoLinks.length - 1;
		this.dispatchSelectionChange();
	}
	,selectFirst: function() {
		this.currentItemIndex = 0;
		this.dispatchSelectionChange();
	}
	,selectLast: function() {
		this.currentItemIndex = this.videoLinks.length - 1;
		this.dispatchSelectionChange();
	}
	,clear: function() {
		this.videoLinks = [];
		this.currentItemIndex = -1;
		this.currentItem = null;
	}
	,dispatchSelectionChange: function() {
		if(this.videoLinks.length > 0) this.selectedIndexChange.dispatch(this.currentItemIndex);
	}
	,get_currentItem: function() {
		return this.videoLinks[this.currentItemIndex];
	}
	,__class__: model.VideoListModel
	,__properties__: {get_currentItem:"get_currentItem"}
};
var msignal = {};
msignal.Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
msignal.Signal.__name__ = ["msignal","Signal"];
msignal.Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal.SlotList.NIL;
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
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw "You cannot addOnce() then add() the same listener without removing the relationship first.";
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: msignal.Signal
	,__properties__: {get_numListeners:"get_numListeners"}
};
msignal.EventSignal = function(target) {
	msignal.Signal.call(this,[msignal.Event]);
	this.target = target;
};
msignal.EventSignal.__name__ = ["msignal","EventSignal"];
msignal.EventSignal.__super__ = msignal.Signal;
msignal.EventSignal.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function(event) {
		if(event.target == null) {
			event.target = this.target;
			event.signal = this;
		}
		event.currentTarget = this.target;
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(event);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,dispatchType: function(type) {
		this.dispatch(new msignal.Event(type));
	}
	,bubble: function(event) {
		this.dispatch(event);
		var currentTarget = this.target;
		while(currentTarget != null && Object.prototype.hasOwnProperty.call(currentTarget,"parent")) {
			currentTarget = Reflect.field(currentTarget,"parent");
			if(js.Boot.__instanceof(currentTarget,msignal.EventDispatcher)) {
				event.currentTarget = currentTarget;
				var dispatcher;
				dispatcher = js.Boot.__cast(currentTarget , msignal.EventDispatcher);
				if(!dispatcher.dispatchEvent(event)) break;
			}
		}
	}
	,bubbleType: function(type) {
		this.bubble(new msignal.Event(type));
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.EventSlot(this,listener,once,priority);
	}
	,__class__: msignal.EventSignal
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
msignal.Slot.__name__ = ["msignal","Slot"];
msignal.Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,__class__: msignal.Slot
	,__properties__: {set_listener:"set_listener"}
};
msignal.EventSlot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.EventSlot.__name__ = ["msignal","EventSlot"];
msignal.EventSlot.typeEq = function(a,b) {
	if(a == b) return true;
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 7:
			return msignal.EventSlot.enumTypeEq(a,b);
		default:
			return false;
		}
	}
	return false;
};
msignal.EventSlot.enumTypeEq = function(a,b) {
	if(a == b) return true;
	if(Type.getEnum(a) != Type.getEnum(b)) return false;
	if(a[1] != b[1]) return false;
	var aParams = a.slice(2);
	if(aParams.length == 0) return true;
	var bParams = b.slice(2);
	var _g1 = 0;
	var _g = aParams.length;
	while(_g1 < _g) {
		var i = _g1++;
		var aParam = aParams[i];
		var bParam = bParams[i];
		if(aParam == null) continue;
		if(!msignal.EventSlot.typeEq(aParam,bParam)) return false;
	}
	return true;
};
msignal.EventSlot.__super__ = msignal.Slot;
msignal.EventSlot.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.filterType != null && !msignal.EventSlot.typeEq(this.filterType,value1.type)) return;
		if(this.once) this.remove();
		this.listener(value1);
	}
	,forType: function(value) {
		this.filterType = value;
	}
	,__class__: msignal.EventSlot
});
msignal.Event = function(type) {
	this.type = type;
};
msignal.Event.__name__ = ["msignal","Event"];
msignal.Event.prototype = {
	__class__: msignal.Event
};
msignal.EventDispatcher = function() { };
msignal.EventDispatcher.__name__ = ["msignal","EventDispatcher"];
msignal.EventDispatcher.prototype = {
	__class__: msignal.EventDispatcher
};
msignal.Signal0 = function() {
	msignal.Signal.call(this);
};
msignal.Signal0.__name__ = ["msignal","Signal0"];
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot0(this,listener,once,priority);
	}
	,__class__: msignal.Signal0
});
msignal.Signal1 = function(type) {
	msignal.Signal.call(this,[type]);
};
msignal.Signal1.__name__ = ["msignal","Signal1"];
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot1(this,listener,once,priority);
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
msignal.Signal2.__name__ = ["msignal","Signal2"];
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot2(this,listener,once,priority);
	}
	,__class__: msignal.Signal2
});
msignal.Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot0.__name__ = ["msignal","Slot0"];
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
msignal.Slot1.__name__ = ["msignal","Slot1"];
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
msignal.Slot2.__name__ = ["msignal","Slot2"];
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
		if(tail == null) this.tail = msignal.SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal.SlotList.__name__ = ["msignal","SlotList"];
msignal.SlotList.prototype = {
	get_length: function() {
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
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
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
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: msignal.SlotList
	,__properties__: {get_length:"get_length"}
};
mui.Lib = function() { };
mui.Lib.__name__ = ["mui","Lib"];
mui.Lib.__properties__ = {get_display:"get_display"}
mui.Lib.get_display = function() {
	if(mui.Lib.display == null) {
		mui.Lib.display = new mui.display.DisplayRoot();
		mui.device.Profile.init();
	}
	return mui.Lib.display;
};
mui.core.Behavior = function(target) {
	mui.core.Node.call(this);
	this.isRunning = false;
	this.set_enabled(true);
	this.set_running(true);
	if(target != null) this.set_target(target);
	null;
};
mui.core.Behavior.__name__ = ["mui","core","Behavior"];
mui.core.Behavior.__super__ = mui.core.Node;
mui.core.Behavior.prototype = $extend(mui.core.Node.prototype,{
	set_enabled: function(value) {
		if(value == this.enabled) return value;
		this.enabled = value;
		this.updateRunningState();
		return this.enabled;
	}
	,set_running: function(value) {
		if(value == this.running) return value;
		this.running = value;
		this.updateRunningState();
		return this.running;
	}
	,updateRunningState: function() {
		if(this.isRunning) {
			if(this.target == null || !this.enabled || !this.running) {
				this.stopRunning();
				this.isRunning = false;
			}
		} else if(this.target != null && this.enabled && this.running) {
			this.startRunning();
			this.isRunning = true;
		}
	}
	,set_target: function(value) {
		if(this.target != null) {
			this.updateRunningState();
			this.remove();
			this.target.changed.remove($bind(this,this.targetChange));
		}
		this.target = value;
		if(this.target != null) {
			this.target.changed.add($bind(this,this.targetChange));
			this.add();
			this.updateRunningState();
		}
		return this.target;
	}
	,targetChange: function(flag) {
		if(this.enabled) this.update(flag);
	}
	,add: function() {
	}
	,update: function(flag) {
	}
	,remove: function() {
	}
	,startRunning: function() {
	}
	,stopRunning: function() {
	}
	,__class__: mui.core.Behavior
	,__properties__: {set_target:"set_target",set_running:"set_running",set_enabled:"set_enabled"}
});
mui.behavior = {};
mui.behavior.ScrollBehavior = function(target) {
	mui.core.Behavior.call(this,target);
	this.touchEnabled = true;
	this.animated = true;
	this.spring = 0.5;
	this.alignSelectionX = mui.layout.AlignX.center;
	this.alignSelectionY = mui.layout.AlignY.middle;
	this.constrainX = true;
	this.constrainY = true;
	this.inertiaEnabled = true;
	this.velocityX = 0;
	this.velocityY = 0;
	this.scrollX = true;
	this.scrollY = true;
	this.set_realScrollX(0);
	this.set_realScrollY(0);
	null;
};
mui.behavior.ScrollBehavior.__name__ = ["mui","behavior","ScrollBehavior"];
mui.behavior.ScrollBehavior.__super__ = mui.core.Behavior;
mui.behavior.ScrollBehavior.prototype = $extend(mui.core.Behavior.prototype,{
	set_realScrollX: function(value) {
		if(this.target != null) this.target.set_scrollX(Math.round(value));
		return this.realScrollX = value;
	}
	,set_realScrollY: function(value) {
		if(this.target != null) this.target.set_scrollY(Math.round(value));
		return this.realScrollY = value;
	}
	,scrollTo: function(x,y,animate) {
		if(animate == null) animate = true;
		if(!this.enabled) return;
		this.targetX = x;
		if(this.constrainX) this.targetX = this.constrain(this.targetX,this.target.get_maxScrollX(),0);
		this.targetY = y;
		if(this.constrainY) this.targetY = this.constrain(this.targetY,this.target.get_maxScrollY(),0);
		if(mui.event.Key.get_held() || !this.animated) animate = false;
		if(this.tweenSettings != null && this.tweenSettings.onStart != null) this.tweenSettings.onStart();
		if(animate) {
			if(this.tweenSettings != null) {
				this.activeTween = new mui.transition.TimeTween(this,{ realScrollX : this.targetX, realScrollY : this.targetY},this.tweenSettings);
				this.targetX = this.targetY = null;
			} else mui.Lib.frameEntered.add($bind(this,this.updateInertia));
		} else {
			if(this.activeTween != null) {
				this.activeTween.cancel();
				this.activeTween = null;
			}
			this.set_realScrollX(this.targetX);
			this.set_realScrollY(this.targetY);
			if(this.tweenSettings != null && this.tweenSettings.onComplete != null) this.tweenSettings.onComplete();
		}
	}
	,setTarget: function(display,animate) {
		if(animate == null) animate = true;
		var selectionX = 0.0;
		var selectionY = 0.0;
		var scrollWidth = this.target.get_width();
		var scrollHeight = this.target.get_height();
		if(this.target.layout != null) {
			scrollWidth -= this.target.layout.paddingLeft + this.target.layout.paddingRight;
			scrollHeight -= this.target.layout.paddingTop + this.target.layout.paddingBottom;
		}
		var _g = this.alignSelectionX;
		switch(_g[1]) {
		case 0:
			selectionX = 0;
			break;
		case 1:
			selectionX = (scrollWidth - display.get_width()) * 0.5;
			break;
		case 2:
			selectionX = scrollWidth - display.get_width();
			break;
		}
		var _g1 = this.alignSelectionY;
		switch(_g1[1]) {
		case 0:
			selectionY = 0;
			break;
		case 1:
			selectionY = (scrollHeight - display.get_height()) * 0.5;
			break;
		case 2:
			selectionY = scrollHeight - display.get_height();
			break;
		}
		if(this.target.layout != null) {
			selectionX += this.target.layout.paddingLeft;
			selectionY += this.target.layout.paddingTop;
		}
		var x = Math.round(display.x - selectionX);
		var y = Math.round(display.y - selectionY);
		if(x != this.targetX || y != this.targetY) this.scrollTo(x,y,animate);
	}
	,startRunning: function() {
		mui.Lib.frameEntered.add($bind(this,this.updateInertia));
	}
	,stopRunning: function() {
		mui.Lib.frameEntered.remove($bind(this,this.updateInertia));
	}
	,updateInertia: function() {
		if(!this.enabled) return;
		if(!this.inertiaEnabled) {
			if(this.constrainY && this.scrollY) {
				if(this.realScrollY < 0) this.set_realScrollY(0); else if(this.target.get_maxScrollY() > 0 && this.realScrollY > this.target.get_maxScrollY()) this.set_realScrollY(this.target.get_maxScrollY());
			} else if(this.constrainX && this.scrollX) {
				if(this.realScrollX < 0) this.set_realScrollX(0); else if(this.target.get_maxScrollX() > 0 && this.realScrollX > this.target.get_maxScrollX()) this.set_realScrollX(this.target.get_maxScrollX());
			}
			mui.Lib.frameEntered.remove($bind(this,this.updateInertia));
			return;
		}
		var frictionX = 0.92;
		var frictionY = 0.92;
		var acceleration = 0.4;
		var endX = this.targetX;
		var endY = this.targetY;
		var bounceX = false;
		var bounceY = false;
		if(this.targetX != null) {
			this.velocityX = (this.realScrollX - this.targetX) * acceleration;
			frictionX = 1;
		} else if(this.constrainX) {
			if(this.realScrollX < 0) {
				bounceX = this.realScrollX < -1;
				endX = 0;
				this.velocityX += this.realScrollX * 0.1;
				frictionX = 0.6;
			} else if(this.target.get_maxScrollX() > 0 && this.realScrollX > this.target.get_maxScrollX()) {
				bounceX = this.realScrollX > this.target.get_maxScrollX() + 1;
				endX = this.target.get_maxScrollX();
				this.velocityX += (this.realScrollX - endX) * 0.1;
				frictionX = 0.6;
			}
			if(this.spring == 0) {
				if(this.realScrollX <= 0) {
					this.velocityX = 0;
					this.set_realScrollX(0);
				} else if(this.realScrollX >= this.target.get_maxScrollX()) {
					this.velocityX = 0;
					this.set_realScrollX(this.target.get_maxScrollX());
				}
			}
		}
		if(this.targetY != null) {
			this.velocityY = (this.realScrollY - this.targetY) * acceleration;
			frictionY = 1;
		} else if(this.constrainY) {
			if(this.realScrollY < 0) {
				bounceY = this.realScrollY < -1;
				endY = 0;
				this.velocityY += this.realScrollY * 0.1;
				frictionY = 0.6;
			} else if(this.target.get_maxScrollY() > 0 && this.realScrollY > this.target.get_maxScrollY()) {
				bounceY = this.realScrollY > this.target.get_maxScrollY() + 1;
				endY = this.target.get_maxScrollY();
				this.velocityY += (this.realScrollY - endY) * 0.1;
				frictionY = 0.6;
			}
			if(this.spring == 0) {
				if(this.realScrollY <= 0) {
					this.velocityY = 0;
					this.set_realScrollY(0);
				} else if(this.realScrollY >= this.target.get_maxScrollY()) {
					this.velocityY = 0;
					this.set_realScrollY(this.target.get_maxScrollY());
				}
			}
		}
		if(this.scrollX) {
			this.velocityX *= frictionX;
			if(!bounceX && Math.abs(this.velocityX) < 0.2) {
				if(endX != null) this.set_realScrollX(endX); else {
					var _g = this;
					_g.set_realScrollX(_g.realScrollX - this.velocityX);
				}
				this.velocityX = 0;
			} else {
				var _g1 = this;
				_g1.set_realScrollX(_g1.realScrollX - this.velocityX);
			}
		}
		if(this.scrollY) {
			this.velocityY *= frictionY;
			if(!bounceY && Math.abs(this.velocityY) < 0.2) {
				if(endY != null) this.set_realScrollY(endY); else {
					var _g2 = this;
					_g2.set_realScrollY(_g2.realScrollY - this.velocityY);
				}
				this.velocityY = 0;
			} else {
				var _g3 = this;
				_g3.set_realScrollY(_g3.realScrollY - this.velocityY);
			}
		}
		if(this.velocityX == 0 && this.velocityY == 0) mui.Lib.frameEntered.remove($bind(this,this.updateInertia));
	}
	,constrain: function(value,maxValue,spring) {
		if(value < 0) return Math.round(value * spring);
		if(value > maxValue) return Math.round(maxValue + (value - maxValue) * spring);
		return value;
	}
	,__class__: mui.behavior.ScrollBehavior
	,__properties__: $extend(mui.core.Behavior.prototype.__properties__,{set_realScrollY:"set_realScrollY",set_realScrollX:"set_realScrollX"})
});
mui.core.ComponentEvent = { __ename__ : ["mui","core","ComponentEvent"], __constructs__ : ["COMPONENT_ADDED","COMPONENT_REMOVED"] };
mui.core.ComponentEvent.COMPONENT_ADDED = ["COMPONENT_ADDED",0];
mui.core.ComponentEvent.COMPONENT_ADDED.toString = $estr;
mui.core.ComponentEvent.COMPONENT_ADDED.__enum__ = mui.core.ComponentEvent;
mui.core.ComponentEvent.COMPONENT_REMOVED = ["COMPONENT_REMOVED",1];
mui.core.ComponentEvent.COMPONENT_REMOVED.toString = $estr;
mui.core.ComponentEvent.COMPONENT_REMOVED.__enum__ = mui.core.ComponentEvent;
mui.core._Container = {};
mui.core._Container.ContainerContent = function() {
	mui.display.Display.call(this);
	null;
};
mui.core._Container.ContainerContent.__name__ = ["mui","core","_Container","ContainerContent"];
mui.core._Container.ContainerContent.__super__ = mui.display.Display;
mui.core._Container.ContainerContent.prototype = $extend(mui.display.Display.prototype,{
	__class__: mui.core._Container.ContainerContent
});
mui.core.ContainerEvent = { __ename__ : ["mui","core","ContainerEvent"], __constructs__ : ["SELECTION_CHANGED"] };
mui.core.ContainerEvent.SELECTION_CHANGED = ["SELECTION_CHANGED",0];
mui.core.ContainerEvent.SELECTION_CHANGED.toString = $estr;
mui.core.ContainerEvent.SELECTION_CHANGED.__enum__ = mui.core.ContainerEvent;
mui.core.Navigator = function(target) {
	mui.core.Behavior.call(this,target);
	this.skipDisabled = true;
	null;
};
mui.core.Navigator.__name__ = ["mui","core","Navigator"];
mui.core.Navigator.__super__ = mui.core.Behavior;
mui.core.Navigator.prototype = $extend(mui.core.Behavior.prototype,{
	closest: function(component) {
		if(component.enabled) return component;
		var index = component.index;
		var nextComponent = this.get(index,mui.layout.Direction.next);
		var previousComponent = this.get(index,mui.layout.Direction.previous);
		var _g1 = 0;
		var _g = this.target.numComponents;
		while(_g1 < _g) {
			var i = _g1++;
			if(nextComponent != null) {
				if(nextComponent.enabled) return nextComponent;
				nextComponent = this.get(index,mui.layout.Direction.next);
			}
			if(previousComponent != null) {
				if(previousComponent.enabled) return previousComponent;
				previousComponent = this.get(index,mui.layout.Direction.previous);
			}
		}
		return null;
	}
	,next: function(component,direction) {
		var index = component.index;
		var nextComponent = this.get(index,direction);
		var prevComponent = null;
		while(nextComponent != null && nextComponent != component && nextComponent != prevComponent) {
			if(nextComponent.enabled) return nextComponent; else if(!this.skipDisabled) return null;
			prevComponent = nextComponent;
			nextComponent = this.get(nextComponent.index,direction);
		}
		return null;
	}
	,get: function(index,direction) {
		var next = this.target.layout.next(index,direction);
		if(next == -1) return null;
		return this.target.getComponentAt(next);
	}
	,__class__: mui.core.Navigator
});
mui.core.Skin = function(target) {
	mui.core.Behavior.call(this,target);
	this.minWidth = 0;
	this.minHeight = 0;
	this.maxWidth = 5000;
	this.maxHeight = 5000;
	this.defaultWidth = null;
	this.defaultHeight = null;
	this.properties = { };
	this.parts = [];
	this.defaultStyles = { };
	this.set_styles({ });
	null;
};
mui.core.Skin.__name__ = ["mui","core","Skin"];
mui.core.Skin.__super__ = mui.core.Behavior;
mui.core.Skin.prototype = $extend(mui.core.Behavior.prototype,{
	add: function() {
		this.copy(this.properties,this.target);
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			this.target.addChild(part);
		}
		this.measure();
	}
	,remove: function() {
		var _g = 0;
		var _g1 = this.parts;
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			this.target.removeChild(part);
		}
	}
	,measure: function() {
		if(this.defaultWidth != null) this.target.set_width(this.defaultWidth); else if(this.target.get_width() > this.maxWidth) this.target.set_width(this.maxWidth); else if(this.target.get_width() < this.minWidth) this.target.set_width(this.minWidth);
		if(this.defaultHeight != null) this.target.set_height(this.defaultHeight); else if(this.target.get_height() > this.maxHeight) this.target.set_height(this.maxHeight); else if(this.target.get_height() < this.minHeight) this.target.set_height(this.minHeight);
	}
	,addChild: function(child) {
		this.parts.push(child);
	}
	,set_styles: function(value) {
		return this.styles = this.changeValue("styles",this.mergeStyles(value));
	}
	,appendStyles: function(fromStyles) {
		this.set_styles(this.mergeStyles(fromStyles,this.styles));
		this.changeValue("styles",this.styles);
	}
	,revertStyles: function() {
		this.set_styles(this.mergeStyles({ }));
		this.changeValue("styles",this.styles);
	}
	,mergeStyles: function(fromStyles,existingStyles) {
		var o = { };
		this.copy(this.defaultStyles,o);
		if(existingStyles != null) this.copy(existingStyles,o);
		this.copy(fromStyles,o);
		return o;
	}
	,copy: function(fromObject,toObject) {
		var _g = 0;
		var _g1 = Reflect.fields(fromObject);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			var fromValue = Reflect.field(fromObject,field);
			var toValue = Reflect.field(toObject,field);
			if(this.isMergable(fromValue) && this.isMergable(toValue)) this.copy(fromValue,toValue); else Reflect.setProperty(toObject,field,fromValue);
		}
	}
	,isMergable: function(value) {
		{
			var _g = Type["typeof"](value);
			switch(_g[1]) {
			case 6:case 4:
				return !(typeof(value) == "string");
			default:
				return false;
			}
		}
	}
	,__class__: mui.core.Skin
	,__properties__: $extend(mui.core.Behavior.prototype.__properties__,{set_styles:"set_styles"})
});
mui.device = {};
mui.device.Profile = function() { };
mui.device.Profile.__name__ = ["mui","device","Profile"];
mui.device.Profile.init = function() {
	mui.event.Key.manager.set_map(new mui.event.KeyMap());
};
mui.display.AssetLibraryLoader = function(url,library) {
	mloader.LoaderBase.call(this,url);
	if(library == null) library = new mui.display.AssetLibrary();
	this.library = library;
};
mui.display.AssetLibraryLoader.__name__ = ["mui","display","AssetLibraryLoader"];
mui.display.AssetLibraryLoader.__super__ = mloader.LoaderBase;
mui.display.AssetLibraryLoader.prototype = $extend(mloader.LoaderBase.prototype,{
	loaderLoad: function() {
		var loader = new mloader.JsonLoader();
		loader.loaded.add($bind(this,this.jsonComplete)).forType(mloader.LoaderEventType.Complete);
		loader.set_url(this.url);
		loader.load();
	}
	,loaderCancel: function() {
	}
	,jsonComplete: function(event) {
		var assets = event.target.content;
		var _g = 0;
		while(_g < assets.length) {
			var asset = assets[_g];
			++_g;
			if(asset.parts != null) {
				var _g1 = 0;
				var _g2 = asset.parts;
				while(_g1 < _g2.length) {
					var part = _g2[_g1];
					++_g1;
					this.configureImageAssetPart(asset,part);
				}
			}
			this.library.set(asset.id,asset);
		}
		this.preload(assets);
	}
	,configureImageAssetPart: function(asset,part) {
		if(!(asset.parts != null)) throw "Assertion failed: " + "argument `asset` does not have any parts";
		var i = Lambda.indexOf(asset.parts,part);
		var numParts = asset.parts.length;
		if(part.width == null || part.width == 0) part.width = asset.width / numParts | 0;
		if(part.frames > 1) part.width = part.width / part.frames | 0;
		if(part.height == null || part.height == 0) part.height = asset.height;
		if(part.x == null && numParts > 0) part.x = i * part.width;
		if(part.y == null) part.y = 0;
	}
	,preload: function(assets) {
		var loaderQueue = new mloader.LoaderQueue();
		if(assets.length == 0) this.preloadComplete(null);
		loaderQueue.loaded.add($bind(this,this.preloadComplete)).forType(mloader.LoaderEventType.Complete);
		var _g = 0;
		while(_g < assets.length) {
			var asset = assets[_g];
			++_g;
			var loader = new mloader.ImageLoader();
			loader.set_url(this.library.resolveURI(asset.id));
			loaderQueue.add(loader);
		}
		loaderQueue.load();
	}
	,preloadComplete: function(_) {
		this.loaderComplete();
	}
	,__class__: mui.display.AssetLibraryLoader
});
mui.display.GraphicStyle = function() { };
mui.display.GraphicStyle.__name__ = ["mui","display","GraphicStyle"];
mui.display.GraphicStyle.__interfaces__ = [mui.core.Changeable];
mui.display.GraphicStyle.prototype = {
	__class__: mui.display.GraphicStyle
};
mui.display.Bitmap = function(url) {
	mui.core.Node.call(this);
	this.loadCompleted = new msignal.Signal0();
	this.loadFailed = new msignal.Signal0();
	this.set_url("");
	this.set_scaleMode(mui.display.ScaleMode.NONE);
	this.bitmap = this.changeValue("bitmap",null);
	this.bitmapWidth = this.changeValue("bitmapWidth",0);
	this.bitmapHeight = this.changeValue("bitmapHeight",0);
	if(url != null) this.set_url(url);
	null;
};
mui.display.Bitmap.__name__ = ["mui","display","Bitmap"];
mui.display.Bitmap.__interfaces__ = [mui.display.GraphicStyle];
mui.display.Bitmap.__super__ = mui.core.Node;
mui.display.Bitmap.prototype = $extend(mui.core.Node.prototype,{
	applyFill: function(graphic) {
		graphic.setStyle("backgroundImage","url('" + this.url + "')");
		var _g = this.scaleMode;
		switch(_g[1]) {
		case 1:
			graphic.setStyle("backgroundPosition","50% 50%");
			break;
		case 0:
			graphic.setStyle("backgroundPosition","50% 50%");
			break;
		case 2:
			graphic.setStyle("backgroundPosition","50% 50%");
			break;
		case 3:
			graphic.setStyle("backgroundRepeat","repeat");
			break;
		}
	}
	,applyStroke: function(graphic) {
		graphic.setStyle(JS.getPrefixedStyleName("borderImage"),"url('" + this.url + "')");
	}
	,set_url: function(v) {
		return this.url = this.changeValue("url",v);
	}
	,set_scaleMode: function(v) {
		return this.scaleMode = this.changeValue("scaleMode",v);
	}
	,__class__: mui.display.Bitmap
	,__properties__: {set_scaleMode:"set_scaleMode",set_url:"set_url"}
});
mui.display.ScaleMode = { __ename__ : ["mui","display","ScaleMode"], __constructs__ : ["FILL","FIT","STRETCH","NONE"] };
mui.display.ScaleMode.FILL = ["FILL",0];
mui.display.ScaleMode.FILL.toString = $estr;
mui.display.ScaleMode.FILL.__enum__ = mui.display.ScaleMode;
mui.display.ScaleMode.FIT = ["FIT",1];
mui.display.ScaleMode.FIT.toString = $estr;
mui.display.ScaleMode.FIT.__enum__ = mui.display.ScaleMode;
mui.display.ScaleMode.STRETCH = ["STRETCH",2];
mui.display.ScaleMode.STRETCH.toString = $estr;
mui.display.ScaleMode.STRETCH.__enum__ = mui.display.ScaleMode;
mui.display.ScaleMode.NONE = ["NONE",3];
mui.display.ScaleMode.NONE.toString = $estr;
mui.display.ScaleMode.NONE.__enum__ = mui.display.ScaleMode;
mui.display.Color = function(value,alpha) {
	if(alpha == null) alpha = 1.0;
	if(value == null) value = 16777215;
	mui.core.Node.call(this);
	this.set_value(16777215);
	this.set_alpha(1.0);
	this.set_value(value);
	this.set_alpha(alpha);
	null;
};
mui.display.Color.__name__ = ["mui","display","Color"];
mui.display.Color.__interfaces__ = [mui.display.GraphicStyle];
mui.display.Color.fromGray = function(gray) {
	if(gray < 0) gray = 0; else if(gray > 1) gray = 1; else gray = gray;
	return mui.display.Color.fromRGB(gray,gray,gray);
};
mui.display.Color.toGray = function(color) {
	return 0.3 * ((color >> 16 & 255) / 255) + 0.59 * ((color >> 8 & 255) / 255) + 0.11 * ((color & 255) / 255);
};
mui.display.Color.fromRGB = function(red,green,blue) {
	red = (red < 0?0:red > 1?1:red) * 255;
	green = (green < 0?0:green > 1?1:green) * 255;
	blue = (blue < 0?0:blue > 1?1:blue) * 255;
	return Math.round(red) << 16 | Math.round(green) << 8 | Math.round(blue);
};
mui.display.Color.toRGB = function(color) {
	return { red : (color >> 16 & 255) / 255, green : (color >> 8 & 255) / 255, blue : (color & 255) / 255};
};
mui.display.Color.toRed = function(color) {
	return (color >> 16 & 255) / 255;
};
mui.display.Color.toGreen = function(color) {
	return (color >> 8 & 255) / 255;
};
mui.display.Color.toBlue = function(color) {
	return (color & 255) / 255;
};
mui.display.Color.fromHSL = function(hue,saturation,lightness) {
	hue = mcore.util.Floats.wrap(hue,0,1);
	if(saturation < 0) saturation = 0; else if(saturation > 1) saturation = 1; else saturation = saturation;
	if(lightness < 0) lightness = 0; else if(lightness > 1) lightness = 1; else lightness = lightness;
	var red;
	var green;
	var blue;
	if(saturation == 0) red = green = blue = lightness; else {
		var q;
		if(lightness < 0.5) q = lightness * (1 + saturation); else q = lightness + saturation - lightness * saturation;
		var p = 2 * lightness - q;
		red = mui.display.Color.hue2rgb(p,q,hue + 0.333333333333333315);
		green = mui.display.Color.hue2rgb(p,q,hue);
		blue = mui.display.Color.hue2rgb(p,q,hue - 0.333333333333333315);
	}
	return mui.display.Color.fromRGB(red,green,blue);
};
mui.display.Color.toHSL = function(color) {
	var r = (color >> 16 & 255) / 255;
	var g = (color >> 8 & 255) / 255;
	var b = (color & 255) / 255;
	var max = Math.max(r,Math.max(g,b));
	var min = Math.min(r,Math.min(g,b));
	var h;
	var s;
	var l;
	h = s = l = (max + min) / 2;
	if(max == min) h = s = 0; else {
		var d = max - min;
		if(l > 0.5) s = d / (2 - max - min); else s = d / (max + min);
		if(max == r) h = (g - b) / d + (g < b?6:0); else if(max == g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
		h /= 6;
	}
	return { hue : h, saturation : s, lightness : l};
};
mui.display.Color.toHue = function(color) {
	return mui.display.Color.toHSL(color).hue;
};
mui.display.Color.toSaturation = function(color) {
	return mui.display.Color.toHSL(color).saturation;
};
mui.display.Color.toLightness = function(color) {
	return mui.display.Color.toHSL(color).lightness;
};
mui.display.Color.spin = function(color,amount) {
	var hsl = mui.display.Color.toHSL(color);
	return mui.display.Color.fromHSL(hsl.hue + amount,hsl.saturation,hsl.lightness);
};
mui.display.Color.saturate = function(color,amount) {
	var hsl = mui.display.Color.toHSL(color);
	return mui.display.Color.fromHSL(hsl.hue,hsl.saturation + amount,hsl.lightness);
};
mui.display.Color.desaturate = function(color,amount) {
	var hsl = mui.display.Color.toHSL(color);
	return mui.display.Color.fromHSL(hsl.hue,hsl.saturation - amount,hsl.lightness);
};
mui.display.Color.lighten = function(color,amount) {
	var hsl = mui.display.Color.toHSL(color);
	return mui.display.Color.fromHSL(hsl.hue,hsl.saturation,hsl.lightness + amount);
};
mui.display.Color.darken = function(color,amount) {
	var hsl = mui.display.Color.toHSL(color);
	return mui.display.Color.fromHSL(hsl.hue,hsl.saturation,hsl.lightness - amount);
};
mui.display.Color.hue2rgb = function(p,q,t) {
	if(t < 0) t += 1;
	if(t > 1) t -= 1;
	if(t < 0.166666666666666657) return p + (q - p) * 6 * t;
	if(t < 0.5) return q;
	if(t < 0.66666666666666663) return p + (q - p) * (0.66666666666666663 - t) * 6;
	return p;
};
mui.display.Color.toHexString = function(color) {
	return "0x" + StringTools.lpad(StringTools.hex(color),"0",6);
};
mui.display.Color.toHexStyle = function(color) {
	return "#" + StringTools.lpad(StringTools.hex(color),"0",6);
};
mui.display.Color.toRGBStyle = function(color) {
	var rgb = mui.display.Color.toRGB(color);
	return "rgb(" + Math.floor(rgb.red * 255) + "," + Math.floor(rgb.green * 255) + "," + Math.floor(rgb.blue * 255) + ")";
};
mui.display.Color.toRGBAStyle = function(color,alpha) {
	var rgb = mui.display.Color.toRGB(color);
	return "rgba(" + Math.floor(rgb.red * 255) + "," + Math.floor(rgb.green * 255) + "," + Math.floor(rgb.blue * 255) + "," + alpha + ")";
};
mui.display.Color.toInt = function(c) {
	switch(c[1]) {
	case 0:
		return 0;
	case 1:
		return 16777215;
	case 2:
		return 16711680;
	case 3:
		return 65280;
	case 4:
		return 255;
	case 5:
		return 16776960;
	case 6:
		return 65535;
	case 7:
		return 16711935;
	case 8:
		var value = c[2];
		return mui.display.Color.fromGray(value);
	case 9:
		var blue = c[4];
		var green = c[3];
		var red = c[2];
		return mui.display.Color.fromRGB(red,green,blue);
	case 10:
		var lightness = c[4];
		var saturation = c[3];
		var hue = c[2];
		return mui.display.Color.fromHSL(hue,saturation,lightness);
	}
};
mui.display.Color.__super__ = mui.core.Node;
mui.display.Color.prototype = $extend(mui.core.Node.prototype,{
	applyFill: function(graphic) {
		graphic.setStyle("backgroundColor",mui.display.Color.toRGBAStyle(this.value,this.alpha));
		graphic.setStyle("backgroundImage",null);
	}
	,applyStroke: function(graphic) {
		graphic.setStyle("borderColor",mui.display.Color.toRGBAStyle(this.value,this.alpha));
	}
	,set_value: function(v) {
		return this.value = this.changeValue("value",v);
	}
	,set_alpha: function(v) {
		return this.alpha = this.changeValue("alpha",v);
	}
	,__class__: mui.display.Color
	,__properties__: {set_alpha:"set_alpha",set_value:"set_value"}
});
mui.display.ColorValue = { __ename__ : ["mui","display","ColorValue"], __constructs__ : ["black","white","red","green","blue","yellow","aqua","fuchsia","gray","rgb","hsl"] };
mui.display.ColorValue.black = ["black",0];
mui.display.ColorValue.black.toString = $estr;
mui.display.ColorValue.black.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.white = ["white",1];
mui.display.ColorValue.white.toString = $estr;
mui.display.ColorValue.white.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.red = ["red",2];
mui.display.ColorValue.red.toString = $estr;
mui.display.ColorValue.red.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.green = ["green",3];
mui.display.ColorValue.green.toString = $estr;
mui.display.ColorValue.green.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.blue = ["blue",4];
mui.display.ColorValue.blue.toString = $estr;
mui.display.ColorValue.blue.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.yellow = ["yellow",5];
mui.display.ColorValue.yellow.toString = $estr;
mui.display.ColorValue.yellow.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.aqua = ["aqua",6];
mui.display.ColorValue.aqua.toString = $estr;
mui.display.ColorValue.aqua.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.fuchsia = ["fuchsia",7];
mui.display.ColorValue.fuchsia.toString = $estr;
mui.display.ColorValue.fuchsia.__enum__ = mui.display.ColorValue;
mui.display.ColorValue.gray = function(value) { var $x = ["gray",8,value]; $x.__enum__ = mui.display.ColorValue; $x.toString = $estr; return $x; };
mui.display.ColorValue.rgb = function(red,green,blue) { var $x = ["rgb",9,red,green,blue]; $x.__enum__ = mui.display.ColorValue; $x.toString = $estr; return $x; };
mui.display.ColorValue.hsl = function(hue,saturation,lightness) { var $x = ["hsl",10,hue,saturation,lightness]; $x.__enum__ = mui.display.ColorValue; $x.toString = $estr; return $x; };
mui.display.DisplayRoot = function() {
	mui.display.Rectangle.call(this);
	this.root = this;
	this.defaultFrameRate = 16;
	null;
};
mui.display.DisplayRoot.__name__ = ["mui","display","DisplayRoot"];
mui.display.DisplayRoot.__super__ = mui.display.Rectangle;
mui.display.DisplayRoot.prototype = $extend(mui.display.Rectangle.prototype,{
	setDefaultFrameRate: function(value) {
		this.defaultFrameRate = value;
	}
	,_new: function() {
		mui.display.Rectangle.prototype._new.call(this);
		this.eventListeners = [];
		this.document = window.document;
		this.window = window;
		var body = this.document.body;
		body.appendChild(this.element);
		this.addEventListener(this.window,"resize",$bind(this,this.resize));
		if(Object.prototype.hasOwnProperty.call(this.window,"orientation")) {
			var orientation = this.angleToOrientation(this.window.orientation);
			mui.event.Screen.reorient(orientation);
			this.addEventListener(this.window,"orientationchange",$bind(this,this.reorient));
		}
		this.set_width(this.window.innerWidth);
		this.set_height(this.window.innerHeight);
		mui.event.Screen.resize(this.get_width(),this.get_height());
		this.window.requestAnimationFrame($bind(this,this.enterFrame),this.element);
	}
	,destroy: function() {
		this.removeAllEventListeners();
		mui.display.Rectangle.prototype.destroy.call(this);
	}
	,enterFrame: function() {
		mui.Lib.frameEntered.dispatch();
		mui.Lib.frameRendered.dispatch();
		this.window.requestAnimationFrame($bind(this,this.enterFrame),this.element);
	}
	,resize: function(e) {
		this.set_width(this.window.innerWidth);
		this.set_height(this.window.innerHeight);
		mui.core.Node.validator.validate();
		mui.event.Screen.resize(this.get_width(),this.get_height());
	}
	,reorient: function(e) {
		var newOrientation = this.angleToOrientation(this.window.orientation);
		mui.event.Screen.reorient(newOrientation);
	}
	,angleToOrientation: function(angle) {
		switch(angle) {
		case 90:
			return mui.event.ScreenOrientation.LandscapeRight;
		case 180:
			return mui.event.ScreenOrientation.PortraitUpsideDown;
		case -90:
			return mui.event.ScreenOrientation.LandscapeLeft;
		default:
			return mui.event.ScreenOrientation.Portrait;
		}
	}
	,addEventListener: function(element,event,handler) {
		var obj = { element : element, event : event, handler : Dynamic};
		this.eventListeners.push(obj);
		element.addEventListener(event,handler,false);
	}
	,removeAllEventListeners: function() {
		var _g = 0;
		var _g1 = this.eventListeners;
		while(_g < _g1.length) {
			var obj = _g1[_g];
			++_g;
			this.removeEventListener(obj.element,obj.event,obj.handler);
		}
		this.eventListeners = [];
	}
	,removeEventListener: function(element,event,handler) {
		element.removeEventListener(event,handler,false);
	}
	,cancelEvent: function(event) {
		event.preventDefault();
		event.stopPropagation();
	}
	,__class__: mui.display.DisplayRoot
});
mui.display.Gradient = function(colors,rotation) {
	if(rotation == null) rotation = 0.0;
	mui.core.Node.call(this);
	this.set_colors([]);
	this.set_rotation(0);
	if(colors != null) this.set_colors(colors);
	this.set_rotation(rotation);
	null;
};
mui.display.Gradient.__name__ = ["mui","display","Gradient"];
mui.display.Gradient.__interfaces__ = [mui.display.GraphicStyle];
mui.display.Gradient.__super__ = mui.core.Node;
mui.display.Gradient.prototype = $extend(mui.core.Node.prototype,{
	clone: function() {
		return new mui.display.Gradient(this.colors,this.rotation);
	}
	,applyFill: function(graphic) {
		var styles = [];
		var _g = 0;
		var _g1 = this.colors;
		while(_g < _g1.length) {
			var color = _g1[_g];
			++_g;
			var rgbaStyle = mui.display.Color.toRGBAStyle(color.value,color.alpha);
			styles.push(rgbaStyle + " " + Math.round(color.position * 100) + "%");
		}
		graphic.setStyle("backgroundColor",mui.display.Color.toRGBAStyle(this.colors[0].value,this.colors[0].alpha));
		var gradient;
		gradient = (JS.prefix == ""?"linear-gradient(":"-" + JS.prefix + "-" + "linear-gradient(") + (-this.rotation | 0) + "deg," + styles.join(",") + ")";
		graphic.setStyle("backgroundImage",gradient);
	}
	,applyStroke: function(graphic) {
		graphic.setStyle("borderColor",mui.display.Color.toRGBStyle(this.colors[0].value));
	}
	,set_colors: function(v) {
		return this.colors = this.changeValue("colors",v);
	}
	,set_rotation: function(v) {
		return this.rotation = this.changeValue("rotation",v);
	}
	,__class__: mui.display.Gradient
	,__properties__: {set_rotation:"set_rotation",set_colors:"set_colors"}
});
mui.display.GradientColor = function(value,alpha,position) {
	if(position == null) position = 0.0;
	if(alpha == null) alpha = 1.0;
	mui.display.Color.call(this,value,alpha);
	this.set_position(0.0);
	this.set_position(position);
	null;
};
mui.display.GradientColor.__name__ = ["mui","display","GradientColor"];
mui.display.GradientColor.__super__ = mui.display.Color;
mui.display.GradientColor.prototype = $extend(mui.display.Color.prototype,{
	set_position: function(v) {
		return this.position = this.changeValue("position",v);
	}
	,__class__: mui.display.GradientColor
	,__properties__: $extend(mui.display.Color.prototype.__properties__,{set_position:"set_position"})
});
mui.display.Image = function() {
	mui.display.Rectangle.call(this);
	this.set_loader(new mloader.ImageLoader());
	this.image = window.document.createElement("img");
	this.element.appendChild(this.image);
	this.image.ondragstart = function(e) {
		e.preventDefault();
	};
	this.set_url("");
	this.set_autoSize(true);
	this.imageWidth = 0;
	this.imageHeight = 0;
	this.set_scaleMode(mui.display.ScaleMode.NONE);
	this.loaded = new msignal.Signal0();
	this.failed = new msignal.Signal0();
	null;
};
mui.display.Image.__name__ = ["mui","display","Image"];
mui.display.Image.__super__ = mui.display.Rectangle;
mui.display.Image.prototype = $extend(mui.display.Rectangle.prototype,{
	set_loader: function(value) {
		if(this.loader != null) {
			this.loader.image = null;
			this.loader.loaded.removeAll();
		}
		if(value != null) {
			value.loaded.add($bind(this,this.loadComplete)).forType(mloader.LoaderEventType.Complete);
			value.loaded.add($bind(this,this.loadFail)).forType(mloader.LoaderEventType.Fail(null));
		}
		return this.loader = value;
	}
	,change: function(flag) {
		mui.display.Rectangle.prototype.change.call(this,flag);
		if(flag.width || flag.height) {
			if(this.imageWidth > 0 && this.imageHeight > 0) this.updateScale();
		}
		if(flag.url) this.load(this.url);
	}
	,updateScale: function() {
		var sw = this.get_width() / this.imageWidth;
		var sh = this.get_height() / this.imageHeight;
		var s;
		var _g = this.scaleMode;
		switch(_g[1]) {
		case 1:
			if(sw < sh) s = sw; else s = sh;
			break;
		case 0:
			if(sw > sh) s = sw; else s = sh;
			break;
		case 2:
			if(sw < sh) s = sw; else s = sh;
			break;
		case 3:
			s = 1;
			break;
		}
		this.image.width = s * this.imageWidth | 0;
		this.image.height = s * this.imageHeight | 0;
		this.image.style.left = Std["int"]((this.get_width() - this.image.width) * 0.5) + "px";
		this.image.style.top = Std["int"]((this.get_height() - this.image.height) * 0.5) + "px";
	}
	,load: function(url) {
		this.image.removeAttribute("width");
		this.image.removeAttribute("height");
		this.loader.image = this.image;
		this.set_visible(false);
		this.imageWidth = 0;
		this.imageHeight = 0;
		this.loader.set_url(url);
		if(this.loaderQueue == null) {
			if(url != null && url != "") this.loader.load();
		} else {
			this.loaderQueue.remove(this.loader);
			if(url != null && url != "") this.loaderQueue.add(this.loader);
		}
	}
	,loadComplete: function(e) {
		this.imageWidth = this.changeValue("imageWidth",this.image.width);
		this.imageHeight = this.changeValue("imageHeight",this.image.height);
		if(this.image.naturalWidth != null) this.imageWidth = this.changeValue("imageWidth",this.image.naturalWidth);
		if(this.image.naturalHeight != null) this.imageHeight = this.changeValue("imageHeight",this.image.naturalHeight);
		if(this.autoSize) {
			this.set_width(this.imageWidth);
			this.set_height(this.imageHeight);
		}
		this.updateScale();
		this.set_visible(true);
		this.loaded.dispatch();
	}
	,loadFail: function(e) {
		this.failed.dispatch();
	}
	,set_url: function(v) {
		return this.url = this.changeValue("url",v);
	}
	,set_autoSize: function(v) {
		return this.autoSize = this.changeValue("autoSize",v);
	}
	,set_scaleMode: function(v) {
		return this.scaleMode = this.changeValue("scaleMode",v);
	}
	,__class__: mui.display.Image
	,__properties__: $extend(mui.display.Rectangle.prototype.__properties__,{set_loader:"set_loader",set_scaleMode:"set_scaleMode",set_autoSize:"set_autoSize",set_url:"set_url"})
});
mui.display.TextTransform = { __ename__ : ["mui","display","TextTransform"], __constructs__ : ["None","Uppercase","Lowercase","Capitalize"] };
mui.display.TextTransform.None = ["None",0];
mui.display.TextTransform.None.toString = $estr;
mui.display.TextTransform.None.__enum__ = mui.display.TextTransform;
mui.display.TextTransform.Uppercase = ["Uppercase",1];
mui.display.TextTransform.Uppercase.toString = $estr;
mui.display.TextTransform.Uppercase.__enum__ = mui.display.TextTransform;
mui.display.TextTransform.Lowercase = ["Lowercase",2];
mui.display.TextTransform.Lowercase.toString = $estr;
mui.display.TextTransform.Lowercase.__enum__ = mui.display.TextTransform;
mui.display.TextTransform.Capitalize = ["Capitalize",3];
mui.display.TextTransform.Capitalize.toString = $estr;
mui.display.TextTransform.Capitalize.__enum__ = mui.display.TextTransform;
mui.display.Text = function() {
	this.hasAttemptedRevalidation = false;
	mui.display.Rectangle.call(this);
	this.invalidateProperty("value");
	this.invalidateProperty("autoSize");
	this.invalidateProperty("selectable");
	this.invalidateProperty("font");
	this.invalidateProperty("size");
	this.invalidateProperty("color");
	this.invalidateProperty("multiline");
	this.invalidateProperty("wrap");
	this.set_value("");
	this.set_font("SourceSansPro");
	this.set_size(24);
	this.set_color(0);
	this.set_selectable(false);
	this.set_bold(false);
	this.set_italic(false);
	this.set_html(false);
	this.set_leading(0);
	this.set_wrap(false);
	this.set_autoSize(true);
	this.set_multiline(false);
	this.set_letterSpacing(0);
	this.set_align("left");
	this.set_transform(mui.display.TextTransform.None);
};
mui.display.Text.__name__ = ["mui","display","Text"];
mui.display.Text.__super__ = mui.display.Rectangle;
mui.display.Text.prototype = $extend(mui.display.Rectangle.prototype,{
	set_value: function(value) {
		if(value == null) value = "";
		this.sizeDirty = true;
		return this.value = this.changeValue("value",value);
	}
	,set_align: function(value) {
		this.sizeDirty = true;
		return this.align = this.changeValue("align",value);
	}
	,set_transform: function(value) {
		this.sizeDirty = true;
		return this.transform = this.changeValue("transform",value);
	}
	,set_font: function(value) {
		this.sizeDirty = true;
		return this.font = this.changeValue("font",value);
	}
	,set_autoSize: function(value) {
		this.sizeDirty = true;
		return this.autoSize = this.changeValue("autoSize",value);
	}
	,set_multiline: function(value) {
		this.sizeDirty = true;
		return this.multiline = this.changeValue("multiline",value);
	}
	,set_wrap: function(value) {
		this.sizeDirty = true;
		return this.wrap = this.changeValue("wrap",value);
	}
	,set_size: function(value) {
		this.sizeDirty = true;
		return this.size = this.changeValue("size",value);
	}
	,set_color: function(value) {
		this.sizeDirty = true;
		return this.color = this.changeValue("color",value);
	}
	,set_html: function(value) {
		this.sizeDirty = true;
		return this.html = this.changeValue("html",value);
	}
	,set_leading: function(value) {
		this.sizeDirty = true;
		return this.leading = this.changeValue("leading",value);
	}
	,set_letterSpacing: function(value) {
		this.sizeDirty = true;
		return this.letterSpacing = this.changeValue("letterSpacing",value);
	}
	,set_italic: function(value) {
		this.sizeDirty = true;
		return this.italic = this.changeValue("italic",value);
	}
	,set_bold: function(value) {
		this.sizeDirty = true;
		return this.bold = this.changeValue("bold",value);
	}
	,set_selectable: function(value) {
		return this.selectable = this.changeValue("selectable",value);
	}
	,get_width: function() {
		if(this.sizeDirty) this.validate();
		return mui.display.Rectangle.prototype.get_width.call(this);
	}
	,get_height: function() {
		if(this.sizeDirty) this.validate();
		return mui.display.Rectangle.prototype.get_height.call(this);
	}
	,truncate: function(content,maxLines,ellipsis) {
		if(ellipsis == null) ellipsis = "…";
		if(maxLines == null) maxLines = 1;
		if(maxLines == 1) {
			if(this.element.className.indexOf(" truncate") == -1) this.element.className += " truncate";
			this.set_autoSize(false);
			this.set_wrap(false);
			this.set_multiline(false);
			this.set_value(content);
			return;
		}
		this.set_autoSize(true);
		this.set_multiline(true);
		this.set_wrap(true);
		this.set_value("0");
		var lineHeight = this.get_height();
		var maxHeight = lineHeight * maxLines;
		this.set_value(content);
		if(this.get_height() <= maxHeight) return;
		var overflow = false;
		var min = 0;
		var max = content.length - 1;
		while(min <= max || overflow) {
			var mid = min + max >>> 1;
			this.set_value(HxOverrides.substr(content,0,mid) + ellipsis);
			overflow = this.get_height() > maxHeight;
			if(overflow) max = mid - 1; else min = mid + 1;
		}
	}
	,_new: function() {
		mui.display.Rectangle.prototype._new.call(this);
		this.element.className += " view-text";
		this.element.style.fontFamily = this.font;
	}
	,change: function(flag) {
		mui.display.Rectangle.prototype.change.call(this,flag);
		if(flag.value) {
			if(this.html) this.element.innerHTML = this.value; else this.element.innerHTML = mui.display.Text.NEWLINES.replace(Std.string(this.value),"<br/>");
			this.sizeDirty = this.autoSize || !this.multiline;
		}
		if(flag.wrap) {
			if(this.wrap) this.element.style.whiteSpace = "normal"; else this.element.style.whiteSpace = null;
			if(this.wrap) this.element.style.wordWrap = "break-word"; else this.element.style.wordWrap = null;
		}
		if(flag.selectable) if(this.selectable) this.element.style[JS.getPrefixedStyleName("userSelect")] = "text"; else this.element.style[JS.getPrefixedStyleName("userSelect")] = null;
		if(flag.leading || flag.font || flag.size || flag.color || flag.bold || flag.italic || flag.letterSpacing || flag.align || flag.transform) {
			if(flag.leading || flag.size) {
				if(this.leading == 0) this.element.style.lineHeight = null; else this.element.style.lineHeight = this.leading + this.size + "px";
			}
			if(flag.font) this.element.style.fontFamily = this.font;
			if(flag.size) this.element.style.fontSize = this.size + "px";
			if(flag.bold) if(this.bold) this.element.style.fontWeight = "bold"; else this.element.style.fontWeight = "normal";
			if(flag.italic) if(this.italic) this.element.style.fontStyle = "italic"; else this.element.style.fontStyle = "normal";
			if(flag.letterSpacing) this.element.style.letterSpacing = this.letterSpacing + "px";
			if(flag.align) this.element.style.textAlign = this.align;
			if(flag.color) this.element.style.color = mui.display.Color.toRGBAStyle(this.color,1);
			if(flag.transform) if(this.transform == mui.display.TextTransform.None) this.element.style.textTransform = null; else this.element.style.textTransform = Std.string(this.transform).toLowerCase();
		}
		if(flag.width || flag.height || flag.autoSize || flag.multiline || flag.wrap) {
			if(this.autoSize && !(this.multiline && this.wrap)) this.element.style.width = null; else this.element.style.width = this.get_width() + "px";
			if(this.autoSize || !this.multiline) this.element.style.height = null; else this.element.style.height = this.get_height() + "px";
			this.sizeDirty = true;
		}
		if(this.sizeDirty) this.validateSize();
	}
	,addChildAt: function(child,index) {
		throw "You can not add children to text fields.";
	}
	,validateSize: function() {
		this.sizeDirty = false;
		if(!(this.autoSize && !this.wrap) && !(this.autoSize || !this.multiline)) return;
		var parentNode = null;
		var nextSibling = null;
		var offDOM = this.element.clientWidth == 0 && this.element.innerHTML != "";
		if(offDOM) {
			parentNode = this.element.parentNode;
			nextSibling = this.element.nextSibling;
			window.document.body.appendChild(this.element);
		}
		if(this.autoSize && !this.wrap) this.set_width(this.element.clientWidth);
		if(this.autoSize || !this.multiline) this.set_height(this.element.clientHeight);
		if(offDOM) {
			if(parentNode != null) parentNode.insertBefore(this.element,nextSibling); else window.document.body.removeChild(this.element);
		}
		if(!this.hasAttemptedRevalidation && (this.value != "" && this.get_width() < this.size)) {
			this.hasAttemptedRevalidation = true;
			mui.Lib.frameEntered.addOnce($bind(this,this.validateSize));
		}
	}
	,__class__: mui.display.Text
	,__properties__: $extend(mui.display.Rectangle.prototype.__properties__,{set_selectable:"set_selectable",set_bold:"set_bold",set_italic:"set_italic",set_letterSpacing:"set_letterSpacing",set_leading:"set_leading",set_html:"set_html",set_color:"set_color",set_size:"set_size",set_wrap:"set_wrap",set_multiline:"set_multiline",set_autoSize:"set_autoSize",set_font:"set_font",set_transform:"set_transform",set_align:"set_align",set_value:"set_value"})
});
mui.display.VirtualDisplay = function() {
	mui.display.Display.call(this);
	this.visibleChildren = new haxe.ds.IntMap();
	null;
};
mui.display.VirtualDisplay.__name__ = ["mui","display","VirtualDisplay"];
mui.display.VirtualDisplay.__super__ = mui.display.Display;
mui.display.VirtualDisplay.prototype = $extend(mui.display.Display.prototype,{
	addChildAt: function(child,index) {
	}
	,removeChild: function(child) {
	}
	,removeChildAt: function(index) {
	}
	,populate: function(numChildren) {
		this.numChildren = numChildren;
		this.invalidateProperty("children");
	}
	,removeChildren: function() {
		var $it0 = this.visibleChildren.keys();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			this.releaseChildAt(i);
		}
		this.populate(0);
		this.visibleChildren = new haxe.ds.IntMap();
	}
	,getChildIndex: function(child) {
		return child.index;
	}
	,getChildAt: function(index) {
		if(index < 0 || index > this.numChildren - 1) return mui.display.Display.prototype.getChildAt.call(this,index);
		if(this.visibleChildren.exists(index)) return this.visibleChildren.get(index);
		var child = this.requestChild(index);
		this.visibleChildren.set(index,child);
		this.addVirtualChildAt(child,index);
		return child;
	}
	,releaseChildAt: function(index) {
		if(!this.visibleChildren.exists(index)) return false;
		var child = this.visibleChildren.get(index);
		if(!this.releaseChild(child)) return false;
		this.visibleChildren.remove(index);
		this.removeVirtualChildAt(child,index);
		return true;
	}
	,addVirtualChildAt: function(child,index) {
		this.scrollElement.appendChild(child.element);
		this.changed.add($bind(child,child.parentChange));
		child.parent = child.changeValue("parent",this);
		child.index = child.changeValue("index",index);
	}
	,removeVirtualChildAt: function(child,index) {
		this.scrollElement.removeChild(child.element);
		this.changed.remove($bind(child,child.parentChange));
		child.parent = child.changeValue("parent",null);
		child.index = child.changeValue("index",-1);
	}
	,iterator: function() {
		return this.visibleChildren.iterator();
	}
	,__class__: mui.display.VirtualDisplay
});
mui.event = {};
mui.event.Focus = function() { };
mui.event.Focus.__name__ = ["mui","event","Focus"];
mui.event.Focus.__properties__ = {set_current:"set_current"}
mui.event.Focus.set_current = function(value) {
	if(value == mui.event.Focus.current) return mui.event.Focus.current;
	if(mui.event.Focus.current != null) mui.event.Focus.current.focusOut(null);
	mui.event.Focus.current = value;
	if(mui.event.Focus.current != null) mui.event.Focus.current.focusIn(null);
	mui.event.Focus.changed.dispatch(mui.event.Focus.current);
	return value;
};
mui.event.Input = function() {
	this.bubbles = true;
	this.captured = new msignal.Signal1(mui.event.Input);
	this.updated = new msignal.Signal1(mui.event.Input);
	this.completed = new msignal.Signal1(mui.event.Input);
	this.isCaptured = false;
};
mui.event.Input.__name__ = ["mui","event","Input"];
mui.event.Input.setMode = function(value) {
	if(value == mui.event.Input.mode) return;
	mui.event.Input.mode = value;
	mui.event.Input.modeChanged.dispatch();
};
mui.event.Input.prototype = {
	capture: function() {
		if(this.isCaptured) return;
		this.isCaptured = true;
		this.captured.dispatch(this);
	}
	,update: function() {
		this.updated.dispatch(this);
	}
	,complete: function() {
		this.completed.dispatch(this);
		this.captured.removeAll();
		this.updated.removeAll();
		this.completed.removeAll();
	}
	,__class__: mui.event.Input
};
mui.event.InputMode = { __ename__ : ["mui","event","InputMode"], __constructs__ : ["TOUCH","KEY"] };
mui.event.InputMode.TOUCH = ["TOUCH",0];
mui.event.InputMode.TOUCH.toString = $estr;
mui.event.InputMode.TOUCH.__enum__ = mui.event.InputMode;
mui.event.InputMode.KEY = ["KEY",1];
mui.event.InputMode.KEY.toString = $estr;
mui.event.InputMode.KEY.__enum__ = mui.event.InputMode;
mui.event.KeyAction = { __ename__ : ["mui","event","KeyAction"], __constructs__ : ["UNKNOWN","LEFT","RIGHT","UP","DOWN","NEXT","PREVIOUS","OK","HOME","BACK","DEBUG","INFORMATION","GUIDE","EXIT","FAST_FORWARD","FAST_BACKWARD","SKIP_FORWARD","SKIP_BACKWARD","PLAY_PAUSE","PLAY","PAUSE","STOP","RECORD","SPACE","RED","GREEN","YELLOW","BLUE","CHANNEL_UP","CHANNEL_DOWN","VOLUME_UP","VOLUME_DOWN","VOLUME_MUTE","NUMBER"] };
mui.event.KeyAction.UNKNOWN = ["UNKNOWN",0];
mui.event.KeyAction.UNKNOWN.toString = $estr;
mui.event.KeyAction.UNKNOWN.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.LEFT = ["LEFT",1];
mui.event.KeyAction.LEFT.toString = $estr;
mui.event.KeyAction.LEFT.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.RIGHT = ["RIGHT",2];
mui.event.KeyAction.RIGHT.toString = $estr;
mui.event.KeyAction.RIGHT.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.UP = ["UP",3];
mui.event.KeyAction.UP.toString = $estr;
mui.event.KeyAction.UP.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.DOWN = ["DOWN",4];
mui.event.KeyAction.DOWN.toString = $estr;
mui.event.KeyAction.DOWN.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.NEXT = ["NEXT",5];
mui.event.KeyAction.NEXT.toString = $estr;
mui.event.KeyAction.NEXT.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.PREVIOUS = ["PREVIOUS",6];
mui.event.KeyAction.PREVIOUS.toString = $estr;
mui.event.KeyAction.PREVIOUS.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.OK = ["OK",7];
mui.event.KeyAction.OK.toString = $estr;
mui.event.KeyAction.OK.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.HOME = ["HOME",8];
mui.event.KeyAction.HOME.toString = $estr;
mui.event.KeyAction.HOME.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.BACK = ["BACK",9];
mui.event.KeyAction.BACK.toString = $estr;
mui.event.KeyAction.BACK.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.DEBUG = ["DEBUG",10];
mui.event.KeyAction.DEBUG.toString = $estr;
mui.event.KeyAction.DEBUG.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.INFORMATION = ["INFORMATION",11];
mui.event.KeyAction.INFORMATION.toString = $estr;
mui.event.KeyAction.INFORMATION.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.GUIDE = ["GUIDE",12];
mui.event.KeyAction.GUIDE.toString = $estr;
mui.event.KeyAction.GUIDE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.EXIT = ["EXIT",13];
mui.event.KeyAction.EXIT.toString = $estr;
mui.event.KeyAction.EXIT.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.FAST_FORWARD = ["FAST_FORWARD",14];
mui.event.KeyAction.FAST_FORWARD.toString = $estr;
mui.event.KeyAction.FAST_FORWARD.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.FAST_BACKWARD = ["FAST_BACKWARD",15];
mui.event.KeyAction.FAST_BACKWARD.toString = $estr;
mui.event.KeyAction.FAST_BACKWARD.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.SKIP_FORWARD = ["SKIP_FORWARD",16];
mui.event.KeyAction.SKIP_FORWARD.toString = $estr;
mui.event.KeyAction.SKIP_FORWARD.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.SKIP_BACKWARD = ["SKIP_BACKWARD",17];
mui.event.KeyAction.SKIP_BACKWARD.toString = $estr;
mui.event.KeyAction.SKIP_BACKWARD.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.PLAY_PAUSE = ["PLAY_PAUSE",18];
mui.event.KeyAction.PLAY_PAUSE.toString = $estr;
mui.event.KeyAction.PLAY_PAUSE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.PLAY = ["PLAY",19];
mui.event.KeyAction.PLAY.toString = $estr;
mui.event.KeyAction.PLAY.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.PAUSE = ["PAUSE",20];
mui.event.KeyAction.PAUSE.toString = $estr;
mui.event.KeyAction.PAUSE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.STOP = ["STOP",21];
mui.event.KeyAction.STOP.toString = $estr;
mui.event.KeyAction.STOP.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.RECORD = ["RECORD",22];
mui.event.KeyAction.RECORD.toString = $estr;
mui.event.KeyAction.RECORD.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.SPACE = ["SPACE",23];
mui.event.KeyAction.SPACE.toString = $estr;
mui.event.KeyAction.SPACE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.RED = ["RED",24];
mui.event.KeyAction.RED.toString = $estr;
mui.event.KeyAction.RED.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.GREEN = ["GREEN",25];
mui.event.KeyAction.GREEN.toString = $estr;
mui.event.KeyAction.GREEN.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.YELLOW = ["YELLOW",26];
mui.event.KeyAction.YELLOW.toString = $estr;
mui.event.KeyAction.YELLOW.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.BLUE = ["BLUE",27];
mui.event.KeyAction.BLUE.toString = $estr;
mui.event.KeyAction.BLUE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.CHANNEL_UP = ["CHANNEL_UP",28];
mui.event.KeyAction.CHANNEL_UP.toString = $estr;
mui.event.KeyAction.CHANNEL_UP.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.CHANNEL_DOWN = ["CHANNEL_DOWN",29];
mui.event.KeyAction.CHANNEL_DOWN.toString = $estr;
mui.event.KeyAction.CHANNEL_DOWN.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.VOLUME_UP = ["VOLUME_UP",30];
mui.event.KeyAction.VOLUME_UP.toString = $estr;
mui.event.KeyAction.VOLUME_UP.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.VOLUME_DOWN = ["VOLUME_DOWN",31];
mui.event.KeyAction.VOLUME_DOWN.toString = $estr;
mui.event.KeyAction.VOLUME_DOWN.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.VOLUME_MUTE = ["VOLUME_MUTE",32];
mui.event.KeyAction.VOLUME_MUTE.toString = $estr;
mui.event.KeyAction.VOLUME_MUTE.__enum__ = mui.event.KeyAction;
mui.event.KeyAction.NUMBER = function(n) { var $x = ["NUMBER",33,n]; $x.__enum__ = mui.event.KeyAction; $x.toString = $estr; return $x; };
mui.event.KeyManager = function() {
	this.held = false;
	this.pressedKeys = new haxe.ds.IntMap();
	this.holdDelay = 600;
	this.holdInterval = 200;
	this.pressed = new msignal.Signal1(mui.event.Key);
	this.released = new msignal.Signal1(mui.event.Key);
};
mui.event.KeyManager.__name__ = ["mui","event","KeyManager"];
mui.event.KeyManager.prototype = {
	isDown: function(keyCode) {
		return this.pressedKeys.exists(keyCode);
	}
	,press: function(key) {
		mui.event.KeyManager.realPressCount++;
		this.lastPressEventTime = haxe.Timer.stamp();
		if(this.currentKey != null) {
			if(key.code != this.currentKey.code) this.release(this.currentKey);
		}
		if(this.currentKey != null) return;
		this.held = false;
		this.currentKey = key;
		this.pressedKeys.set(key.code,true);
		this.pressCount = 0;
		this.dispatchPress(key);
		mui.event.KeyManager.previousPressCount = mui.event.KeyManager.realPressCount;
		mui.core.Node.validator.validate();
	}
	,dispatchPress: function(key) {
		this.pressCount += 1;
		this.held = this.pressCount > 1;
		key.pressCount = this.pressCount;
		key.isCaptured = false;
		mui.event.Input.setMode(mui.event.InputMode.KEY);
		this.pressed.dispatch(key);
		if(mui.event.Focus.current != null) {
		}
		this.resetTimer();
		if(mui.event.KeyManager.realPressCount > mui.event.KeyManager.previousPressCount) {
			var delay;
			if(this.pressCount == 1) delay = this.holdDelay; else delay = this.holdInterval;
			this.timer = haxe.Timer.delay((function(f,a1) {
				return function() {
					return f(a1);
				};
			})($bind(this,this.dispatchPress),key),delay);
		}
	}
	,release: function(key) {
		if(this.currentKey != null && key.code == this.currentKey.code) {
			this.dispatchRelease(key);
			mui.core.Node.validator.validate();
		}
	}
	,dispatchRelease: function(key) {
		this.held = false;
		this.currentKey = null;
		this.pressedKeys.remove(key.code);
		this.pressCount = 0;
		this.released.dispatch(key);
		if(mui.event.Focus.current != null) {
		}
		this.resetTimer();
	}
	,set_map: function(value) {
		if(!(value != null)) throw "Assertion failed: " + "argument `value` cannot be `null`";
		this.map = value;
		return this.map;
	}
	,resetTimer: function() {
		if(this.timer != null) {
			this.timer.stop();
			this.timer = null;
		}
	}
	,__class__: mui.event.KeyManager
	,__properties__: {set_map:"set_map"}
};
mui.event.Key = function(keyCode,keyAction) {
	mui.event.Input.call(this);
	this.code = keyCode;
	this.keyAction = keyAction;
	this.pressCount = 0;
};
mui.event.Key.__name__ = ["mui","event","Key"];
mui.event.Key.__properties__ = {get_released:"get_released",get_pressed:"get_pressed",get_map:"get_map",get_held:"get_held"}
mui.event.Key.get_held = function() {
	return mui.event.Key.manager.held;
};
mui.event.Key.get_map = function() {
	return mui.event.Key.manager.map;
};
mui.event.Key.get_pressed = function() {
	return mui.event.Key.manager.pressed;
};
mui.event.Key.get_released = function() {
	return mui.event.Key.manager.released;
};
mui.event.Key.isDown = function(keyCode) {
	return mui.event.Key.manager.isDown(keyCode);
};
mui.event.Key.press = function(key) {
	mui.event.Key.manager.press(key);
};
mui.event.Key.release = function(key) {
	mui.event.Key.manager.release(key);
};
mui.event.Key.__super__ = mui.event.Input;
mui.event.Key.prototype = $extend(mui.event.Input.prototype,{
	get_action: function() {
		if(this.keyAction != null) return this.keyAction;
		return mui.event.Key.manager.map.get(this.code);
	}
	,toString: function() {
		return "Key[" + this.code + ", " + Std.string(this.get_action()) + "]x" + this.pressCount;
	}
	,__class__: mui.event.Key
	,__properties__: {get_action:"get_action"}
});
mui.event.KeyMapBase = function() {
	this.map = new haxe.ds.IntMap();
};
mui.event.KeyMapBase.__name__ = ["mui","event","KeyMapBase"];
mui.event.KeyMapBase.prototype = {
	clear: function() {
		this.map = new haxe.ds.IntMap();
	}
	,set: function(keyCode,action) {
		this.map.set(keyCode,action);
	}
	,get: function(keyCode) {
		if(this.map.exists(keyCode)) return this.map.get(keyCode);
		return mui.event.KeyAction.UNKNOWN;
	}
	,remove: function(keyCode) {
		this.map.remove(keyCode);
	}
	,__class__: mui.event.KeyMapBase
};
mui.event.KeyMap = function() {
	mui.event.KeyMapBase.call(this);
	this.set(37,mui.event.KeyAction.LEFT);
	this.set(39,mui.event.KeyAction.RIGHT);
	this.set(38,mui.event.KeyAction.UP);
	this.set(40,mui.event.KeyAction.DOWN);
	this.set(13,mui.event.KeyAction.OK);
	this.set(8,mui.event.KeyAction.BACK);
	this.set(32,mui.event.KeyAction.SPACE);
	this.set(190,mui.event.KeyAction.DEBUG);
	this.set(82,mui.event.KeyAction.RED);
	this.set(71,mui.event.KeyAction.GREEN);
	this.set(89,mui.event.KeyAction.YELLOW);
	this.set(66,mui.event.KeyAction.BLUE);
	this.set(48,mui.event.KeyAction.NUMBER(0));
	this.set(49,mui.event.KeyAction.NUMBER(1));
	this.set(50,mui.event.KeyAction.NUMBER(2));
	this.set(51,mui.event.KeyAction.NUMBER(3));
	this.set(52,mui.event.KeyAction.NUMBER(4));
	this.set(53,mui.event.KeyAction.NUMBER(5));
	this.set(54,mui.event.KeyAction.NUMBER(6));
	this.set(55,mui.event.KeyAction.NUMBER(7));
	this.set(56,mui.event.KeyAction.NUMBER(8));
	this.set(57,mui.event.KeyAction.NUMBER(9));
};
mui.event.KeyMap.__name__ = ["mui","event","KeyMap"];
mui.event.KeyMap.__super__ = mui.event.KeyMapBase;
mui.event.KeyMap.prototype = $extend(mui.event.KeyMapBase.prototype,{
	__class__: mui.event.KeyMap
});
mui.event.ScreenOrientation = { __ename__ : ["mui","event","ScreenOrientation"], __constructs__ : ["OrientationUnknown","LandscapeLeft","LandscapeRight","Portrait","PortraitUpsideDown"] };
mui.event.ScreenOrientation.OrientationUnknown = ["OrientationUnknown",0];
mui.event.ScreenOrientation.OrientationUnknown.toString = $estr;
mui.event.ScreenOrientation.OrientationUnknown.__enum__ = mui.event.ScreenOrientation;
mui.event.ScreenOrientation.LandscapeLeft = ["LandscapeLeft",1];
mui.event.ScreenOrientation.LandscapeLeft.toString = $estr;
mui.event.ScreenOrientation.LandscapeLeft.__enum__ = mui.event.ScreenOrientation;
mui.event.ScreenOrientation.LandscapeRight = ["LandscapeRight",2];
mui.event.ScreenOrientation.LandscapeRight.toString = $estr;
mui.event.ScreenOrientation.LandscapeRight.__enum__ = mui.event.ScreenOrientation;
mui.event.ScreenOrientation.Portrait = ["Portrait",3];
mui.event.ScreenOrientation.Portrait.toString = $estr;
mui.event.ScreenOrientation.Portrait.__enum__ = mui.event.ScreenOrientation;
mui.event.ScreenOrientation.PortraitUpsideDown = ["PortraitUpsideDown",4];
mui.event.ScreenOrientation.PortraitUpsideDown.toString = $estr;
mui.event.ScreenOrientation.PortraitUpsideDown.__enum__ = mui.event.ScreenOrientation;
mui.event.Screen = function() {
	this.width = 800;
	this.height = 600;
	this.orientation = mui.event.ScreenOrientation.Portrait;
};
mui.event.Screen.__name__ = ["mui","event","Screen"];
mui.event.Screen.resize = function(width,height) {
	mui.event.Screen.primary.width = width;
	mui.event.Screen.primary.height = height;
	mui.event.Screen.resized.dispatch(mui.event.Screen.primary);
};
mui.event.Screen.reorient = function(orientation) {
	mui.event.Screen.primary.orientation = orientation;
	mui.event.Screen.reoriented.dispatch(mui.event.Screen.primary);
};
mui.event.Screen.isLandscape = function() {
	return mui.event.Screen.primary.orientation == mui.event.ScreenOrientation.LandscapeLeft || mui.event.Screen.primary.orientation == mui.event.ScreenOrientation.LandscapeRight;
};
mui.event.Screen.prototype = {
	__class__: mui.event.Screen
};
mui.event.Touch = function(x,y) {
	mui.event.Input.call(this);
	this.startX = this.previousX = this.currentX = x;
	this.startY = this.previousY = this.currentY = y;
};
mui.event.Touch.__name__ = ["mui","event","Touch"];
mui.event.Touch.start = function(touch) {
	mui.event.Input.setMode(mui.event.InputMode.TOUCH);
	mui.event.Touch.started.dispatch(touch);
	mui.core.Node.validator.validate();
};
mui.event.Touch.__super__ = mui.event.Input;
mui.event.Touch.prototype = $extend(mui.event.Input.prototype,{
	updatePosition: function(x,y) {
		this.previousX = this.currentX;
		this.previousY = this.currentY;
		this.currentX = x;
		this.currentY = y;
		this.update();
	}
	,complete: function() {
		mui.event.Input.prototype.complete.call(this);
		mui.core.Node.validator.validate();
	}
	,get_changeX: function() {
		return this.currentX - this.previousX;
	}
	,get_changeY: function() {
		return this.currentY - this.previousY;
	}
	,get_totalChangeX: function() {
		return this.currentX - this.startX;
	}
	,get_totalChangeY: function() {
		return this.currentY - this.startY;
	}
	,__class__: mui.event.Touch
	,__properties__: {get_totalChangeY:"get_totalChangeY",get_totalChangeX:"get_totalChangeX",get_changeY:"get_changeY",get_changeX:"get_changeX"}
});
mui.layout = {};
mui.layout.AbstractLayout = function() {
	mui.core.Behavior.call(this);
	this.set_circular(false);
	this.reset();
	null;
};
mui.layout.AbstractLayout.__name__ = ["mui","layout","AbstractLayout"];
mui.layout.AbstractLayout.__super__ = mui.core.Behavior;
mui.layout.AbstractLayout.prototype = $extend(mui.core.Behavior.prototype,{
	add: function() {
		this.virtual = js.Boot.__instanceof(this.target,mui.display.VirtualDisplay);
		this.reset();
	}
	,update: function(flag) {
		if(flag.children || flag.layout || flag.width || flag.height) {
			this.invalidateProperty("target");
			this.reset();
		}
		if((this.circular || this.virtual) && flag.scrollX || flag.scrollY) this.invalidateProperty("target");
	}
	,change: function(flag) {
		if(!this.enabled || this.target == null) return;
		if(flag.cellWidth || flag.cellHeight || flag.vertical) this.reset(); else if(flag.spacingX || flag.spacingY || flag.paddingLeft || flag.paddingTop || flag.paddingRight || flag.paddingBottom) this.validIndex = -1;
		if(flag.target || flag.cellAlignX || flag.cellAlignY || this.validIndex == -1) {
			if(this.target.numChildren > 0) {
				if(this.virtual) this.layoutVirtual(); else this.layout();
			}
		}
	}
	,reset: function() {
		this.validIndex = -1;
		this.cells = [];
		if(this.virtual) this.measureVirtual();
	}
	,layoutFirst: function(cell) {
	}
	,layoutNext: function(cell,previous) {
	}
	,isVisible: function(cell) {
		return true;
	}
	,isFirst: function(cell) {
		return false;
	}
	,isLast: function(cell) {
		return false;
	}
	,updateDisplay: function(display,cell) {
	}
	,updateCell: function(cell) {
	}
	,measureLayout: function() {
	}
	,measureVirtual: function() {
	}
	,resizeDisplay: function(index) {
	}
	,layout: function() {
		var _g1 = 0;
		var _g = this.target.numChildren;
		while(_g1 < _g) {
			var index = _g1++;
			this.layoutDisplay(index);
		}
	}
	,layoutVirtual: function() {
		var first = this.target.numChildren;
		var nextFirst = first;
		var last = -1;
		var $it0 = this.target.iterator();
		while( $it0.hasNext() ) {
			var display = $it0.next();
			var index = display.index;
			var cell = this.getCell(index);
			if(this.isVisible(cell)) {
				if(index < first) first = index;
				if(index > first && index < nextFirst) nextFirst = index;
				if(index > last) last = index;
				this.updateDisplay(display,cell);
			} else this.releaseDisplay(index);
		}
		if(nextFirst != this.target.numChildren && nextFirst - first > 1) first = nextFirst;
		if(first == this.target.numChildren) first = last = 0;
		var firstCell = this.getCell(first);
		if(!this.isVisible(firstCell)) return;
		while(!this.isFirst(firstCell)) {
			first = this.previousIndex(first);
			if(first == -1) break;
			firstCell = this.getCell(first);
			this.layoutDisplay(first);
		}
		var lastCell = this.getCell(last);
		while(!this.isLast(lastCell)) {
			last = this.nextIndex(last);
			if(last == -1) break;
			lastCell = this.getCell(last);
			this.layoutDisplay(last);
		}
	}
	,layoutDisplay: function(index) {
		var cell = this.getCell(index);
		var display = this.requestDisplay(index);
		this.updateDisplay(display,cell);
	}
	,getCell: function(index) {
		var cell = this.requestCell(index);
		if(index <= this.validIndex) return cell;
		if(index == 0) this.layoutFirst(cell); else {
			var previous = this.getCell(index - 1);
			this.layoutNext(cell,previous);
		}
		if(index > this.validIndex) this.validIndex = index;
		if(index == this.target.numChildren - 1) this.measureLayout();
		return cell;
	}
	,requestCell: function(index) {
		if(this.cells[index] == null) return this.cells[index] = this.createCell(index); else return this.cells[index];
	}
	,createCell: function(index) {
		var cell = new mui.layout.Cell(index);
		this.updateCell(cell);
		return cell;
	}
	,requestDisplay: function(index) {
		return this.target.getChildAt(index);
	}
	,releaseDisplay: function(index) {
		this.target.releaseChildAt(index);
	}
	,next: function(index,direction) {
		return -1;
	}
	,nextIndex: function(index) {
		if(index < this.target.numChildren - 1) return index + 1; else if(this.circular) return 0; else return -1;
	}
	,previousIndex: function(index) {
		if(index > 0) return index - 1; else if(this.circular) return this.target.numChildren - 1; else return -1;
	}
	,set_circular: function(v) {
		return this.circular = this.changeValue("circular",v);
	}
	,__class__: mui.layout.AbstractLayout
	,__properties__: $extend(mui.core.Behavior.prototype.__properties__,{set_circular:"set_circular"})
});
mui.layout.AlignX = { __ename__ : ["mui","layout","AlignX"], __constructs__ : ["left","center","right"] };
mui.layout.AlignX.left = ["left",0];
mui.layout.AlignX.left.toString = $estr;
mui.layout.AlignX.left.__enum__ = mui.layout.AlignX;
mui.layout.AlignX.center = ["center",1];
mui.layout.AlignX.center.toString = $estr;
mui.layout.AlignX.center.__enum__ = mui.layout.AlignX;
mui.layout.AlignX.right = ["right",2];
mui.layout.AlignX.right.toString = $estr;
mui.layout.AlignX.right.__enum__ = mui.layout.AlignX;
mui.layout.AlignY = { __ename__ : ["mui","layout","AlignY"], __constructs__ : ["top","middle","bottom"] };
mui.layout.AlignY.top = ["top",0];
mui.layout.AlignY.top.toString = $estr;
mui.layout.AlignY.top.__enum__ = mui.layout.AlignY;
mui.layout.AlignY.middle = ["middle",1];
mui.layout.AlignY.middle.toString = $estr;
mui.layout.AlignY.middle.__enum__ = mui.layout.AlignY;
mui.layout.AlignY.bottom = ["bottom",2];
mui.layout.AlignY.bottom.toString = $estr;
mui.layout.AlignY.bottom.__enum__ = mui.layout.AlignY;
mui.layout.Cell = function(index) {
	this.index = index;
	this.x = this.y = this.width = this.height = 0;
};
mui.layout.Cell.__name__ = ["mui","layout","Cell"];
mui.layout.Cell.prototype = {
	right: function() {
		return this.x + this.width;
	}
	,bottom: function() {
		return this.y + this.height;
	}
	,clone: function() {
		var cell = new mui.layout.Cell(this.index);
		cell.x = this.x;
		cell.y = this.y;
		cell.width = this.width;
		cell.height = this.height;
		return cell;
	}
	,__class__: mui.layout.Cell
};
mui.layout.Direction = { __ename__ : ["mui","layout","Direction"], __constructs__ : ["next","previous","up","down","left","right"] };
mui.layout.Direction.next = ["next",0];
mui.layout.Direction.next.toString = $estr;
mui.layout.Direction.next.__enum__ = mui.layout.Direction;
mui.layout.Direction.previous = ["previous",1];
mui.layout.Direction.previous.toString = $estr;
mui.layout.Direction.previous.__enum__ = mui.layout.Direction;
mui.layout.Direction.up = ["up",2];
mui.layout.Direction.up.toString = $estr;
mui.layout.Direction.up.__enum__ = mui.layout.Direction;
mui.layout.Direction.down = ["down",3];
mui.layout.Direction.down.toString = $estr;
mui.layout.Direction.down.__enum__ = mui.layout.Direction;
mui.layout.Direction.left = ["left",4];
mui.layout.Direction.left.toString = $estr;
mui.layout.Direction.left.__enum__ = mui.layout.Direction;
mui.layout.Direction.right = ["right",5];
mui.layout.Direction.right.toString = $estr;
mui.layout.Direction.right.__enum__ = mui.layout.Direction;
mui.layout.Layout = function() {
	mui.layout.AbstractLayout.call(this);
	this.set_cellWidth(this.set_cellHeight(null));
	this.set_vertical(true);
	this.set_paddingLeft(this.set_paddingRight(this.set_paddingTop(this.set_paddingBottom(this.set_spacingX(this.set_spacingY(0))))));
	this.set_cellAlignX(this.set_cellAlignY(0));
	null;
};
mui.layout.Layout.__name__ = ["mui","layout","Layout"];
mui.layout.Layout.__super__ = mui.layout.AbstractLayout;
mui.layout.Layout.prototype = $extend(mui.layout.AbstractLayout.prototype,{
	layoutFirst: function(cell) {
		cell.x = this.paddingLeft;
		cell.y = this.paddingTop;
	}
	,layoutNext: function(cell,previous) {
		if(this.vertical) {
			cell.y = previous.y + previous.height + this.spacingY;
			cell.x = previous.x;
		} else {
			cell.x = previous.x + previous.width + this.spacingX;
			cell.y = previous.y;
		}
	}
	,isVisible: function(cell) {
		if(this.vertical) return cell.y + cell.height > this.target.get_scrollY() && cell.y < this.target.get_scrollY() + this.target.get_height(); else return cell.x + cell.width > this.target.get_scrollX() && cell.x < this.target.get_scrollX() + this.target.get_width();
	}
	,isFirst: function(cell) {
		if(this.vertical) return cell.y - this.spacingY <= this.target.get_scrollY(); else return cell.x - this.spacingX <= this.target.get_scrollX();
	}
	,isLast: function(cell) {
		if(this.vertical) return cell.y + cell.height + this.spacingY >= this.target.get_scrollY() + this.target.get_height(); else return cell.x + cell.width + this.spacingX >= this.target.get_scrollX() + this.target.get_width();
	}
	,updateCell: function(cell) {
		var index = cell.index;
		if(this.cellWidth == null) cell.width = Std["int"](this.requestDisplay(index).get_width()); else cell.width = this.cellWidth;
		if(this.cellHeight == null) cell.height = Std["int"](this.requestDisplay(index).get_height()); else cell.height = this.cellHeight;
	}
	,updateDisplay: function(display,cell) {
		display.set_x(cell.x + Math.round((cell.width - display.get_width()) * this.cellAlignX));
		display.set_y(cell.y + Math.round((cell.height - display.get_height()) * this.cellAlignY));
	}
	,resizeDisplay: function(index) {
		if(this.cellWidth != null && this.cellHeight != null) {
			if(this.cellAlignX != 0 || this.cellAlignY != 0) this.updateDisplay(this.requestDisplay(index),this.requestCell(index));
			return;
		}
		var update = this.cells[index] != null;
		var cell = this.requestCell(index);
		if(update) this.updateCell(cell);
		if(index < this.validIndex) this.validIndex = index;
		if(index == this.target.numChildren - 1) this.measureLayout();
		this.invalidateProperty("target");
	}
	,next: function(index,direction) {
		var previous = this.previousIndex(index);
		var next = this.nextIndex(index);
		switch(direction[1]) {
		case 4:
			if(this.vertical) return -1; else return previous;
			break;
		case 5:
			if(this.vertical) return -1; else return next;
			break;
		case 2:
			if(this.vertical) return previous; else return -1;
			break;
		case 3:
			if(this.vertical) return next; else return -1;
			break;
		case 1:
			return previous;
		case 0:
			return next;
		}
	}
	,measureLayout: function() {
		var cell = this.getCell(this.target.numChildren - 1);
		this.target.set_contentWidth(cell.x + cell.width + this.paddingRight);
		this.target.set_contentHeight(cell.y + cell.height + this.paddingBottom);
	}
	,measureVirtual: function() {
		if(this.vertical) {
			var w;
			if(this.cellWidth != null && this.target.numChildren > 0) w = this.cellWidth; else w = 0;
			this.target.set_contentWidth(this.paddingLeft + w + this.paddingRight);
			var h = 0;
			if(this.target.numChildren > 0) if(this.cellHeight == null) h = 100000; else h = this.target.numChildren * (this.cellHeight + this.spacingY) - this.spacingY;
			this.target.set_contentHeight(this.paddingTop + h + this.paddingBottom);
		} else {
			var w1 = 0;
			if(this.target.numChildren > 0) if(this.cellWidth == null) w1 = 100000; else w1 = this.target.numChildren * (this.cellWidth + this.spacingX) - this.spacingX;
			this.target.set_contentWidth(this.paddingLeft + w1 + this.paddingRight);
			var h1;
			if(this.cellHeight != null && this.target.numChildren > 0) h1 = this.cellHeight; else h1 = 0;
			this.target.set_contentHeight(this.paddingTop + h1 + this.paddingBottom);
		}
	}
	,set_vertical: function(v) {
		return this.vertical = this.changeValue("vertical",v);
	}
	,set_padding: function(v) {
		return this.set_paddingBottom(this.set_paddingTop(this.set_paddingRight(this.set_paddingLeft(this.padding = v))));
	}
	,set_paddingLeft: function(v) {
		return this.paddingLeft = this.changeValue("paddingLeft",v);
	}
	,set_paddingRight: function(v) {
		return this.paddingRight = this.changeValue("paddingRight",v);
	}
	,set_paddingTop: function(v) {
		return this.paddingTop = this.changeValue("paddingTop",v);
	}
	,set_paddingBottom: function(v) {
		return this.paddingBottom = this.changeValue("paddingBottom",v);
	}
	,set_spacing: function(v) {
		return this.set_spacingY(this.set_spacingX(this.spacing = v));
	}
	,set_spacingX: function(v) {
		return this.spacingX = this.changeValue("spacingX",v);
	}
	,set_spacingY: function(v) {
		return this.spacingY = this.changeValue("spacingY",v);
	}
	,set_cellWidth: function(v) {
		return this.cellWidth = this.changeValue("cellWidth",v);
	}
	,set_cellHeight: function(v) {
		return this.cellHeight = this.changeValue("cellHeight",v);
	}
	,set_cellAlignX: function(v) {
		return this.cellAlignX = this.changeValue("cellAlignX",v);
	}
	,set_cellAlignY: function(v) {
		return this.cellAlignY = this.changeValue("cellAlignY",v);
	}
	,__class__: mui.layout.Layout
	,__properties__: $extend(mui.layout.AbstractLayout.prototype.__properties__,{set_cellAlignY:"set_cellAlignY",set_cellAlignX:"set_cellAlignX",set_cellHeight:"set_cellHeight",set_cellWidth:"set_cellWidth",set_spacingY:"set_spacingY",set_spacingX:"set_spacingX",set_spacing:"set_spacing",set_paddingBottom:"set_paddingBottom",set_paddingTop:"set_paddingTop",set_paddingRight:"set_paddingRight",set_paddingLeft:"set_paddingLeft",set_padding:"set_padding",set_vertical:"set_vertical"})
});
mui.transition = {};
mui.transition.Ease = function() { };
mui.transition.Ease.__name__ = ["mui","transition","Ease"];
mui.transition.Ease.none = function(t,b,c,d) {
	return c * t / d + b;
};
mui.transition.Ease.inQuad = function(t,b,c,d) {
	return c * (t /= d) * t + b;
};
mui.transition.Ease.outQuad = function(t,b,c,d) {
	return -c * (t /= d) * (t - 2) + b;
};
mui.transition.Ease.inOutQuad = function(t,b,c,d) {
	if((t /= d / 2) < 1) return c / 2 * t * t + b;
	return -c / 2 * (--t * (t - 2) - 1) + b;
};
mui.transition.Ease.inBounce = function(t,b,c,d) {
	return c - mui.transition.Ease.outBounce(d - t,0,c,d) + b;
};
mui.transition.Ease.outBounce = function(t,b,c,d) {
	if((t /= d) < 0.363636363636363646) return c * (7.5625 * t * t) + b; else if(t < 0.727272727272727293) return c * (7.5625 * (t -= 0.545454545454545414) * t + .75) + b; else if(t < 0.909090909090909061) return c * (7.5625 * (t -= 0.818181818181818232) * t + .9375) + b; else return c * (7.5625 * (t -= 0.954545454545454586) * t + .984375) + b;
};
mui.transition.Ease.inOutBounce = function(t,b,c,d) {
	if(t < d / 2) return mui.transition.Ease.inBounce(t * 2,0,c,d) * .5 + b;
	return mui.transition.Ease.outBounce(t * 2 - d,0,c,d) * .5 + c * .5 + b;
};
mui.transition.Ease.inCubic = function(t,b,c,d) {
	return c * (t /= d) * t * t + b;
};
mui.transition.Ease.outCubic = function(t,b,c,d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
};
mui.transition.Ease.inOutCubic = function(t,b,c,d) {
	if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	return c / 2 * ((t -= 2) * t * t + 2) + b;
};
mui.transition.TimeTween = function(target,properties,settings) {
	var sharedTargets = [];
	var _g = 0;
	var _g1 = mui.transition.TimeTween.tweens;
	while(_g < _g1.length) {
		var tween = _g1[_g];
		++_g;
		if(tween.target == target) sharedTargets.push(tween);
	}
	mui.transition.TimeTween.addTween(this);
	this.duration = mui.transition.TimeTween.defaultDuration;
	this.target = target;
	this.properties = properties;
	this.start = { };
	this.change = { };
	var _g2 = 0;
	var _g11 = Reflect.fields(properties);
	while(_g2 < _g11.length) {
		var property = _g11[_g2];
		++_g2;
		var i = sharedTargets.length;
		while(i-- > 0) {
			var tween1 = sharedTargets[i];
			if(Object.prototype.hasOwnProperty.call(tween1.properties,property)) {
				tween1.cancel();
				sharedTargets.splice(i,1);
			}
		}
		Reflect.setField(this.start,property,Std.parseFloat(Reflect.field(target,property)));
		Reflect.setField(this.change,property,Reflect.field(properties,property) - Reflect.field(target,property));
	}
	if(settings != null) {
		var _g3 = 0;
		var _g12 = Reflect.fields(settings);
		while(_g3 < _g12.length) {
			var property1 = _g12[_g3];
			++_g3;
			Reflect.setField(this,property1,Reflect.field(settings,property1));
		}
	}
	if(this.easing == null) this.easing = mui.transition.TimeTween.easeNone;
	if(this.frames != null) this.duration = Math.round(this.frames / mui.transition.TimeTween.fps * 1000);
	if(this.frame != null) this.delay = Math.round(-this.frame / mui.transition.TimeTween.fps * 1000);
	if(!(this.delay > 0)) this.delay = 0;
	this.startTime = new Date().getTime();
};
mui.transition.TimeTween.__name__ = ["mui","transition","TimeTween"];
mui.transition.TimeTween.easeNone = function(t,b,c,d) {
	return mui.transition.Ease.none(t,b,c,d);
};
mui.transition.TimeTween.easeInQuad = function(t,b,c,d) {
	return mui.transition.Ease.inQuad(t,b,c,d);
};
mui.transition.TimeTween.easeOutQuad = function(t,b,c,d) {
	return mui.transition.Ease.outQuad(t,b,c,d);
};
mui.transition.TimeTween.easeInOutQuad = function(t,b,c,d) {
	return mui.transition.Ease.inOutQuad(t,b,c,d);
};
mui.transition.TimeTween.easeInBounce = function(t,b,c,d) {
	return mui.transition.Ease.inBounce(t,b,c,d);
};
mui.transition.TimeTween.easeOutBounce = function(t,b,c,d) {
	return mui.transition.Ease.outBounce(t,b,c,d);
};
mui.transition.TimeTween.easeInOutBounce = function(t,b,c,d) {
	return mui.transition.Ease.inOutBounce(t,b,c,d);
};
mui.transition.TimeTween.easeInCubic = function(t,b,c,d) {
	return mui.transition.Ease.inCubic(t,b,c,d);
};
mui.transition.TimeTween.easeOutCubic = function(t,b,c,d) {
	return mui.transition.Ease.outCubic(t,b,c,d);
};
mui.transition.TimeTween.easeInOutCubic = function(t,b,c,d) {
	return mui.transition.Ease.inOutCubic(t,b,c,d);
};
mui.transition.TimeTween.getActiveTweens = function() {
	return mui.transition.TimeTween.tweens;
};
mui.transition.TimeTween.updateActiveTweens = function() {
	mui.transition.TimeTween.frameTime = haxe.Timer.stamp();
	var _g = 0;
	var _g1 = mui.transition.TimeTween.tweens;
	while(_g < _g1.length) {
		var tween = _g1[_g];
		++_g;
		tween.update();
	}
};
mui.transition.TimeTween.addTween = function(tween) {
	if(mui.transition.TimeTween.tweens.length == 0) mui.transition.TimeTween.renderFrame.add(mui.transition.TimeTween.updateActiveTweens);
	mui.transition.TimeTween.tweens.push(tween);
};
mui.transition.TimeTween.removeTween = function(tween) {
	HxOverrides.remove(mui.transition.TimeTween.tweens,tween);
	if(mui.transition.TimeTween.tweens.length == 0) mui.transition.TimeTween.renderFrame.remove(mui.transition.TimeTween.updateActiveTweens);
};
mui.transition.TimeTween.timeStamp = function() {
	return new Date().getTime();
};
mui.transition.TimeTween.prototype = {
	cancel: function() {
		this.stop();
		if(this.onCancelled != null) this.onCancelled();
	}
	,stop: function() {
		mui.transition.TimeTween.removeTween(this);
	}
	,update: function() {
		this.elapsedTime = new Date().getTime() - (this.startTime + this.delay);
		if(this.elapsedTime < 0) return;
		if(this.elapsedTime < this.duration) {
			var position = this.easing(this.elapsedTime,0,1,this.duration);
			var _g = 0;
			var _g1 = Reflect.fields(this.start);
			while(_g < _g1.length) {
				var property = _g1[_g];
				++_g;
				var value = Reflect.field(this.start,property) + Reflect.field(this.change,property) * position;
				Reflect.setProperty(this.target,property,value);
			}
			if(this.onUpdate != null) this.onUpdate();
		} else {
			var position1 = this.easing(this.duration,0,1,this.duration);
			var _g2 = 0;
			var _g11 = Reflect.fields(this.start);
			while(_g2 < _g11.length) {
				var property1 = _g11[_g2];
				++_g2;
				var value1 = Reflect.field(this.start,property1) + Reflect.field(this.change,property1) * position1;
				Reflect.setProperty(this.target,property1,value1);
			}
			this.stop();
			if(this.onComplete != null) {
				if(this.onCompleteParams != null) this.onComplete(this.onCompleteParams); else this.onComplete();
			}
		}
	}
	,__class__: mui.transition.TimeTween
};
mui.util.Assert = function() { };
mui.util.Assert.__name__ = ["mui","util","Assert"];
mui.util.Assert.that = function(expr,message) {
	if(!expr) throw "Assertion failed: " + message;
};
mui.util.Dispatcher = function() {
	this.listeners = [];
	this.listenersNeedCloning = false;
};
mui.util.Dispatcher.__name__ = ["mui","util","Dispatcher"];
mui.util.Dispatcher.prototype = {
	add: function(listener,type) {
		this.registerListener(listener,false,type);
	}
	,addOnce: function(listener,type) {
		this.registerListener(listener,true,type);
	}
	,remove: function(listener) {
		var index = -1;
		var _g1 = 0;
		var _g = this.listeners.length;
		while(_g1 < _g) {
			var i = _g1++;
			var info = this.listeners[i];
			if(Reflect.compareMethods(info.listener,listener)) {
				index = i;
				break;
			}
		}
		if(index == -1) return;
		if(this.listenersNeedCloning) {
			this.listeners = this.listeners.slice();
			this.listenersNeedCloning = false;
		}
		this.listeners.splice(index,1);
	}
	,removeAll: function() {
		this.listeners = [];
	}
	,dispatch: function(message,target) {
		if(this.listeners.length == 0) return false;
		this.listenersNeedCloning = true;
		var list = this.listeners;
		var handled = false;
		var _g1 = 0;
		var _g = list.length;
		while(_g1 < _g) {
			var i = _g1++;
			var info = list[i];
			var result = false;
			if(message != null && info.type != null) {
				if(js.Boot.__instanceof(message,info.type) || message == info.type) if(target != null) result = info.listener(message,target); else result = info.listener(message);
			} else if(target != null) result = info.listener(message,target); else if(message != null) result = info.listener(message); else result = info.listener();
			if(result == true) handled = true;
			if(info.once) this.remove(info.listener);
		}
		this.listenersNeedCloning = false;
		return handled;
	}
	,has: function(listener) {
		var _g = 0;
		var _g1 = this.listeners;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			if(Reflect.compareMethods(info.listener,listener)) return true;
		}
		return false;
	}
	,hasType: function(message) {
		var _g = 0;
		var _g1 = this.listeners;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			if(js.Boot.__instanceof(message,info.type) || message == info.type) return true;
		}
		return false;
	}
	,registerListener: function(listener,once,type) {
		if(this.listeners.length == 0) {
			this.listeners.push({ listener : listener, once : once, type : type});
			return;
		}
		var info = this.getListener(listener);
		if(info != null) {
			if(info.once && !once) throw "You cannot addOnce() then add() the same listener without removing the relationship first."; else if(!info.once && once) throw "You cannot add() then addOnce() the same listener without removing the relationship first.";
			return;
		}
		if(this.listenersNeedCloning) {
			this.listeners = this.listeners.slice();
			this.listenersNeedCloning = false;
		}
		this.listeners.push({ listener : listener, once : once, type : type});
	}
	,getListener: function(listener) {
		var _g = 0;
		var _g1 = this.listeners;
		while(_g < _g1.length) {
			var info = _g1[_g];
			++_g;
			if(Reflect.compareMethods(info.listener,listener)) return info;
		}
		return null;
	}
	,__class__: mui.util.Dispatcher
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
haxe.Resource.content = [];
msignal.SlotList.NIL = new msignal.SlotList(null,null);
JS.prefix = JS.detectPrefix();
JS.cache = new haxe.ds.StringMap();
JS.style = ((function($this) {
	var $r;
	var _this = window.document;
	$r = _this.createElement("div");
	return $r;
}(this))).style;
KeyboardConstants.ENTER = 13;
KeyboardConstants.PLAY = 71;
KeyboardConstants.LEFT = 37;
KeyboardConstants.UP = 38;
KeyboardConstants.RIGHT = 39;
KeyboardConstants.DOWN = 40;
KeyboardConstants.STOP = 70;
KeyboardConstants.PAUSE = 74;
KeyboardConstants.FF = 72;
KeyboardConstants.RW = 69;
mui.core.Node.validator = new mui.core.Validator();
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
mui.display.AssetDisplay.library = new mui.display.AssetLibrary();
components.Player.STOPPED = 0;
components.Player.PLAYING = 1;
components.Player.PAUSED = 2;
mconsole.ConsoleView.CONSOLE_STYLES = "#console {\n\tfont-family:monospace;\n\tbackground-color:#002B36;\n\tbackground-color:rgba(0%,16.9%,21.2%,0.95);\n\tpadding:8px;\n\theight:600px;\n\tmax-height:600px;\n\toverflow-y:scroll;\n\tposition:absolute;\n\tleft:0px;\n\ttop:0px;\n\tright:0px;\n\tmargin:0px;\n\tz-index:10000;\n}\n#console a { text-decoration:none; }\n#console a:hover div { background-color:#063642 }\n#console a div span { display:none; float:right; color:white; }\n#console a:hover div span { display:block; }";
mconsole.Console.defaultPrinter = new mconsole.ConsoleView();
mconsole.Console.printers = [mconsole.Console.defaultPrinter];
mconsole.Console.groupDepth = 0;
mconsole.Console.times = new haxe.ds.StringMap();
mconsole.Console.counts = new haxe.ds.StringMap();
mconsole.Console.running = false;
mconsole.Console.dirxml = "dirxml";
mconsole.Console.hasConsole = mconsole.Console.detectConsole();
mconsole.ConsoleMacro.__meta__ = { obj : { IgnoreCover : null}};
mconsole.StackHelper.filters = mconsole.StackHelper.createFilters();
mloader.LoaderQueue.DEFAULT_MAX_LOADING = 8;
mui.Lib.init = (function($this) {
	var $r;
	mconsole.Console.start();
	$r = true;
	return $r;
}(this));
mui.Lib.frameEntered = new msignal.Signal0();
mui.Lib.frameRendered = new msignal.Signal0();
mui.Lib.mouseMoved = new msignal.Signal0();
mui.core.Skin.NONE = new mui.core.Skin();
mui.display.DisplayRoot.DEFAULT_FRAME_RATE = 16;
mui.display.Text.ELLIPSE = "…";
mui.display.Text.NEWLINES = new EReg("\n","g");
mui.event.Focus.changed = new msignal.Signal1(mui.core.DataComponent);
mui.event.Input.modeChanged = new msignal.Signal0();
mui.event.KeyManager.DEFAULT_HOLD_DELAY = 600;
mui.event.KeyManager.DEFAULT_HOLD_INTERVAL = 200;
mui.event.KeyManager.previousPressCount = 0;
mui.event.KeyManager.realPressCount = 0;
mui.event.Key.manager = new mui.event.KeyManager();
mui.event.Screen.resized = new msignal.Signal1(mui.event.Screen);
mui.event.Screen.reoriented = new msignal.Signal1(mui.event.Screen);
mui.event.Screen.primary = new mui.event.Screen();
mui.event.Touch.started = new msignal.Signal1(mui.event.Touch);
mui.transition.TimeTween.defaultDuration = 500;
mui.transition.TimeTween.fps = 24;
mui.transition.TimeTween.renderFrame = mui.Lib.frameEntered;
mui.transition.TimeTween.tweens = new Array();
Main.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=app.js.map