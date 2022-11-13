import { PlatformAccessory } from "homebridge"

import Controller from "../../controller"
import { initOnOff } from "../../characteristics/on-off"
import { Accessory, Device } from "../../data/types"

import {
	getPilot as _getPilot,
	setPilot as _setPilot,
} from "../../utilities/network"

const Socket: Accessory = {

	is: (device: Device) => ["ESP10_SOCKET_06"].some((id) => device.model.includes(id)),

	getName: (_: Device) => { return "Wiz Socket" },

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

		// All sockets support on/off
		initOnOff(accessory, device, controller)
	},
}

export default Socket
