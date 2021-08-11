import { Injectable } from "@nestjs/common";
import { ThingsboardService } from "../thingsboard/thingsboard.service";
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

  async loadDataAll(customerId: string): Promise<Device[]> {
    const devices = await this.findAll(customerId);
    return await this.loadData(devices);
  }

  async loadDataOne(id: string, customerId: string): Promise<Device> {
    const device = await this.findOne(id, customerId);
    return (await this.loadData([device]))[0];
  }

  async loadData(devices: Device[]): Promise<Device[]> {
    const devicesOutput = [] as Device[];
    for (const device of devices) {
      const startTs = +new Date() - 24 * 3600000;
      const endTs = +new Date();
      const interval = 600000;
      const tsDataRequest = await this.thingsboardService.getReadingsTimeseries(
        device.id,
        "co2,temp,pres,hum",
        startTs,
        endTs,
        interval,
      );
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
          let co2Eq = 100 - (Number(it.value) - 500) * 0.075;
          score += Math.min(100, Math.max(0, co2Eq)) * 4;
          let humidityValue = Number(tsDataRequest.hum[i].value);
          let humidityEq = 105 - Math.pow(45 - humidityValue, 2) * 0.1;
          score += Math.min(100, Math.max(0, humidityEq)) * 2;
          let tempValue = Number(tsDataRequest.temp[i].value);
          let tempEq = 105 - Math.pow(21 - tempValue, 2);
          score += Math.min(100, Math.max(0, tempEq));
          score = Math.round(score / 0.07) / 100;
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
        data.push({
          type: "temperature",
          unit: "°C",
          values: tsDataRequest.temp,
          ...processData(tsDataRequest.temp),
          ...processChange(tsDataRequest.temp, true),
        });
        tsDataRequest.pres = tsDataRequest.pres.map((it: any) => ({
          ts: new Date(it.ts),
          value: Math.round(Number(it.value)) / 100,
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
            if (it.value < 600) color = "green";
            else if (it.value < 1200) color = "yellow";
          } else if (it.type === "temperature") {
            if (it.value < 24 && it.value > 18) color = "green";
            else if (it.value < 26 && it.value > 16) color = "yellow";
          } else if (it.type === "humidity") {
            if (it.value < 60 && it.value > 40) color = "green";
            else if (it.value < 70 && it.value > 30) color = "yellow";
          } else if (it.type === "pressure") {
            color = "green";
          }
          return { ...it, color };
        });
        device.color = mainColor;
        device.data = data as DeviceData[];
        devicesOutput.push(device);
      }
    }
    return devicesOutput;
  }
}
