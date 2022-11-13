# homebridge-wiz-net
Control Wiz products over network.

## Based of
- [kpsuperplane/homebridge-wiz-lan](https://github.com/kpsuperplane/homebridge-wiz-lan#readme)

## Currently supports
- Wiz Plugs/Outlets (ESP10_SOCKET_06, ESP25_SOCKET_01)

# Installation

Make sure your bulbs are already set up via the Wiz app and you have "Allow Local Communication" set to ON in your settings.

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-wiz-net`
3. Update your configuration file. See the sample below.

# Configuration
Simple Configuration:

```javascript
{
	"platform": "WizSmartHome",
	"name": "WizSmartHome",
}
```

Full configuration options:

```javascript
{
	"platform": "WizSmartHome",
	"name": "Wiz",

	// [Optional] Port for bulbs to connect to your server
	// Default: 38900
	"port": 38900,

	// [Optional] Enable scenes support for your bulbs
	// Default: false
	"enableScenes": false,

	// [Optional] UDP Broadcast address for bulb discovery
	// Default: 255.255.255.255
	"broadcast": "255.255.255.255",

	// [Optional] Your server's IP address
	// Default: Autodiscovered
	"address": "192.168.0.1",

	// [Optional] Manual list of IP addresses of bulbs
	// Useful if UDP broadcast doesn't work for some reason
	// Default: None
	"devices": [
		{ "host": "192.168.0.2" },
		{ "host": "192.168.0.3" },
		{ "host": "192.168.0.4" },
		// ...
	]
}
```

## Some Notes

### Color

The Wiz bulbs strongly distinguish between RGB color modes and Kelvin color modes, **the latter being significantly brighter**. Unfortunately, HomeKit is not very good at handling both at the same time, [yielding weird errors if you try to add both characteristics](https://github.com/home-assistant/home-assistant/pull/30756).

Luckily, even if we only enable the color mode, we still get a nice temperature picker. Problem is, the color temperature is given in standard HSV. As such, this app will try to guess which one to best use given a color, and you will notice some significant brightness variance switching between a "temp" hue and a "color" hue.

**In particular, since the Wiz bulbs only support up to 6500K, this means that only the top-ish half of the temperature picker is actually bright**

# Development
Ideas from http://blog.dammitly.net/2019/10/cheap-hackable-wifi-light-bulbs-or-iot.html?m=1

## Contributing

Mostly built for my own personal use - so no active development. Feel free to fork and contribute.

## How bulbs are discovered

Make a UDP broadcast to port 38899 with the following content:

```
{"method":"registration","params":{"phoneMac":"<my_mac_address>","register":false,"phoneIp":"<my_ip_address>"}}
```

You will get a response on port 38900 with the following content:

```
{"method":"registration","env":"pro","result":{"mac":"<light_address>","success":true}}
```

# License
See LICENSE file
