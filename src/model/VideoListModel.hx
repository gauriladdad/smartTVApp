package model;

import data.VideoInfo;
import data.VideoLinks;
import haxe.Http;
import haxe.Json;
import js.Lib;
import msignal.Signal;

class VideoListModel
{
	public var selectedIndexChange:Signal1<Int>;
	public var itemLoad:Signal0;
	
	public var videoLinks(default, null):Array<VideoInfo>;
	public var currentItemIndex(default, null):Int;
	public var currentItem(get, null):VideoInfo;
	
	public function new() 
	{
		itemLoad = new Signal0();
		selectedIndexChange = new Signal1();
		videoLinks = new Array();
	}
	
	public function loadLinks(feedUrl)
	{ 
		var loader = new Http(feedUrl);  
		loader.onData = function(raw) 
		{  
			try 
			{  
				var linksObject:data.VideoLinks = Json.parse(raw);
				for (videoURLInfo in linksObject.items) 
				{
					videoLinks.push(videoURLInfo);
				}
				for (videoURLInfo in linksObject.comment) 
				{
					videoLinks.push(videoURLInfo);
				}
				
				itemLoad.dispatch();
			}
			catch (err:Dynamic) {  
				Lib.alert("error with reading data: " + err);
			}  
		}  
		loader.onError = function(error)
		{
			trace("error with receiving data: " + error);
		}
		loader.request();  
	}
	
	public function selectNext()
	{
		if (currentItemIndex < (videoLinks.length - 1))
			currentItemIndex++;
		else 
			currentItemIndex = 0;
		dispatchSelectionChange();	
	}
	
	public function selectPrevious() 
	{
		if (currentItemIndex > 0) 
			currentItemIndex--;
		else 
			currentItemIndex = videoLinks.length - 1;
		dispatchSelectionChange();
	}
	
	public function selectFirst()
	{
		currentItemIndex = 0;
		dispatchSelectionChange();
	}
	
	public function selectLast()
	{
		currentItemIndex = videoLinks.length - 1;
		dispatchSelectionChange();
	}
	
	public function clear()
	{
		videoLinks = [];
		currentItemIndex = -1;
		currentItem = null;
	}
	
	function dispatchSelectionChange() 
	{
		if (videoLinks.length > 0) 
			selectedIndexChange.dispatch(currentItemIndex);
	}
	
	function get_currentItem():data.VideoInfo 
	{
		return videoLinks[currentItemIndex];
	}
	
}
