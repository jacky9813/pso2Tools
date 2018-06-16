# PSO2 Utility (formerly know as PSO2 Tools)

## Attention
This version of PSO2 Utility's database is not compatible with previous version's file.

Users has to upgrade the old database file by following:

(make sure old database pso2Tools.db is in the same directory as package.json)
```bash
$npm run dbUpgrade
```

## Features
- Highly modulized feature

## Modules within
- ClassLevel module - to record your character's class status
- DeleteCharacter module - add a delete button to Character overview page
- Memo module - add a memo for each character
- TaCounter module - Set TA mission complete time, calculate the time TA missions will be available again

## How to backup the data
The /Path/to/App/pso2db.db and /Path/to/App/settings.json (if exists) is what you looking for

## About settings.json
It's a way to enhance your experience of using PSO2 Utility. Just fill all what you know like:
```JSON
{
    "myID": 'Your player ID in PSO2, like: "myID":123456789',
    "pso2DocumentLocation": 'The directory storing the user data and logs, typically in Document\\SEGA\\PHANTASYSTARONLINE2. PSO2 Utility will find this directory automatically, input this field if this failed'
}
```

## Contribute
- Point out a bug, idea of new feature on [GitHub Issues](https://github.com/jacky9813/pso2Tools/issues)

## Use with source code
Make sure you got the node.js prepared, download this repository then:
```shell
$npm install
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
No license! Enjoy yourself to use, distrubute, copy, merge and even modify!

## Special Thanks
[Material Design Icons by Google](https://github.com/google/material-design-icons)