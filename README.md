This app runs on Google App Engine. It aggregates statistics of VOIs (http://voiapp.io/) and presents it in nice graphs.


![Graph view](https://user-images.githubusercontent.com/1312802/46869953-a3196200-ce2d-11e8-8052-2ca47ad39e4d.png)



## Requirements
* Node 8 or newer (Be aware that App Engine uses 8 tho)
* Google account with API key if you want to save data to datastore. You need to setup google cli tools (aka gcloud).

## Run locally
1. Install with `npm i`.
2. Run `npm run once`, this will fetch and print stats from the VOI API.

3. If you want to save (aggregate) statistics to google cloud datastore and view them, you may start the app with `npm run start` and go to http://localhost:3000.
4. Make a request to http://localhost:3000/system/record-vehicle-status to trigger the aggregation. 

## Deploy
1. Run `gcloud app deploy`. That's all. 
