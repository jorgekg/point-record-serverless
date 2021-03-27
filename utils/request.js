const xhrRequest = require('xhr-request');

module.exports = class Request {

  sendLegacyPoint(point) {
    return new Promise((resolve, reject) => {
      xhrRequest(process.env.LEGACY_ENDPOINT, {
        method: 'POST',
        json: true,
        body: point,
        responseType: 'arraybuffer',
      }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          const enc = new TextDecoder("utf-8");
          let response = enc.decode(data);
          try {
            response = JSON.parse(response);
          } catch (errParse) {
            reject(errParse);
          }
          resolve(response);
        }
      });
    });
  }

}