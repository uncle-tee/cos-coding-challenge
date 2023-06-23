# Backend Challenge

Welcome to the CarOnSale backend coding challenge.

In the `/src/app` directory, you find a typescript interface `CarOnSaleClient` for a service that describes a service to retrieve a list of running auctions from the CarOnSale development API.

Please implement the service using the buyer user with the following credentials for authentication:
- Email: `buyer-challenge@caronsale.de`
- Password: `Test123.` - notice the period.

The API is documented here: https://api-core-dev.caronsale.de/swagger/#/

Please fulfill the following tasks (according to the description above):

0. Fork the repo
1. Create a branch to work in
2. Install all Node.js dependencies for the project
3. Implement the CarOnSaleClient interface in a class with method stubs (no functionality) 
4. Implement Mocha/Chai component tests in the ``/CarOnSaleClient/classes`` directory that test the desired behavior (Tests should be run when executing ``npm test``)
5. Implement the actual service to retrieve the list of running auctions (by using the CarOnSale RESTful API, see Swagger documentation)
6. Come up with an interface definition that you can use to access the response objects of a CarOnSale API call (see TODO tag in `CarOnSaleClient` and check the Swagger documentation for the response objects).
7. Register your service to the dependency injection container in ``main.ts``
8. Integrate your service into the application: If the application runs, the service should be used to retrieve running auctions from the CarOnSale API, display the number of auctions, average number of bids on an auction as well as the average percentage of the auction progress (ratio of current highest bid value and minimum required ask) and the exit with exit code 0. If the service is failing, the process should be quit with exit code -1.
9. Commit and push everything to your branch
10. Open a PR in your forked repository from your branch to master
11. Inform <coding-challenge@caronsale.de> that you finished the challenge :)

Additional Hints:

 * Please make sure, code quality is ensured (i.e. validating against the tslint file is not failing).
 * Please focus on correct and uniform formatting.
 * Be sure to use clear commit messages.
 * You can add as many (e.g. static or helper) classes as you want.
 * You can install any additional npm packages.
 * This is not a production-ready code, so, feel free to improve it ;)
 
If you have any questions, feel free to contact us via <coding-challenge@caronsale.de>.
