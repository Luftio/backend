import { Injectable } from "@nestjs/common";
import { ThingsboardService } from "../thingsboard/thingsboard.service";
import { Brightness } from "./entities/brightness.entity";
import { DeviceAttributes } from "./entities/device-attributes.entity";
import { DeviceData } from "./entities/device-data.entity";
import { Device } from "./entities/device.entity";

@Injectable()
export class DevicesService {
  constructor(private thingsboardService: ThingsboardService) {}

  async findAll(customerId: string): Promise<Device[]> {
    const devicesRequest = await this.thingsboardService.getDevices();
    const devices = devicesRequest.data
      .filter((device) => device.customerId.id == customerId)
      .map((device) => {
        return {
          id: device.id.id,
          label: device.label,
          title: device.name ? device.name : device.label,
          color: "green",
        };
      });
    return devices;
  }

  async findOne(id: string, customerId: string): Promise<Device> {
    const device = await this.thingsboardService.getDevice(id);
    if (device.customerId.id != customerId) {
      throw "Unauthorized";
    }
    return {
      id: device.id.id,
      label: device.label,
      title: device.name ? device.name : device.label,
      color: "green",
    };
  }

  async rename(id: string, customerId: string, name: string): Promise<Device> {
    const device = await this.thingsboardService.getDevice(id);
    if (device.customerId.id != customerId) {
      throw "Unauthorized";
    }
    device.name = name;
    await this.thingsboardService.saveDevice(device);
    return {
      id: device.id.id,
      label: device.label,
      title: device.name ? device.name : device.label,
      color: "green",
    };
  }

  async loadDataAll(
    customerId: string,
    startTs: Date,
    endTs: Date,
    interval: number,
  ): Promise<Device[]> {
    const devices = await this.findAll(customerId);
    return await this.loadData(devices, startTs, endTs, interval);
  }

  async loadDataOne(
    id: string,
    customerId: string,
    startTs: Date,
    endTs: Date,
    interval: number,
  ): Promise<Device> {
    const device = await this.findOne(id, customerId);
    const loadedData = await this.loadData([device], startTs, endTs, interval);
    if (loadedData.length > 0) {
      return loadedData[0];
    } else {
      return device;
    }
  }

