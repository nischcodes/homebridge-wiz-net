import { PlatformConfig, PlatformAccessory } from "homebridge"
import Controller from "../controller"

export interface Accessory {
	is: (device: Device) => boolean
	getName: (device: Device) => string
	init: (accessory: PlatformAccessory, device: Device, controller: Controller) => void
}

export interface Config extends PlatformConfig {
	port?: number
	enableScenes?: boolean
	broadcast?: string
	address?: string
	devices?: {
		host?: string
		mac?: string
		name?: string
	}[]
}
export interface Device {
	model: string
	ip: string
	mac: string

	lastSelectedSceneId?: number
}
