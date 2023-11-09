"use client";
import Cookies from "js-cookie";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useAccountStore } from "../lib/storage/account";
import TwitchEmbed from "./twitch-embed";

type NitroAds = {
  // eslint-disable-next-line no-unused-vars
  createAd: (id: string, options: any) => void;
  addUserToken: () => void;
  queue: ([string, any, (value: unknown) => void] | [string, any])[];
};

interface MyWindow extends Window {
  nitroAds: NitroAds;
}
declare let window: MyWindow;

if (typeof window !== "undefined") {
  window.nitroAds = window.nitroAds || {
    createAd: function () {
      return new Promise(function (e) {
        // eslint-disable-next-line prefer-rest-params
        window.nitroAds.queue.push(["createAd", arguments, e]);
      });
    },
    addUserToken: function () {
      // eslint-disable-next-line prefer-rest-params
      window.nitroAds.queue.push(["addUserToken", arguments]);
    },
    queue: [],
  };
}

export default function NitroPay() {
  const accountStore = useAccountStore();
  const [showFallback, setShowFallback] = useState<boolean | null>(null);

  useEffect(() => {
    let userId = Cookies.get("userId");
    const refreshState = async () => {
      if (!userId) {
        const state = useAccountStore.getState();
        if (state.isPatron) {
          accountStore.setIsPatron(false);
        }
        return;
      }

      const response = await fetch(
        `https://www.th.gl/api/patreon?appId=fgbodfoepckgplklpccjedophlahnjemfdknhfce`,
        { credentials: "include" }
      );
      try {
        const body = await response.json();
        if (!response.ok) {
          console.warn(body);
          accountStore.setIsPatron(false);
        } else {
          console.log(`Patreon successfully activated`);
          accountStore.setIsPatron(true, userId);
        }
      } catch (err) {
        console.error(err);
        accountStore.setIsPatron(false);
      }
    };
    refreshState();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newUserId = Cookies.get("userId");
        if (newUserId !== userId) {
          userId = newUserId;
          refreshState();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (showFallback === false || accountStore.isPatron) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setShowFallback(true);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showFallback]);

  if (accountStore.isPatron) {
    return <></>;
  }

  const handleLoad = () => {
    setShowFallback(false);
    window["nitroAds"].createAd("palia-video", {
      format: "video-nc",
      debug: "silent",
    });
  };

  return (
    <>
      <Script
        src="https://s.nitropay.com/ads-1487.js"
        onLoad={handleLoad}
        onError={() => {
          setShowFallback(true);
        }}
      />
      <div id="palia-video" className={showFallback ? "" : "w-full h-56"} />
      {showFallback && <TwitchEmbed onClose={() => setShowFallback(false)} />}
    </>
  );
}
