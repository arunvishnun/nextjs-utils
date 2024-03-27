interface RemoteConfig {
  appName: string;
  remoteName: string;
  remoteUrl: string;
  remoteModule: string;
  remoteModulePath: string;
}

const { loadRemote, init } = require("@module-federation/runtime");

export async function loadRemoteModuleServer(remoteConfig: RemoteConfig): Promise<any> {
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

export async function loadRemoteModule(remoteConfig: RemoteConfig): Promise<any> {
  try {
    const module = await loadRemoteModuleServer(remoteConfig);
    // Use the loaded module for server-side rendering or logic
    return module;
  } catch (error) {
    console.error("Failed to load remote module", error);
    return null;
  }
}
