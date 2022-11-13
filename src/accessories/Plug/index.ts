import { PlatformAccessory } from "homebridge"

import Controller from "../../controller"
import { initOnOff } from "../../characteristics/on-off"
import { Accessory, Device } from "../../data/types"

import {
	getPilot as _getPilot,
	setPilot as _setPilot,
} from "../../utilities/network"

const Plug: Accessory = {

	is: (device: Device) => ["ESP25_SOCKET_01"].some((id) => device.model.includes(id)),

	getName: (_: Device) => { return "Wiz Plug" },

	init: (
		accessory: PlatformAccessory,
		device: Device,
		controller: Controller
	) => {
		const { Service } = controller

		// Setup the outlet service
		let service = accessory.getService(Service.Outlet)

		if (typeof service === "undefined") {
			service = new Service.Outlet(accessory.displayName)
			accessory.addService(service)
		}

		// All plugs support on/off
		initOnOff(accessory, device, controller)
	},
}

export default Plug
