import { CharacteristicSetCallback, CharacteristicValue, PlatformAccessory } from "homebridge"

import Controller from "../../controller"
import { Device } from "../../data/types"
import { Pilot, getPilot, setPilot } from "../../pilotes/on-off"

import {
	getPilot as _getPilot,
	setPilot as _setPilot,
} from "../../utilities/network"

function transformOnOff(pilot: Pilot) {
	return Number(pilot.state)
}

export function initOnOff( accessory: PlatformAccessory, device: Device, controller: Controller ) {
	const { Characteristic, Service } = controller

	const service = accessory.getService(Service.Outlet)!

	service
		.getCharacteristic(Characteristic.On)
		.on("get", callback =>
			getPilot(
				controller,
				accessory,
				device,
				pilot => callback(null, transformOnOff(pilot)),
				callback
			)
		)
		.on(
			"set",
			(newValue: CharacteristicValue, next: CharacteristicSetCallback) => {
				setPilot(controller, accessory, device, { state: Boolean(newValue) }, next)
			}
		)
}
