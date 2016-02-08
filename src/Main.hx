package;

import components.Player;
import components.VideoPlayerUI;
import js.Browser;

import components.EndOfPlayScreen;
@:expose
class Main
{	
	static var app:Main;
	
	var videoPlayer:VideoPlayerUI;
	
	function new () 
	{
		try 
		{
			createChildren();
		}
		catch (err:Dynamic)
		{
			trace(err);
		}
	}
	
	static function main() 
	{
		Device.init();
		Device.ready();
		
		Browser.window.onload = function(_) {
			start();
			trace("in window load");
		}
	}
	
	static function start()
	{
		app = new Main();
	}
	
	function createChildren()
	{
		var doc = Browser.document;

		videoPlayer = new VideoPlayerUI();
		doc.body.appendChild(videoPlayer.view);
		videoPlayer.loadLinks();
	}
}