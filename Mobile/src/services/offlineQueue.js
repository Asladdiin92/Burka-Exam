import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "ethioprep_offline_queue";
const DEVICE_KEY = "ethioprep_device_id";

function makeId() {
  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
}

export async function getDeviceId() {
  let deviceId = await AsyncStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = makeId();
    await AsyncStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}

export async function queueMutation(change) {
  const current = JSON.parse(await AsyncStorage.getItem(QUEUE_KEY) || "[]");
  const queued = { ...change, clientMutationId: change.clientMutationId || makeId(), queuedAt: new Date().toISOString() };
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...current, queued]));
  return queued;
}

export async function getQueuedMutations() {
  return JSON.parse(await AsyncStorage.getItem(QUEUE_KEY) || "[]");
}

export async function syncQueuedMutations(request) {
  const queued = await getQueuedMutations();
  if (!queued.length) return { remaining: 0, changes: [] };
  const result = await request("/notes/sync", { method: "POST", body: JSON.stringify({ deviceId: await getDeviceId(), changes: queued }) });
  const failed = new Set(result.changes.filter((change) => change.status !== "applied").map((change) => change.clientMutationId));
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queued.filter((change) => failed.has(change.clientMutationId))));
  return { ...result, remaining: failed.size };
}

export const getQueue = getQueuedMutations;

