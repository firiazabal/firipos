# firipos

firiPOS is a Point Of Sale Application that implements the user interface and all the methods and process in the client terminal.

To make it work, you must develop a server application that implements the differents methods that the firiPOS call, in order to fill the products, categories, register sales, etc. These calls are POST methods that waits for a JSON response. This way the client is independent from the server development and is compatible with any server platform and language.

### Installation
You can install from your google chrome browser. Remember that it is a Google Chrome App, so you must install from your extensions page. You can open the extensions page of your browser by writing the next in your url bar:
```sh
 chrome://extensions
```
Now, you have to activate the Developer mode to see the buttons that let you load a sourced application:
- Check "Developer mode" option
- Click the "Load Uncompressed extension" button and choose the local folder where you have the firiPOS code

### Configuration
The first thing you must do, in order to setup the application is to fill the configuration parameters. These are in a window that will open when you start the application the first time. The parameters are:

- **Terminal ID**: The ID assigned by the server application in order to identify the client and set the correct rights
- **Host**: The uri to the server application. This is the base url to connect with your server application and is where must be implemented all the required methods to interact with firiPOS.
- **Skin**: Choose the color you prefer to your firiPOS installation.
- **Direct printing from server**: If you choose **YES**, then the reports will be printed by the server application directly to the printer (via CUPS or a SMB sistem or just direct port writing...).
- **Printer**: Unimplemented

Once you have configured the parameters and you are sure that your server application is running, then you have to restart firiPOS to load with the new parameters.

### Server Methods
The server application must implement the next methods:

#### Base
Loads all the base elements, like the application users. Doesn't need to be loged, because there are no sensible 
> {**server parameter**}/pointofsale/base

        Request POST Parameters
        {
            terminal: The "Terminal ID" defined in the Configuration window. 
            user: The user ID that the server application has asigned to the users array. This parameter may be empty (when there has benn no login jet).
        }
        JSON Response
        {
            currency: The currency symbol to use when displaying amounts.
            currency_position: Sets the position of the currency symbol (0: before the amount, 1: after the amount).
            users: An array with the POS users. The array has these properties:
                      id: The application ID for the user
                      name: The user name.
                      image: The relative url to the image associated with each user. This property can be null
                users: [
                        {id: 1, name: 'Employee 1', image: 'images/employee1.png'},
                        {id: 2, name: 'Employee 2', image: 'images/employee2.png'}
                       ]
            cash_info.id: The ID of the opened cash, if there is one, otherwise, null.
            change_price: 1 if the user has access to change the line price or 0.
            change_discount: 1 if the user has access to change the line discount or 0.
            cash: 1 if the user has access to the cash aperture/closure.
            reports: 1 if the user has access to the sales reports or 0.
            operations: An array with the different cash movements reasons. When the user clicks the "Open Drawer" button, the system let she/him register the reason why she/him open the drawer (Provider payment, deposit...). The array has these properties:
                    value: The application ID
                    name: The description text
                    customer: 1 if the reason is a deposit to cancel the customer account or 0
                    employee: 1 if the reason is a deposit to cancel the employee account or 0
               operations: [
                            {value: 1, name: 'Customer account cancelation', customer: 1, employee: 0},
                            {value: 2, name: 'Provider Payment', customer: 0, employee: 0}
                           ]
            customers: An array with the list of customers. The array has these properties:
                   value: The application ID
                   name: The customer name
               customers: [
                           {value: 1, name: 'Customer 1'},
                           {value: 2, name: 'Customer 2'}
                          ]
            employees: An array with the list of employees. The array has these properties:
                   value: The application ID
                   name: The employee name
               employees: [
                           {value: 1, name: 'Employee 1'},
                           {value: 2, name: 'Employee 2'}
                          ]
        }

#### Login
Implements the login process where the user identifies in the firiPOS. This can occur when the firiPOS starts or when the user switches the employee by selecting another one from the top right select of the screen.
> {**server parameter**}/pointofsale/login

        Request POST Parameters
        {
            terminal: The "Terminal ID" defined in the Configuration window. 
            user: The user ID that the server application has asigned to the users array.
            password: The password inserted by the user.
        }
        JSON Response
        {
            id: The user ID that will be sent on each operation, in order to identify it in your server application.
            name: The user name to display.
            password: The hash assigned to this session to identify it in your server application.
        }

### License
[Apache License]

[//]: #

[Apache License]: <http://www.apache.org/licenses/>