  async loadData(
    devices: Device[],
    startTs: Date,
    endTs: Date,
    interval: number,
  ): Promise<Device[]> {
    const devicesOutput = [] as Device[];
    for (const device of devices) {
      const tsDataRequest1 = this.thingsboardService.getReadingsTimeseries(
        device.id,
        "co2,siaq",
        +startTs,
        +endTs,
        interval,
        "MAX",
      );
      const tsDataRequest2 = this.thingsboardService.getReadingsTimeseries(
        device.id,
        "temp,pres,hum",
        +startTs,
        +endTs,
        interval,
        "AVG",
      );
      const tsDataRequest = {
        ...(await tsDataRequest1),
        ...(await tsDataRequest2),
      };
      if (Object.keys(tsDataRequest).length >= 4) {
        const processData = (values: any[]) => {
          let value = 0;
          let minValue = values[0].value;
          let maxValue = values[0].value;
          for (const item of values) {
            value = Number(item.value);
            if (value < minValue) minValue = value;
            if (value > maxValue) maxValue = value;
          }
          return { value, minValue, maxValue };
        };
        const processChange = (values: any[], changeNegative: boolean) => {
          let change =
            Math.round(
              (values[0].value / values[values.length - 1].value - 1) * 10000,
            ) / 100;
          if (!changeNegative) change = -change;
          return { change };
        };
        let data = [];

        tsDataRequest.score = tsDataRequest.co2.map((it: any, i: number) => {
          let score = 0;
          const co2Eq = 100 - (Number(it.value) - 500) * 0.075;
          score += Math.min(100, Math.max(0, co2Eq)) * 4;
          let divide = 0.04;
          if (tsDataRequest.hum[i]) {
            const humidityValue = Number(tsDataRequest.hum[i].value);
            const humidityEq = 105 - Math.pow(45 - humidityValue, 2) * 0.1;
            score += Math.min(100, Math.max(0, humidityEq)) * 2;
            divide += 0.02;
          }
          if (tsDataRequest.temp[i]) {
            const tempValue = Number(tsDataRequest.temp[i].value);
            const tempEq = 105 - Math.pow(21 - tempValue, 2);
            score += Math.min(100, Math.max(0, tempEq));
            divide += 0.01;
          }
          score = Math.round(score / divide) / 100;
          return { ts: new Date(it.ts), value: score };
        });
        data.push({
          type: "score",
          unit: " %",
          values: tsDataRequest.score,
          ...processData(tsDataRequest.score),
          ...processChange(tsDataRequest.score, true),
        });
        tsDataRequest.co2 = tsDataRequest.co2.map((it: any) => ({
          ts: new Date(it.ts),
          value: Math.round(Number(it.value)),
        }));
        data.push({
          type: "CO2",
          unit: " ppm",
          values: tsDataRequest.co2,
          ...processData(tsDataRequest.co2),
          ...processChange(tsDataRequest.co2, true),
        });
        tsDataRequest.temp = tsDataRequest.temp.map((it: any) => ({
          ts: new Date(it.ts),
          value: Math.round(Number(it.value) * 100) / 100,
        }));
        if (tsDataRequest.siaq) {
          tsDataRequest.siaq = tsDataRequest.siaq.map((it: any) => ({
            ts: new Date(it.ts),
            value: Math.round(Number(it.value) * 100) / 100,
          }));
          data.push({
            type: "siaq",
            unit: " pts",
            values: tsDataRequest.siaq,
            ...processData(tsDataRequest.siaq),
            ...processChange(tsDataRequest.siaq, true),
          });
        }
        data.push({
          type: "temperature",
          unit: "°C",
          values: tsDataRequest.temp,
          ...processData(tsDataRequest.temp),
          ...processChange(tsDataRequest.temp, true),
        });
        tsDataRequest.pres = tsDataRequest.pres.map((it: any) => ({
          ts: new Date(it.ts),
          value: Math.round(Number(it.value) / 100),
        }));
        data.push({
          type: "pressure",
          unit: " hPa",
          values: tsDataRequest.pres,
          ...processData(tsDataRequest.pres),
          ...processChange(tsDataRequest.pres, true),
        });
        tsDataRequest.hum = tsDataRequest.hum.map((it: any) => ({
          ts: new Date(it.ts),
          value: Math.round(Number(it.value) * 100) / 100,
        }));
        data.push({
          type: "humidity",
          unit: " %",
          values: tsDataRequest.hum,
          ...processData(tsDataRequest.hum),
          ...processChange(tsDataRequest.hum, false),
        });

        let mainColor = "";
        data = data.map((it) => {
          let color = "red";
          if (it.value == null) {
          } else if (it.type === "score") {
            if (it.value > 75) color = "green";
            else if (it.value > 50) color = "yellow";
            mainColor = color;
          } else if (it.type === "CO2") {
            if (it.value < 1000) color = "green";
            else if (it.value < 1400) color = "yellow";
          } else if (it.type === "siaq") {
            if (it.value < 100) color = "green";
            else if (it.value < 200) color = "yellow";
          } else if (it.type === "temperature") {
            if (it.value < 24 && it.value > 19) color = "green";
            else if (it.value < 26 && it.value > 16) color = "yellow";
          } else if (it.type === "humidity") {
            if (it.value < 60 && it.value > 30) color = "green";
            else if (it.value < 70 && it.value > 20) color = "yellow";
          } else if (it.type === "pressure") {
            color = "green";
          }
          return { ...it, color };
        });
        device.color = mainColor;
        device.data = data as DeviceData[];
        const attributes = await this.thingsboardService.getAttributes(
          device.id,
        );
        device.lastActivityTime = new Date(
          attributes.find((it) => it.key === "lastActivityTime").value,
        );
        device.lastConnectTime = new Date(
          attributes.find((it) => it.key === "lastConnectTime").value,
        );
        device.lastDisconnectTime = new Date(
          attributes.find((it) => it.key === "lastDisconnectTime").value,
        );
        devicesOutput.push(device);
      }
    }
    return devicesOutput;
  }

  async getBrightness(id: string): Promise<Brightness> {
    const data = await this.thingsboardService.getAttributes(id);
    const light = data.find((it) => it.key == "light")?.value;
    const brightness = data.find((it) => it.key == "brightness")?.value;
    return {
      id,
      brightness,
      light,
    };
  }

  async setBrightness(
    id: string,
    light: string,
    brightness: number,
  ): Promise<void> {
    await this.thingsboardService.setAttributes(id, { light, brightness });
  }

  async getAttributes(id: string): Promise<DeviceAttributes> {
    const data = await this.thingsboardService.getAttributes(id);
    return { id, attributes: JSON.stringify(data) };
  }

  async setAttributes(
    id: string,
    inputData: string,
  ): Promise<DeviceAttributes> {
    await this.thingsboardService.setAttributes(id, JSON.parse(inputData));
    return await this.getAttributes(id);
  }
}
