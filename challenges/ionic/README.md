# Ionic Challenge

Welcome to the CarOnSale Ionic Coding Challenge.

To assess your skills and knowledge about the relevant technologies, we want you to build us a simple user interface for our backend service.

## Your Task:

Build a simple Ionic mobile application for Android and iOS (v6 or latest) using Angular (v12 or latest) and Capacitor (v3 or latest) that includes:
- **Login Page to login registered buyers** (also known as „salesman“). Note that if a Non-Buyer registers, an error message should pop up.
- **Overview Page (only for logged in buyers) to display all running auctions (updated every 20 seconds)**, including
   - vehicle image thumbnail (vehicle images may not show actual vehicles cars on our DEV platform, but only test images)
   - basic vehicle information („Erstzulassung“/EZ, Mileage, Fuel Type, Transmission)
   - current highest bid value in Euro
   - remaining time in format „00h:00m:00s“
   - information whether the logged in buyer is the highest bidder on an auction
   
Please fork the repo and create the Angular project in the directory of this README.

Note that the solution must be coded in Angular using Ionic, as this is the framework we are using internally. 
No previous professional experience with Angular will be consider when checking the results

You do have 7 days to solve the challenge - in case you need more time to to work out a high quality solution, just let us 
know and we will adjust the deadline for you. You just need to fork the repository, implement a solution and send the link to coding-challenge@caronsale.de
## Your Resources:

You can find the Swagger documentation of our REST API here (The „Authorize“ feature of Swagger is not working with our API):
https://api-core-dev.caronsale.de/swagger/#/

The base URL of our REST service is <https://api-core-dev.caronsale.de/api/v1>.


## General Hints:

- The „User ID“ for REST calls is not the internal „id“ of a user, but the „mailAddress“.
- You don’t need to register new users, existing test accounts are
   - Buyer User:
      - buyer-challenge@caronsale.de (PW: `Test123.` - notice the period)
   - Seller User:
      - seller-challenge@caronsale.de (PW: `Test123.` - notice the period)
- The authentication process is part of the challenge, please use any `authentication` endpoint in the "Authentication" section in our Swagger you may consider.
- Once authenticated use any `buyer` endpoint in the "Auctions" section you may consider. This will offer you automatically a set of auctions filtered for this user (don't use a `public` endpoint, as it will show you only a set of public auctions not connected to the logged in user).

Please send the link to the forked repo to coding-challenge@caronsale.de.

If you have any questions, feel free to contact us via <coding-challenge@caronsale.de>
