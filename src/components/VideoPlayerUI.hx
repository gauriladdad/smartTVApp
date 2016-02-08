package components;

import data.VideoInfo;
import js.html.DivElement;
import js.Lib;

class VideoPlayerUI extends BaseComponent
{
	private var videoList:VideoList;
	private var player:Player;
	private var itemInfo:VideoItemInfo;
	
	override function createChildren() 
	{
		player = new Player();
		player.statusChanged.add(playerStatusChanged);
		player.timeProgress.add(playerTimeProgress);
		player.bitRateChange.add(bitRateChange);
		player.videoResolutionChange.add(videoResolutionChange);

		var header:Header = new Header();
		view.appendChild(header.view);
		
		videoList = new VideoList();
		view.appendChild(videoList.view);
		videoList.selectedItemChanged.add(selectedItemChanged);
		videoList.playerKeyPressed.add(playerKeyPressed);
		
		itemInfo = new VideoItemInfo();
		view.appendChild(itemInfo.view);
	}
	
	function selectedItemChanged(item:data.VideoInfo) 
	{
		player.setData(item);
		itemInfo.setData(item);
	}
	
	function playerKeyPressed(keyCode:Int)
	{	
		player.handlePlayerKeyPress(keyCode);
	}
	
	function playerStatusChanged(status:String)
	{
		itemInfo.setStatus(status);
	}
	
	function playerTimeProgress(timeLapse:String)
	{
		itemInfo.setTimeProgress(timeLapse);
	}
	
	function bitRateChange(bitRate:String) 
	{
		itemInfo.setBitRate(bitRate);
	}
	
	function videoResolutionChange(resolution:Int)
	{
		itemInfo.setVideoResolution(resolution);
	}
	
	public function loadLinks() 
	{
		videoList.feedUrl = "http://pax.t-online.de/dash/app/sources.json";
		
	}	
}
	