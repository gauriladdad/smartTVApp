package components;
import data.VideoInfo;
import haxe.Timer;
import js.Browser;
import msignal.Signal.Signal1;
import msignal.Signal.Signal2;

class Player 
{
	/* this will dispatch player status, playing, paused, bufferring at x% */
    public var statusChanged:Signal1<String>;
	/* this will dispatch player time lapse - time lapsed vs time remaining */
	public var timeProgress:Signal1<String>;
	public var bitRateChange:Signal1<String>;
	public var videoResolutionChange:Signal1<Int>;
	
	public static var STOPPED:Int=0;
    public static var PLAYING:Int=1;
    public static var PAUSED:Int = 2;
	
    var plugin:Dynamic;
	var url:String;
    var state:Int = -1;
    var originalSource:Dynamic;
	var currentTime:Int = -1;
	var duration:Int = 0;
	
	var player:Player;
	var checkTimer:Timer;
	
	
	public function new() 
	{
		statusChanged = new Signal1();
		timeProgress = new Signal1();
		bitRateChange = new Signal1();
		videoResolutionChange = new Signal1();
		init();
	}
	
	public function setData(item:VideoInfo)
	{
		var r = ~/(.*?)\.(mpd|mkv)$/i;
		if (r.match(item.url)) 
		{
			this.url = item.url + "|COMPONENT=HAS";
		}
		else 
		{
			this.url = item.url;
		}
		trace("URL received: " + url);
		statusChanged.dispatch("Press play");
		timeProgress.dispatch("");
		bitRateChange.dispatch("");
		videoResolutionChange.dispatch(-1);
		stopVideo();
	}
	
	function init() 
	{
		state = STOPPED;
		
		plugin = Browser.document.getElementById("pluginPlayer");
		if (!plugin) 
		{
			return false;
		}

	    plugin.OnCurrentPlayTime = 'Player.setCurTime';
		plugin.OnStreamInfoReady = 'Player.onStreamInfoReady';
		plugin.OnBufferingStart = 'Player.onBufferingStart';
		plugin.OnBufferingProgress = 'Player.onBufferingProgress';
		plugin.OnBufferingComplete = 'Player.onBufferingComplete';
		plugin.OnRenderError = 'Player.onRenderError';
		plugin.OnRenderComplete = 'Player.onRenderComplete';
		plugin.OnConnectionFailed = 'Player.onConnectionFailed';
		plugin.OnAuthenticationFailed = 'Player.onAuthenticationFailed';
		plugin.OnStreamNotFound = 'Player.onStreamNotFound';
		plugin.OnNetworkDisconnected = 'Player.onNetworkDisconnected';
		untyped window.Player = this;
		
		Browser.window.onunload = function(_) {
			if (plugin != null)
			{
				plugin.Stop();
			}
		}
		return true;
	}
	
	public function onConnectionFailed() 
	{
		statusChanged.dispatch("Connection failed");
		stopVideo();
	}
	
	public function onAuthenticationFailed()
	{
		statusChanged.dispatch("Authentication failed");
		stopVideo();
	}
	
	public function onStreamNotFound() 
	{
		statusChanged.dispatch("Stream not found");
		stopVideo();
	}
	
	public function onNetworkDisconnected()
	{
		statusChanged.dispatch("Network is disconnected");
		stopVideo();
	}
	
	public function onRenderComplete()
	{
		statusChanged.dispatch("Video is over");
	}
	
	public function onRenderError()
	{
		statusChanged.dispatch("Video render error");
		stopVideo();
	}
	
	public function onBufferingProgress(percent)
	{
		// TODO stop timer (if any)
		
		statusChanged.dispatch("Bufferring " + percent + "% ");
	}
	
	public function onBufferingComplete()
	{
		statusChanged.dispatch("Playing");
	}
	
	function updateVideoInfo() 
	{
		var availableBitRates:String = "";
		var currentBitRates:String = "";
		try 
		{
			availableBitRates = plugin.GetAvailableBitrates();	
			currentBitRates = plugin.GetCurrentBitrates();
		}
		catch (error:Dynamic)
		{
			trace(error);
		}
		bitRateChange.dispatch("BitRate: " + 	
			currentBitRates + " / available: " + availableBitRates);
		
		var resolution:Int = -1;
		try 
		{
			resolution = plugin.GetVideoHeight();
		}
		catch (error:Dynamic) {
			trace(error);
		}
		videoResolutionChange.dispatch(resolution);
	}
	
	public function onStreamInfoReady()
	{
		duration = plugin.GetDuration();
		statusChanged.dispatch("Streaming");
		
		checkTimer = new Timer(1000);
		checkTimer.run = updateVideoInfo;
	}
	
	public function setCurTime(time:Int) 
	{
		this.currentTime = time;
		try 
		{
			timeProgress.dispatch("Playing at time: " + time + " / " + duration);
		}
		catch (error:Dynamic)
		{
			trace(error);
		}
	}
	
	function playVideo()
	{
		if (url == null) 
		{
			statusChanged.dispatch("No videos to play");
		}
		else 
		{
			state = PLAYING;
			plugin.Play(url);
		}
	}
	
	function pauseVideo()
	{
		state = PAUSED;
		plugin.Pause();
	}
	
	function stopVideo() 
	{
		if (state != STOPPED) 
		{
			state = STOPPED;
			plugin.Stop();
			checkTimer.stop();
		}
		else 
		{
			trace("Ignoring the request, not in right state");	
		}
	}
	
	function resumeVideo() 
	{
		state = PLAYING;
		plugin.Resume();
	}
	
	public function handlePlayerKeyPress(keyCode:Int)
	{
		switch(keyCode)
		{
			case KeyboardConstants.PLAY:
				handlePlayKey();
				statusChanged.dispatch("Key play");

			case KeyboardConstants.STOP:
				stopVideo();
				statusChanged.dispatch("Key stop");

			case KeyboardConstants.PAUSE:
				this.handlePauseKey();
				statusChanged.dispatch("Key pause");

			case KeyboardConstants.FF:
				plugin.JumpBackward(-30);
				statusChanged.dispatch("Key forward");

			case KeyboardConstants.RW:
				plugin.JumpBackward(30);
				statusChanged.dispatch("Key rewind");
		}
	}
	
	function handlePlayKey()
	{
		switch ( state ) 
		{
			case Player.STOPPED:
				playVideo();

			case Player.PAUSED:
				resumeVideo();

			default:
				trace("Ignoring play key, not in correct state");
		}
	}
	
	function handlePauseKey()
	{
		switch ( state ) 
		{
			case Player.PLAYING:
				pauseVideo();

			case Player.PAUSED:
				resumeVideo();
		
			default:
				trace("Ignoring pause key, not in correct state");
		}
	}
}