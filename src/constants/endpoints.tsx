const BASE_URL = process.env.serverHost;
export const LOGIN_ENDPOINT = `${BASE_URL}/api/v1/sales/auth/login`;
export const PASSWORD_REQUEST_ENDPOINT = `${BASE_URL}/api/v1/sales/auth/password/reset-request`;
export const AGENT_EVENTS_ENDPOINT = `${BASE_URL}/api/v1/sales/agent/events`;