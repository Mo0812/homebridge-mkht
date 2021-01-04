# homebridge-mkht

The *homebridge-mkht* plugin for the [homebridge](https://github.com/homebridge/homebridge) project allows to integrate [mk-home-temp](https://github.com/Mo0812/mk-home-temp) via a running [mk-home-server](https://github.com/Mo0812/mk-home-server) instance.
It will
## Installation

Clone this repository on the device your *homebridge* instance is running on:

```
git clone git@github.com:Mo0812/homebridge-mkht.git
```

Change into the plugins directory:

```
cd homebridge-mkht
```

Install the needed dependencies:

```
npm install
```

Link the plugin with the running *homebridge* instance:

```
npm link
```

## Configuration

With finishing the steps above, the plugin should appear in *homebridge*.

Now the *mk-home-server* instance need to be registered as an Accessory in the homebridge configuration.

The needed information are the IP address of the *mk-home-server* instance, the port of its REST API and the device ID of the attached *mk-home-temp* instance (which should be connected to the *mk-home-server* instance):

```
...
"accessories": [
    {
        "accessory": "MKHTemp",
        "name": "DEVICE NAME",
        "mkhs": {
            "ipAddr": "127.0.0.1",
            "port": "8000",
            "deviceId": 1
        }
    }
],
...
```

Now the temperature and humidity sensor should appear as Accessories in *homebridge* and can be used in HomeKit.