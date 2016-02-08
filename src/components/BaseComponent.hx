package components;
import js.Browser;
import js.html.DivElement;

class BaseComponent
{
	public var view:DivElement;
	
	public function new() 
	{
		createView();
		createChildren();
	}
	
	function createView() 
	{
		var doc = Browser.document;
		view = doc.createDivElement();
	}
	
	function createChildren()
	{
		
	}
}