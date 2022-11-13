import { API } from "homebridge";
import { PLUGIN_NAME } from "./data/constants";
import Controller from "./controller";

export default (api: API) => api.registerPlatform(PLUGIN_NAME, Controller as any)
