export function generateSdkFile(apiKey: string, engineUrl: string): string {
  return `/**
 * Net Composure SDK - personalized for your project
 * This file contains your real API key. Do NOT commit it to Git -
 * add "netcomposure.js" to your .gitignore.
 *
 * Usage:
 *   const nc = require("./netcomposure.js");
 *   const result = await nc.checkRequest(userIp, requestData);
 */

const API_KEY = "${apiKey}";
const BASE_URL = "${engineUrl}";

class NetComposure {
  async _post(path, body, isFormData = false) {
    const headers = { Authorization: \`Bearer \${API_KEY}\` };
    if (!isFormData) headers["Content-Type"] = "application/json";

    const res = await fetch(\`\${BASE_URL}\${path}\`, {
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

const netcomposure = new NetComposure();

if (typeof module !== "undefined") module.exports = netcomposure;
`;
}
