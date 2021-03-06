# Win The Day App- Project Description #
The 'Win The Day' app allows users to keep track of their 'Power List' in every single day. The 'Power List' is 5 critical daily tasks that will help them build good habits and improve themselves.
If you complete all 5 tasks on the list, that day is counted as a 'win' in the books. Otherwise, that day is counted as a 'loss'. 
The goal is to achieve a winning record over the course of many months so that you are taking steps every single week to you bring you closer to your goals.

The concept was based off a podcast by entrepreneur and bestselling Andy Frisella: 
https://andyfrisella.com/blogs/mfceo-project-podcast/win-the-day-with-andy-frisella-mfceo107

The Web App was made with the MERN (MondoDb, Express, React, Node) stack 

## How to Run the Project ##
There are two bash scripts that can help you run this application: runfrontend.sh in the 'win-the-day-frontend' folder and runbackend.sh in the 'win-the-day-backend' foler. The backend API which connects to MongoDb that will be running on port 3000 and frontend web server with all the react code will be on port 4569.

You would have to open two separate terminals to run the backend and frontend simultaneously. You will also need to have your local MongoDb environment set up with a 'win-the-day-app' database. 

If you run into a problem on the react app where it says something along the lines of "Unable read property 'numWins' of undefined", then you need to go open a mongoDB console and import 1 json object in the 'winstats' collection: {"name": "winStats", "numWins": 0, "numLosses": 0, "numDays": 0}. If the 'winstats' collection does not exist, then create it and then import the json object.
