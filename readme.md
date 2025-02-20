# Task About Datasets

## Goal of the project
I wish to create a tool that gives a bit of intel in the local bus offer. I want to create a map of all the active busses, as well as show how delayed they are. Maybe also develop a system that shows the average delay time of different lines, as well as an AI that predicts how delayed a bus will be based on traffic and other factors. Though these are far more complex than the basic features I will start off with.

## Background
This project takes inspiration primarily from two sources. First of all is Emilie's bus project. Her project about delays in the local bus system and her discovery of an API that has relevant data has made me curios as well.
Secondly is a [video by @calledhercalders](https://vm.tiktok.com/ZNd1xV2Tv/) I saw on TikTok. It features a nifty circuit board that displays a small map of the trains in Chicago with their position being updated live. This inspired me to do something simular with the local busses. To my knowledge, one does not exist yet, but it would be a really cool and usefull tool to have. I could see myself using it when I'm late for the bus and need to figure out how much time I've got left.

## API
Listed are the API's used in the project:
* [Google Maps JavaScript](https://developers.google.com/maps/documentation/javascript/overview) <br>
* [EnTur Real-Time Data API](https://developer.entur.org/pages-real-time-api)

## Requirements
### Python
The libraries required to run the python and jupyter files in this project, as well as their installment method, are listed here:
* Requests <br>
    > pip install requests
* Pandas
    > pip install pandas
* XMLtoDict
    > pip install xmltodict

### Javascript

For the web app, you will require Node.js to run. You can download it from their [website](https://nodejs.org/en). When you have installed node, you can run the following command in your terminal to install all the required packages:

> npm install

I also recommend installing nodemon, as it makes running the app better in my opinion. It can be installed with:

> npm install nodemon -g
    
After this is installed, you can run the web app with:

> nodemon run