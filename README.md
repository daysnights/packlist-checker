# packlist-checker #
## Description ##
Node.js app that checks for changes of a packlist. If a change is detected, it sends the packlist as a json array to an api endpoint, and authenticates with an api key. App should be run by a cron job. It is up to the user on how frequently they want to check, 5 Minutes is generally recommended. packlist-checker should be run by the same user as your bot.
## Install Guide ##
**Ubuntu & Debian**
```sh
$ sudo apt-get install npm node
$ git clone git://github.com/daysnights/packlist-checker.git
$ cd packlist-checker
$ npm install
```
Rename the settings.js file and edit it  
Run the app to manually to verify it works
```sh
$ node main.js
```
Add a cron job
```sh
$ contab -e
$ */5 * * * * /usr/local/bin/node /absolute/path/to/packlist-checker/main.js
```
## Version ##
0.0.1
## Support ##
Open an Issue on Github or message Days on Rizon.
