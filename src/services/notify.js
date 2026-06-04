// Notifications service.
// - Local notifications fire when the app detects new data on sync (works WITHOUT
//   any backend/Firebase).
// - Push (FCM) registration is scaffolded; it only activates on a native build that
//   has Firebase configured (android/app/google-services.json). All calls are
//   guarded so the web build and tests are unaffected.

let _ln;
async function localNotifs() {
  if (_ln === undefined) {
    try { _ln = (await import("@capacitor/local-notifications")).LocalNotifications; }
    catch (_) { _ln = null; }
  }
  return _ln;
}

async function isNative() {
  try {
    const { Capacitor } = await import("@capacitor/core");
    return !!(Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  } catch (_) { return false; }
}

// Show a local notification (used when new patch data arrives).
export async function notifyUpdate(title, body) {
  try {
    if (!(await isNative())) return false;
    const LN = await localNotifs();
    if (!LN) return false;
    let perm = await LN.checkPermissions();
    if (perm.display !== "granted") {
      perm = await LN.requestPermissions();
      if (perm.display !== "granted") return false;
    }
    await LN.schedule({
      notifications: [{
        id: Math.floor(Date.now() % 1000000),
        title,
        body,
        schedule: { at: new Date(Date.now() + 400) },
        smallIcon: "ic_stat_icon_config_sample",
      }],
    });
    return true;
  } catch (_) { return false; }
}

// Register for remote push (FCM). No-op unless native + Firebase configured.
export async function initPush() {
  try {
    if (!(await isNative())) return;
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== "granted") return;
    await PushNotifications.register();
    PushNotifications.addListener("registration", (t) => {
      // eslint-disable-next-line no-console
      console.log("[push] token", t.value);
    });
    PushNotifications.addListener("registrationError", (e) => {
      // eslint-disable-next-line no-console
      console.log("[push] registration error (Firebase not configured?)", e?.error);
    });
    PushNotifications.addListener("pushNotificationReceived", (n) => {
      // eslint-disable-next-line no-console
      console.log("[push] received", n?.title);
    });
  } catch (_) { /* push unavailable */ }
}
