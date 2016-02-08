package components;
import data.VideoInfo;
import js.Browser;
import js.html.DivElement;
import js.html.LabelElement;


class VideoItemInfo extends BaseComponent
{
	var timeLapse:DivElement;
	var status:DivElement;
	var name:DivElement;
	var bitRate:DivElement;
	var videoResolution:DivElement;

	public function new() 
	{
		super();
	}
	
	override function createView() 
	{
		super.createView();
	}
	
	override function createChildren() 
	{
		super.createChildren();
		
		videoResolution = Browser.document.createDivElement();
		videoResolution.className = "videoResolution itemFont";
		view.appendChild(videoResolution);
		
		bitRate = Browser.document.createDivElement();
		bitRate.className = "avaialbleBitRate itemFont";
		view.appendChild(bitRate);
		
		timeLapse = Browser.document.createDivElement();
		timeLapse.className = "timeLapse itemFont";
		view.appendChild(timeLapse);
		
		status = Browser.document.createDivElement();
		status.className = "status itemFont";
		view.appendChild(status);
		
		name = Browser.document.createDivElement();
		name.className = "name itemFont";
		view.appendChild(name);
	}
	
	public function setData(item:data.VideoInfo) 
	{
		name.innerHTML = item.url;
	}
	
	public function setStatus(statusVal:String) 
	{
		status.innerHTML = statusVal;
	}
	
	public function setTimeProgress(timeLapsed:String) 
	{
		timeLapse.innerHTML = timeLapsed;
	}
	
	public function setBitRate(bitRateData:String)
	{
		bitRate.innerHTML = bitRateData;
	}
	
	public function setVideoResolution(resolution:Int) 
	{
		videoResolution.innerHTML = resolution > -1 ? "Resolution: " + resolution + "p" : "";
	}
}