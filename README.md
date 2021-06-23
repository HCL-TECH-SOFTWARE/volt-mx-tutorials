# Volt MX Tutorials

![phx-dev](https://github.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/actions/workflows/intergrate.yml/badge.svg?branch=phx-dev)

## About

Volt MX Tutorials using nodejs, express and nextjs.

## Contributing

Read our [Contributing Guide](https://github.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/blob/phx-dev/.github/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements and raise a pull a request.

## Prerequisites

- npm >= 7.6.0

- node >= 15.11.1

## Commands

### Dev Build

```node

npm install

npm start

```

### HikeBuilder (Iris-Addon)

_IRIS_INSTALLATION_PATH_ = is the the full path of your IRIS directory.

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

npm run-script hikeBuilder:uninstall --path="/Applications/Volt MX Iris"
```

eg: in Windows,

```node

npm run-script hikeBuilder:uninstall --path="C:\Program Files\Volt MX Iris"
```

### Production Build

```node

npm install

npm run build

npm run export

```

Dev Url: Open `http://localhost:3200/` in your browser to see your app running.
