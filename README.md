
<br />
<p align="center">
  <h1 align="center">Volt MX Tutorials</h1>
  <p align="center">
   <b>Volt MX Tutorials</b> is a mechanism within Volt MX Iris that you can use to learn a few concepts of how to develop applications by using Iris. Volt MX Tutorials are step-by-step interactive walkthroughs that help you understand the basics of using Volt MX Iris.
  <br />
  </p>
  <p align="center"><a href="https://opensource.hcltechsw.com/volt-mx-tutorials/hikes"><strong>Explore the Catalog »</strong></a></p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#quickstart">Quickstart</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li> 
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running.

### Prerequisites

* npm >= 7.6.0
* node >= 15.11

### Quickstart

1. Fork this repository & clone it in your local machine.
2. Install NPM packages.
   ```sh
   npm install
   ```
4. Run in development mode
   ```
   npm start
   ```

5. **Dev Url:**  Open `http://localhost:3200/` in your browser to see your app running.

<!-- USAGE EXAMPLES -->
## Usage

### HikeBuilder (Iris-Addon)

_IRIS_INSTALLATION_PATH_ =  the full path of your Volt MX Iris directory.

**Install:**

From root directory,

```node
npm run-script hikeBuilder:install --path="IRIS_INSTALLATION_PATH"
```

**Uninstall:**

From root directory,
```node
npm run-script hikeBuilder:uninstall --path="IRIS_INSTALLATION_PATH"
```
eg: in macOS,
```node
npm run-script hikeBuilder:install --path="/Applications/Volt MX Iris"
```

eg: in Windows,

```node
npm run-script hikeBuilder:install --path="C:\Program Files\Volt MX Iris"
```

## Production Build
  ###  builds the production application in the .next folder

```node
npm run build
```
After building, `next start` starts a Node.js server that supports hybrid pages.

  ### export as static HTML
```node
npm run export
```


<!-- CONTRIBUTING -->
## Contributing

Read our [Contributing Guide](/.github/CONTRIBUTING.md) to learn about our development process,  how to propose bug fixes and improvements and raise a pull a request.


<!-- LICENSE -->
## License

Copyright HCL America, Inc. under [Apache License](/LICENSE)

