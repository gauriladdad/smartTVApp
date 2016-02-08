# smartTVApp
This application explores how to play/pause videos on samsung smart TV. Upon running

1. It fetches a list of video links over HTTP and displays it inside a scrollable container. 
The items can be selected from remote with up/down/left/right keys.

2. upon selecting a URL it plays the video. You can also use all the video features like play/pause/rewind/forward/stop.

3. It also captures some parameters for video like bit rate, video resolution, time progress etc.

### Tools used

Haxe for JS
Sublime editor
SourceTree
Weinre
Batch script 

### Device Support

This application works well on samsung smart TV.

### Run the project :

1. from command line run - haxe build.hxml
2. then run - package.bat. This will generate the player.zip from bin folder. Make sure your build is succesful in step 1.
3. Where package is loaded, alongside copy the file - www/widgetlist.xml. 

	* DO NOT change widgestlist file name, 
	* Do not forget to update <download> tag inside the file and replace IP with your machine's IP.
	
4. Start a server (I have used MAMP for testing) and point it to where player.zip is located. 
5. On your samsung TV - login as developer. Point the device to your IP and sync the application. 

You application should now load on TV and its ready to play.
