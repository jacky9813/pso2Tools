# PSO2 Utility (formerly known as PSO2 Tools)

Some useful utilities for PSO2

Don't worry, this won't change how PSO2 operates. This is just a total seprate program that could help you sort out something related to PSO2.

## Features
- Highly modulized feature

## Modules within
- ClassLevel module - to record your character's class status
- DeleteCharacter module - add a delete button to Character overview page
- Emergency module - Get infomations about the latest Emergency Quest Time Table
- Memo module - add a memo for each character
- TaCounter module - Set TA mission complete time, calculate the time TA missions will be available again
- ChatLog module - Display in-game chat log from PSO2 log file
- Links module - A storage of links that often used while playing PSO2
- Settings module - To change some user settings for PSO2 Utility
- devToolOpen module - Chrome DevTools Opener (will show up on version x.y.z-dev only)

## How to backup the data
The /Path/to/App/pso2db.db and /Path/to/App/settings.json (if exists) is what you looking for

## About settings.json
It's a way to enhance your experience of using PSO2 Utility. Using Settings tab to setup PSO2 Utility (>=0.1.4-beta), or manually fills the settings:
```JSON
{
    "myID": "Your player ID in PSO2, like: \"myID\":123456789",
    "pso2DocumentLocation": "The directory storing the user data and logs, typically in Document\\SEGA\\PHANTASYSTARONLINE2. PSO2 Utility will find this directory automatically, input this field if this failed"
}
```

## Contribute
- To point out bugs, give ideas of new features, use [GitHub Issues](https://github.com/jacky9813/pso2Tools/issues)

## Use with source code
Make sure you got the node.js prepared, download this repository then:
```shell
$npm install # To download all required packages
$npm run postinstall # In case post install script didn't run automatically
```

And to launch PSO2 Tools, all you need is navigate to repository folder and:
```shell
$npm start
```

## Compile form source
```shell
$npm install
$npm install --save-dev electron-packager # electron-packager will be ignored by "npm install" in some cases
$npm run postinstall # In case post install script didn't run automatically
$npm run build-windows # build code for windows is included in package.json, modify to other platform if you needed (See electron-packager for more information)
```

## License
Unlicense! Enjoy yourself to use, distrubute, copy, merge and even modify!

## Special Thanks
[Material Design Icons by Google](https://github.com/google/material-design-icons)
