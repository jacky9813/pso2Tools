# PSO2 Utility (formerly know as PSO2 Tools)

## Attention
This version of PSO2 Utility's database is not compatible with previous version's file.

Users have to input all the data again to switch version.

(Or maybe I'll release a tool afterward)

## Features
- Highly modulized feature

## Modules within
- ClassLevel module - to record your character's class status
- DeleteCharacter module - add a delete button to Character overview page
- Memo module - add a memo for each character
- TaCounter module - Set TA mission complete time, calculate the time TA missions will be available again

## How to backup the data
The /Path/to/App/pso2Tools.db is what you looking for

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