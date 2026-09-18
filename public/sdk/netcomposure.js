/**
 * Net Composure SDK — JavaScript/Node
 *
 * Usage:
 *   const NetComposure = require("./netcomposure.js");
 *   const nc = new NetComposure("nc_live_your_key_here");
 *   await nc.checkRequest(userIp, requestData);
 */

class NetComposure {
    constructor(apiKey, baseUrl = "https://netcomposure-engine.onrender.com") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async _post(path, body, isFormData = false) {
    const headers = { Authorization: `Bearer ${this.apiKey}` };
    if (!isFormData) headers["Content-Type"] = "application/json";

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return res.json();
  }

  checkRequest(ip, data) {
    return this._post("/v1/check-request", { ip, data });
  }

  reportFailedLogin(ip) {
    return this._post("/v1/report-event", { event_type: "failed_login", ip });
  }

  reportActivity(eventType) {
    return this._post("/v1/report-activity", { event_type: eventType });
  }

  scanDependencies(ecosystem, dependencies) {
    return this._post("/v1/scan-dependencies", { ecosystem, dependencies });
  }

  scanCode(filename, code) {
    return this._post("/v1/scan-code", { filename, code });
  }

  scanFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this._post("/v1/scan-file", formData, true);
  }
}

if (typeof module !== "undefined") module.exports = NetComposure;