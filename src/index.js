const { pick, map } = require('./common/lodash/index');
const request = require('../src/fetch/index');

const istanbulMarmaray = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const json = await request(
        'https://web.trafi.com/api/schedules/istanbul/all?transportType=metro',
      );
      const data = pick(json, ['schedulesByTransportId']).schedulesByTransportId;
      const schedulesMarmaray = map(data, (props) => pick(props, ['schedules']).schedules)[1];
      const stopsByIdMarmarayData = await stopsById(schedulesMarmaray);

      const { transportNamePlural, transportName } = pick(data[1], [
        'transportNamePlural',
        'transportName',
      ]);
      const obj = Object.assign(
        {},
        {
          transportNamePlural,
          transportName,
          marmaray: stopsByIdMarmarayData,
        },
      );
      resolve(obj);
    } catch (error) {
      const e = new Error(error);
      reject(e.message);
    }
  });
};

const istanbulMetro = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const json = await request(
        'https://web.trafi.com/api/schedules/istanbul/all?transportType=metro',
      );
      const data = pick(json, ['schedulesByTransportId']).schedulesByTransportId;
      const schedulesMetro = map(data, (props) => pick(props, ['schedules']).schedules)[0];
      const stopsByIdMetroData = await stopsById(schedulesMetro);

      const { transportNamePlural, transportName } = pick(data[0], [
        'transportNamePlural',
        'transportName',
      ]);
      const obj = Object.assign(
        {},
        {
          transportNamePlural,
          transportName,
          metro: stopsByIdMetroData,
        },
      );
      resolve(obj);
    } catch (error) {
      const e = new Error(error);
      reject(e.message);
    }
  });
};

const allStops = async (scheduleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const json = await request(
        `https://web.trafi.com/api/schedules/istanbul/schedule?scheduleId=${scheduleId}&transportType=metro`,
      );
      resolve(json);
    } catch (error) {
      const e = new Error(error);
      reject(e.message);
    }
  });
};

const stopsById = (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = map(
        obj,
        async (props) =>
          new Promise(async (resolve, reject) => {
            try {
              const scheduleId = props.scheduleId;
              const transportId = props.transportId;
              const validity = props.validity;
              const name = props.name;
              const longName = props.longName;
              const icon = props.icon;
              const color = props.color;
              const stops = await allStops(scheduleId);
              resolve({
                scheduleId,
                transportId,
                validity,
                name,
                longName,
                icon,
                color,
                stops,
              });
            } catch (error) {
              const e = new Error(error);
              reject(e.message);
            }
          }),
      );
      const resolveStopsByIdData = await Promise.all(data);
      resolve(resolveStopsByIdData);
    } catch (error) {
      const e = new Error(error);
      reject(e);
    }
  });
};

module.exports = {
  istanbulMetro,
  istanbulMarmaray,
};
