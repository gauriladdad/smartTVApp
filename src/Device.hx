package;

@:expose
class Device
{
	static public var widgetAPI:Dynamic;
	static public var tvKey:Dynamic;

	static public function init() 
	{
		if (untyped __js__('typeof(Common) != "undefined"'))
		{
			widgetAPI = untyped __new__("Common.API.Widget");
			tvKey = untyped __new__("Common.API.TVKeyValue");
		}
		else {
			tvKey =  { };
			
		}
	}
	
	static public function ready() 
	{
		try {
			widgetAPI.sendReadyEvent();
		}
		catch (err:Dynamic) 
		{
			trace("failed to invoke widgetAPI sendReadyEvent: " + err);
		}
	}
	
}
