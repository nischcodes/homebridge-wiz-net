import { PlatformAccessory } from "homebridge"

import Controller from "../../controller"
import { Device } from "../../data/types"
import {
	getPilot as _getPilot,
	setPilot as _setPilot,
} from "../../utilities/network"

export interface Pilot {
	mac: string
	rssi: number
	src: string
	state: boolean
}

// We need to cache all the state values
// since we need to send them all when
// updating, otherwise the bulb resets
// to default values
export const cachedPilot: { [mac: string]: Pilot } = {}

function updatePilot(
	controller: Controller,
	accessory: PlatformAccessory,
	_: Device,
	pilot: Pilot | Error
) {
	const { Service } = controller
	const service = accessory.getService(Service.Outlet)!

	service
		.getCharacteristic(controller.Characteristic.On)
		.updateValue(pilot instanceof Error ? pilot : Number(pilot.state))
}

// Write a custom getPilot/setPilot that takes this
// caching into account
export function getPilot(
	controller: Controller,
	accessory: PlatformAccessory,
	device: Device,
	onSuccess: (pilot: Pilot) => void,
	onError: (error: Error) => void
) {
	const { Service } = controller
	const service = accessory.getService(Service.Outlet)!
	let callbacked = false
	const onDone = (error: Error | null, pilot: Pilot) => {
		const shouldCallback = !callbacked
		callbacked = true
		if (error !== null) {
			if (shouldCallback) {
				onError(error)
			} else {
				service.getCharacteristic(controller.Characteristic.On).updateValue(error)
			}
			delete cachedPilot[device.mac]
			return
		}
		cachedPilot[device.mac] = pilot
		if (shouldCallback) {
			onSuccess(pilot)
		} else {
			updatePilot(controller, accessory, device, pilot)
		}
	}
	const timeout = setTimeout(() => {
		if (device.mac in cachedPilot) {
			onDone(null, cachedPilot[device.mac])
		} else {
			onDone(new Error("No response within 1s"), undefined as any)
		}
	}, 1000)
	_getPilot<Pilot>(controller, device, (error, pilot) => {
		clearTimeout(timeout)
		onDone(error, pilot)
	})
}

export function setPilot(
	controller: Controller,
	_: PlatformAccessory,
	device: Device,
	pilot: Partial<Pilot>,
	callback: (error: Error | null) => void
) {
	const oldPilot = cachedPilot[device.mac]
	if (typeof oldPilot == "undefined") {
		return
	}
	const newPilot = {
		...oldPilot,
		state: oldPilot.state ?? false,
		...pilot,
		sceneId: undefined,
	}

	cachedPilot[device.mac] = {
		...oldPilot,
		...newPilot,
	} as any
	return _setPilot(controller, device, newPilot, (error) => {
		if (error !== null) {
			cachedPilot[device.mac] = oldPilot
		}
		callback(error)
	})
}
