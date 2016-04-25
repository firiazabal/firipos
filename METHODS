# firiPOS Server Methods
The server application must implement the next methods, in order to get working the firiPOS

#### Base
Loads all the base elements, like the application users, the grants to the different buttons.. When this method is called, there may not be any user logged in. 
> {**server parameter**}/pointofsale/base

        Request POST Parameters
        {
            terminal: The "Terminal ID" defined in the Configuration window. 
            user: The user ID that the server application has asigned to the users array. This parameter may be empty (if there has been no login yet).
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
