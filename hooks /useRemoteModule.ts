import { useState, useEffect } from "react";
import { injectScript } from "@module-federation/nextjs-mf/utils";
import { isClient } from "../utils/is-client";

interface UseRemoteModuleParams {
  appName: string;
  remoteName: string;
  remoteUrl: string;
  remoteModulePath: string;
  remoteModule: string;
}

const useRemoteModule = <T = any>({
  appName,
  remoteName,
  remoteUrl,
  remoteModulePath,
  remoteModule,
}: UseRemoteModuleParams): React.ComponentType<T> | undefined => {
  const [module, setModule] = useState<React.ComponentType<T> | undefined>(undefined);

  useEffect(() => {
    async function loadRemoteModule() {
      try {
        const remoteConfig = await fetch(remoteUrl).then((res) => res.json());
        const { remotes } = remoteConfig;

        if (!remotes[remoteName]) {
          throw new Error(`Remote ${remoteName} not found`);
        }
        const location = isClient() ? "chunks" : "ssr";
        const remoteContainer = await injectScript({
          url: `${remotes[remoteName]}/_next/static/${location}/remoteEntry.js`,
          global: remoteName,
        });
        const factory = await remoteContainer.get(remoteModulePath);
        const Module = factory();

        setModule(() => Module.default);
      } catch (error) {
        console.error("Failed to load remote module:", error);
      }
    }

    loadRemoteModule();
  }, []);

  return module;
};

export default useRemoteModule;
