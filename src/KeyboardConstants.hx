package;

class KeyboardConstants
{
	#if browser
	inline public static var ENTER = 13;
	inline public static var PLAY = 71;
	inline public static var LEFT = 37;
	inline public static var UP = 38;
	inline public static var RIGHT = 39;
	inline public static var DOWN = 40;
	inline public static var STOP = 70;
	inline public static var PAUSE = 74;
	inline public static var FF = 72;
	inline public static var RW = 69;
	#elseif samsung
	inline public static var ENTER = 29443;
	inline public static var PLAY = 71;
	inline public static var LEFT = 4;
	inline public static var UP = 29460;
	inline public static var RIGHT = 5;
	inline public static var DOWN = 29461;
	inline public static var STOP = 70;
	inline public static var PAUSE = 74;
	inline public static var FF = 72;
	inline public static var RW = 69;
	#end
}
