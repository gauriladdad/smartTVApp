package components;
import data.VideoInfo;
import haxe.Http;
import haxe.Json;
import js.html.DivElement;
import js.Browser;
import js.html.KeyboardEvent;
import js.Lib;
import msignal.Signal.Signal1;
import model.VideoListModel;

class VideoList extends BaseComponent
{
	public var selectedItemChanged:Signal1<data.VideoInfo>;
	public var playerKeyPressed:Signal1<Int>;
	public var feedUrl(default, set):String;
	
	var model:VideoListModel; 	
	var videoListItems:Array<DivElement>;
	var scroll(default, set):Int;
	var visibleLines = 17;
	
	public function new() 
	{
		super();
		
		selectedItemChanged = new Signal1();
		playerKeyPressed = new Signal1();
	 	model = new VideoListModel(); 
		addModelHandlers();
		scroll = 0;
	}
	
	override function createView() 
	{
		super.createView();
		view.className = "listGroup";
		view.onkeydown = view_keyDownHandler;
	}
	
	function addModelHandlers()
	{
		model.itemLoad.add(model_itemsChanged);
		model.selectedIndexChange.add(model_selectedIndexChanged);
	}
	
	public function model_itemsChanged() 
	{
		var doc = Browser.document;  
		var fragments = doc.createDocumentFragment();  
		var itemIndex = 0;
		videoListItems = [];
		
		for (videoURLInfo in model.videoLinks)  
		{  
			var videoDiv = doc.createDivElement();
			videoDiv.innerHTML = videoURLInfo.name;
			videoDiv.className = "listItem itemFont";
			itemIndex++;
			videoDiv.tabIndex = itemIndex;
			fragments.appendChild(videoDiv);
			videoListItems.push(videoDiv);
		}
		view.appendChild(fragments);  
		
		model.selectFirst();
	}

	public function view_keyDownHandler(event:KeyboardEvent) 
	{
		trace("key pressed: " + event.keyCode);
		
		switch (event.keyCode)
		{
			case KeyboardConstants.LEFT:
				event.preventDefault();
				model.selectFirst();
				playerKeyPressed.dispatch(KeyboardConstants.LEFT);
				
			case KeyboardConstants.RIGHT:
				event.preventDefault();
				model.selectLast();
				playerKeyPressed.dispatch(KeyboardConstants.RIGHT);
				
			case KeyboardConstants.UP:
				event.preventDefault();
				model.selectPrevious();
				playerKeyPressed.dispatch(KeyboardConstants.UP);

			case KeyboardConstants.DOWN: 
				event.preventDefault();
				model.selectNext();
				playerKeyPressed.dispatch(KeyboardConstants.DOWN);
				
			case KeyboardConstants.ENTER:
				event.preventDefault();
				if (model.currentItem != null)
				{
					selectedItemChanged.dispatch(model.currentItem);
					playerKeyPressed.dispatch(KeyboardConstants.ENTER);
				}
			
			case KeyboardConstants.PLAY:
				playerKeyPressed.dispatch(KeyboardConstants.PLAY);
				
			case KeyboardConstants.STOP:
				playerKeyPressed.dispatch(KeyboardConstants.STOP);

			case KeyboardConstants.PAUSE:
				playerKeyPressed.dispatch(KeyboardConstants.PAUSE);				

			case KeyboardConstants.FF:
				playerKeyPressed.dispatch(KeyboardConstants.FF);
				
			case KeyboardConstants.RW:
				playerKeyPressed.dispatch(KeyboardConstants.RW);
				
			default:
				trace("Unhandled key");
			
	   }
	}
	
	public function model_selectedIndexChanged(itemIndex:Int) 
	{
		if (videoListItems.length > 0 && itemIndex >= 0)
		{
			var item = videoListItems[itemIndex];
			
			/* for the scroll in container to be such that the item in focus is visible
			 * the scroll position would either equal to the current item OR
			 * if the item in focus is outside the container height, then adjust the focus
			 * to be moved to item so as to make item in focus visible */
			if (itemIndex - scroll < 0)
			{
				scroll = itemIndex;
			}
			else if (itemIndex - scroll >= visibleLines)
			{
				scroll = itemIndex - visibleLines;
			}
			item.focus();
		}
	}
	
	function set_feedUrl(value:String):String 
	{
		model.clear();
		model.loadLinks(value);
		return feedUrl = value;
	}
	
	function set_scroll(value:Int):Int 
	{
		if (videoListItems != null)
		{
			var top = videoListItems[value].offsetTop;
			view.scrollTop = top;
		}
		return scroll = value;
	}
}