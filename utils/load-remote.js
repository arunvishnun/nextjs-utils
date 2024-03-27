import useRemoteModule from "../hooks/useRemoteModule";
import { isClient } from "./is-client";

export async function loadRemoteModuleServer(remoteConfig) {
  const { loadRemote, init } = require("@module-federation/runtime");
  const { appName, remoteName, remoteUrl, remoteModule, remoteModulePath } = remoteConfig;

  const remoteEntryUrl = `${remoteUrl}/_next/static/ssr/remoteEntry.js`;

  init({
    name: appName,
    remotes: [
      {
        name: remoteName,
        entry: remoteEntryUrl,
      },
    ],
  });

  return loadRemote(`${remoteName}/${remoteModule}`);
}

export async function loadRemoteModule(remoteConfig) {
  if (isClient()) {
    return useRemoteModule(remoteConfig);
  } else {
    // Server-side: await the promise
    try {
      const module = await loadRemoteModuleServer(remoteConfig);
      // Use the loaded module for server-side rendering or logic
      return module;
    } catch (error) {
      console.error("Failed to load remote module", error);
      return null;
    }
  }
}
