const axios = require("axios");

module.exports = (api) => {
    api.registerAccessory("MKHTempPlugin", "MKHTemp", MKHTempAccessory);
};

class MKHTempAccessory {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;

        // extract name from config
        this.name = config.name;

        // your accessory must have an AccessoryInformation service
        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(
                this.api.hap.Characteristic.Manufacturer,
                "Moritz Kanzler"
            )
            .setCharacteristic(
                this.api.hap.Characteristic.Model,
                "MKHTemp 1.0"
            );

        // create a new "Temperature" service
        this.mkhtTemperatureService = new this.api.hap.Service.TemperatureSensor(
            this.name
        );

        // link methods used when getting or setting the state of the service
        this.mkhtTemperatureService
            .getCharacteristic(this.Characteristic.CurrentTemperature)
            .on("get", this.handleCurrentTemperatureGet.bind(this));

        // create a new "Temperature" service
        this.mkhtHumidityService = new this.api.hap.Service.HumiditySensor(
            this.name
        );

        // link methods used when getting or setting the state of the service
        this.mkhtHumidityService
            .getCharacteristic(this.Characteristic.CurrentRelativeHumidity)
            .on("get", this.handleCurrentHumidityGet.bind(this));
    }

    getServices() {
        return [
            this.informationService,
            this.mkhtTemperatureService,
            this.mkhtHumidityService,
        ];
    }

    /**
     * Handle requests to get the current value of the "Current Temperature" characteristic
     */
    async handleCurrentTemperatureGet(callback) {
        var temperature = 1;
        const url = this.config.mkhs.ipAddr + ":" + this.config.mkhs.port;
        const deviceId = this.config.mkhs.deviceId;
        try {
            temperature = await this.requestData(url, deviceId, "temperature");
        } catch (e) {
            this.log.error(e);
        }
        const currentValue = temperature;

        callback(null, currentValue);
    }

    async handleCurrentHumidityGet(callback) {
        var humidity = 1;
        const url = this.config.mkhs.ipAddr + ":" + this.config.mkhs.port;
        const deviceId = this.config.mkhs.deviceId;
        try {
            humidity = await this.requestData(url, deviceId, "humidity");
        } catch (e) {
            this.log.error(e);
        }
        const currentValue = humidity;

        callback(null, currentValue);
    }

    async requestData(url, deviceId, value) {
        try {
            let response = await axios({
                method: "GET",
                url: `http://${url}/mkht/current/${deviceId}`,
            });
            if (response.status == 200) {
                return response.data[value];
            }
        } catch (e) {
            throw new Error("MKHS API not reachable");
        }
    }
}
