# Flutter Challenge

Welcome to the CarOnSale Flutter Coding Challenge.

To assess your skills and knowledge about Flutter and Dart, we want you to build a mobile application for Android and iOS.

## Your Task:

Build a Flutter mobile application for Android and iOS that includes:
- A **login page**
  - Uses Firebase Authentication (email + password)
  - Registration of new users is not needed
  - Just add a dummy user and password in Firebase
- A **profile page** containing:
  - User's email
  - User's profile picture
  - User's preferred photo method
    - Can be switched between Camera and Gallery
    - Should be stored, so that the settings stay the same after application is closed and reopened
  - An option to change the user's password
  - An option to change the user's profile picture (please check the user's preferred photo method)
  - An option to logout

- A **vehicle inspection overview page** containing:
  - List of previously done inspections
    - List is sorted by creation time in descending order
    - If a list item is clicked, a prefilled *vehicle inspection details page* will be opened
  - Floating Action Button to create a new inspection
    - If clicked an empty *vehicle inspection details page* is opened

- A **vehicle inspection details page** containing:
  - This page should be implemented as a form with validation:
    - Date of inspection (required) - Date cannot be in the future
    - Vehicle Identification Number (required) - must be exactly 17 characters. Cannot contain I, O, U characters. Can only contain numbers and letters.
    - Vehicle make (optional)
    - Vehicle model (optional)
    - Vehicle photo (optional)
  - If the required form fields do not match the validation criteria the page cannot be closed and the user should get a warning message



You do have 7 days to solve the challenge - in case you need more time to to work out a high quality solution, just let us
know and we will adjust the deadline for you.

## Steps to submit the challenge:

0. Fork the repo
1. Create a branch to work in
2. Create the Flutter project in the directory of this README
3. Fullfill the above mentioned task to solve the code challenge
4. Commit and push everything to your branch
5. Open a PR in your forked repository from your branch to master
6. Inform <coding-challenge@caronsale.de> that you finished the challenge :)


## General Hints:
Feel free to use as many dependencies as you want

Please send us the user name and password to log-in

If you have any questions, feel free to contact us via <coding-challenge@caronsale.de>
