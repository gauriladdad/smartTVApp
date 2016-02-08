package components;

import msignal.Signal;
import mui.core.Container;
import mui.display.Color;
import mui.display.Gradient;
import mui.display.GradientColor;
import mui.display.Image;
import mui.display.Text;
import mui.event.Focus;
import js.Browser;
class EndOfPlayScreen extends Container
{
	/*public var navigateBack(default, null):Signal0;
	public var navigateHome(default, null):Signal0;

	var relatedContentContainer:RelatedContentContainer;

	var buttonContainer:Container;
	var title:Text;
	var title2:Text;
	var image:Image;
	var footer:Footer;
	var buttonWatch:CommonButton;
	var buttonBack:CommonButton;
	var buttonHome:CommonButton;

	var baseContainer:Container;

	var gap:Int;*/

	public function new()
	{
		
		super();

		var baseContainer = new Container();
		addChild(baseContainer);

		var title = new Text();
		title.value = "ABC";
		baseContainer.addChild(title);
/*
		var backgrondImage = new Image();
		backgrondImage.centerX = 0.5;
		backgrondImage.centerY = 0.5;
		backgrondImage.url = "asset/background.jpg";
		baseContainer.addChild(backgrondImage);

		episodeWatch = new Signal1();
		navigateBack = new Signal0();
		navigateHome = new Signal0();

		init();

		footer = new Footer();
		footer.enabled = false;
		baseContainer.addComponent(footer);

		gap = Std.int((StyleSize.EOP_SCREEN_STRIP_HEIGHT - 3 * StyleSize.BUTTON_HEIGHT) / 2);*/
	}
/*
	public function clear()
	{
		resetLayout();

		buttonWatch.visible = buttonWatch.enabled = false;
		buttonBack.visible = buttonBack.enabled = false;
		buttonHome.visible = buttonHome.enabled = false;
	}

	function init():Void
	{
		buttonContainer = new Container();
		buttonContainer.layout.vertical = true;
		buttonContainer.left = 0;
		buttonContainer.right = 0;
		buttonContainer.y = StyleSize.EOP_SCREEN_STRIP_TOP;
		buttonContainer.height = StyleSize.EOP_SCREEN_STRIP_HEIGHT;
		buttonContainer.fill = new Gradient([new GradientColor(StyleColor.EOP_SCREEN_STRIP_BACKGROUND_COLOR,
														StyleColor.EOP_SCREEN_STRIP_BACKGROUND_ALPHA, 0),
									new GradientColor(StyleColor.EOP_SCREEN_STRIP_BACKGROUND_COLOR,
														StyleColor.EOP_SCREEN_STRIP_BACKGROUND_ALPHA, 1)], 90);
		baseContainer.addChild(buttonContainer);

		title = TextUtil.createText(StyleColor.EOP_SCREEN_TEXT_COLOR, StyleFont.FONT_DEFAULT);
		title.x = StyleSize.EOP_SCREEN_TEXT_LEFT;
		title.y = StyleSize.EOP_SCREEN_TEXT_TOP;
		buttonContainer.addChild(title);

		title2 = TextUtil.createText(StyleColor.EOP_SCREEN_TEXT_COLOR, StyleFont.FONT_TITLES);
		title2.x = StyleSize.EOP_SCREEN_TEXT_LEFT;
		title2.y = 2 * StyleSize.EOP_SCREEN_TEXT_TOP;
		title2.autoSize = false;
		title2.width = StyleSize.EOP_SCREEN_IMAGE_LEFT - StyleSize.EOP_SCREEN_TEXT_LEFT - StyleSize.PADDING;
		title2.wrap = true;
		buttonContainer.addChild(title2);

		buttonWatch = new CommonButton();
		buttonWatch.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + StyleSize.EOP_SCREEN_IMAGE_WIDTH + StyleSize.PADDING;
		buttonWatch.y = StyleSize.EOP_SCREEN_STRIP_TOP;
		buttonWatch.width = StyleSize.DETAIL_SCREEN_LIST_BUTTON_WIDTH;
		buttonWatch.height = StyleSize.BUTTON_HEIGHT;
		buttonWatch.label.value = LocaleUtil.get(Locale.WATCH);
		buttonWatch.actioned.add(function()
		{
			episodeWatch.dispatch(data);
		});
		buttonContainer.addComponent(buttonWatch);
		buttonWatch.visible = false;
		buttonWatch.enabled = false;

		buttonBack = new CommonButton();
		buttonBack.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + StyleSize.EOP_SCREEN_IMAGE_WIDTH + StyleSize.PADDING;
		buttonBack.y = StyleSize.EOP_SCREEN_STRIP_TOP;
		buttonBack.width = StyleSize.DETAIL_SCREEN_LIST_BUTTON_WIDTH;
		buttonBack.height = StyleSize.BUTTON_HEIGHT;
		buttonBack.label.value = LocaleUtil.get(Locale.BACK_TO_SHOW);
		buttonBack.actioned.add(function()
		{
			navigateBack.dispatch();
		});
		buttonContainer.addComponent(buttonBack);

		buttonHome = new CommonButton();
		buttonHome.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + StyleSize.EOP_SCREEN_IMAGE_WIDTH + StyleSize.PADDING;
		buttonHome.y = StyleSize.EOP_SCREEN_STRIP_TOP + StyleSize.BUTTON_HEIGHT + gap;
		buttonHome.width = StyleSize.DETAIL_SCREEN_LIST_BUTTON_WIDTH;
		buttonHome.height = StyleSize.BUTTON_HEIGHT;
		buttonHome.label.value = LocaleUtil.get(Locale.GO_HOME);
		buttonHome.actioned.add(function()
		{
			navigateHome.dispatch();
		});
		buttonContainer.addComponent(buttonHome);
	}

	function createEpisodeLayout():Void
	{
		buttonBack.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + StyleSize.EOP_SCREEN_IMAGE_WIDTH + StyleSize.PADDING;
		buttonBack.y = StyleSize.EOP_SCREEN_STRIP_TOP + StyleSize.BUTTON_HEIGHT + gap;

		buttonHome.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + StyleSize.EOP_SCREEN_IMAGE_WIDTH + StyleSize.PADDING;
		buttonHome.y = StyleSize.EOP_SCREEN_STRIP_TOP + 2 * (StyleSize.BUTTON_HEIGHT + gap);

		buttonWatch.visible = buttonWatch.enabled = true;

		buttonBack.visible = buttonBack.enabled = true;
		buttonHome.visible = buttonHome.enabled = true;

		Focus.current = buttonWatch;
	}

	override function activate()
	{
		super.activate();
		footer.activate();
	}

	override function deactivate()
	{
		super.deactivate();
		footer.deactivate();
	}

	function resetLayout():Void
	{
		if(image != null && image.parent != null)
			buttonContainer.removeChild(image);
		image = null;

		if(relatedContentContainer != null && relatedContentContainer.parent != null)
			baseContainer.removeComponent(relatedContentContainer);
		relatedContentContainer = null;

		title.value = "";
		title2.value = "";
	}

	override function updateData(newData:Content):Void
	{
		super.updateData(newData);

		createEpisodeLayout();

		var urlImg:String = ImageUtil.getContentImage(newData, ImageType.THUMBNAIL);
		if (urlImg != "")
		{
			image = ImageUtil.createImage(urlImg, StyleSize.EOP_SCREEN_IMAGE_WIDTH, StyleSize.EOP_SCREEN_STRIP_HEIGHT);
			image.x = StyleSize.EOP_SCREEN_IMAGE_LEFT;
			image.y = 0;
			buttonContainer.addChild(image);
		}		

		var text = "";
		if (newData.type == ContentType.FEATURE)
		{
			// movies
			title.value = LocaleUtil.get(Locale.NEXT_MOVIE);
			buttonBack.label.value = LocaleUtil.get(Locale.BACK);
		}
		else
		{
			title.value = LocaleUtil.get(Locale.NEXT_EPISODE);
			buttonBack.label.value = LocaleUtil.get(Locale.BACK_TO_SHOW);

			text = newData.media.name + "\n";
			if (newData.season != null)
			{
				text += LocaleUtil.get(Locale.SEASON) + " " + newData.season.number;
				if (newData.episode != null) text += " - " + LocaleUtil.get(Locale.EPISODE) + " " + Std.string(newData.episode);
				text += "\n";
			}
		}

		title2.value = text + newData.name;
	}

	function set_relatedContents(value:Array<Content>):Array<Content>
	{
		resetLayout();

		buttonBack.visible = buttonBack.enabled = true;
		buttonHome.visible = buttonHome.enabled = true;

		relatedContents = value;

		if(relatedContents != null && relatedContents.length > 0)
			createRelatedContentsLayout(relatedContents);
		else
			createNoRelatedContentsLayout();

		buttonWatch.visible = false;
		buttonWatch.enabled = false;

		return relatedContents;
	}

	function createRelatedContentsLayout(relatedContents:Array<Content>):Void
	{
		buttonBack.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + 2 * (StyleSize.EOP_SCREEN_RELATED_IMAGE_WIDTH + StyleSize.PADDING);
		buttonBack.y = StyleSize.EOP_SCREEN_STRIP_TOP;

		buttonHome.x = StyleSize.EOP_SCREEN_IMAGE_LEFT + 2 * (StyleSize.EOP_SCREEN_RELATED_IMAGE_WIDTH + StyleSize.PADDING);
		buttonHome.y = StyleSize.EOP_SCREEN_STRIP_TOP + StyleSize.BUTTON_HEIGHT + gap;

		relatedContentContainer = new RelatedContentContainer();
		relatedContentContainer.height = buttonContainer.height;
		relatedContentContainer.y = StyleSize.EOP_SCREEN_STRIP_TOP;
		relatedContentContainer.relatedContents = relatedContents;
		relatedContentContainer.episodeWatch.add(function(value:Content)
		{
			episodeWatch.dispatch(value);
		});
		baseContainer.addComponent(relatedContentContainer);

		Focus.current = buttonBack;
	}

	function createNoRelatedContentsLayout():Void
	{
		title.value = LocaleUtil.get(Locale.WHERE_TO_NOW);

		buttonBack.x = StyleSize.EOP_SCREEN_IMAGE_LEFT;
		buttonBack.y = StyleSize.EOP_SCREEN_STRIP_TOP;

		buttonHome.x = StyleSize.EOP_SCREEN_IMAGE_LEFT;
		buttonHome.y = StyleSize.EOP_SCREEN_STRIP_TOP + StyleSize.BUTTON_HEIGHT + gap;

		Focus.current = buttonBack;
	}
*/

}
