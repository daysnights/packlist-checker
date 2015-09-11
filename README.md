# packlist-checker
Node.js app that checks for changes of a packlist. If a change is detected, it sends the packlist as a json array to an api endpoint, and authenticates with an api key. App should be run by cron, it is up to the user on how frequently they want to check. 5 Minutes is generally recommended. packlist-checker should be run by the same user as your bot.
### Install Guide
* Download the files from this git
* Put in a folder called packlist-checker
* Rename the settings.js file and edit it
* For Ubuntu or Debian, install NPM and Node
```sh
$ apt-get install npm node
```
* cd to the app folder
* Use NPM to install dependencies
```sh
$ npm install
```
* Run the app manually to verify it works
```sh
$ node main.js
```
* Add a cron job
```sh
$ */5 * * * * /usr/local/bin/node /absolute/path/to/main.js
```
## Version
0.0.1
## Support
Open an Issue on Github or message Days on Rizon.
