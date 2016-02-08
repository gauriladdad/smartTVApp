package components;

import js.Browser;
import js.html.DivElement;

class Header extends BaseComponent
{
	override function createView() 
	{
		super.createView();
		view.className = "header itemFont";
		view.innerHTML = "Select item";
	}	
}