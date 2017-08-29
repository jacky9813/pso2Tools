# PSO2 Tools

<p align="center"><img src="https://user-images.githubusercontent.com/13483393/29775459-c9eb24c4-8c37-11e7-9605-215bf8307c0f.PNG"></p>

## Features
- Time attack CO cool-down management
- Memo for each characters (from 0.0.2-alpha)
- A link manager for quick access (from 0.0.3-alpha)

## How to backup
The X:\Path\to\App\resources\pso2Tools.db is what you looking for

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
