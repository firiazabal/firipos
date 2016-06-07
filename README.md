# firipos

firiPOS is a Point Of Sale Application that implements the user interface and all the methods and process in the client terminal.

To make it work, you must develop a server application that implements the differents methods that the firiPOS call, in order to fill the products, categories, register sales, etc. These calls are POST methods that waits for a JSON response. This way the client is independent from the server development and is compatible with any server platform and language.

### Installation
##### Source Code
You can install from your google chrome browser. Remember that it is a Google Chrome App, so you must install from your extensions page. You can open the extensions page of your browser by writing the next in your url bar:
```sh
 chrome://extensions
```
Now, you have to activate the Developer mode to see the buttons that let you load a sourced application:
- Check "Developer mode" option
- Click the "Load Uncompressed extension" button and choose the local folder where you have the firiPOS code
##### Binary
You can install the application from the [Google Chrome Web Store]

### Configuration
The first thing you must do, in order to setup the application is to fill the configuration parameters. These are in a window that will open when you start the application the first time. The parameters are:

- **Terminal ID**: The ID assigned by the server application in order to identify the client and set the correct rights
- **Host**: The uri to the server application. This is the base url to connect with your server application and is where must be implemented all the required methods to interact with firiPOS.
- **Skin**: Choose the color you prefer to your firiPOS installation.
- **Direct printing from server**: If you choose **YES**, then the reports will be printed by the server application directly to the printer (via CUPS or a SMB sistem or just direct port writing...).
- **Logo**: This parameter let you change the application logo.
- **Printer**: Unimplemented

Once you have configured the parameters and you are sure that your server application is running, then you have to restart firiPOS to load with the new parameters.

### Server Methods
See [METHODS] file for more info.

### License
[Apache License]

[//]: #

[Apache License]: <http://www.apache.org/licenses/>
[METHODS]: <https://github.com/firiazabal/firipos/blob/master/METHODS.md>
[Google Chrome Web Store]: <https://chrome.google.com/webstore/detail/firipos/ggjemkehpbkknbjaigadhmmlkocdgkoi>
