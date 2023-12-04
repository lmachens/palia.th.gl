"use client";
import { useAccountStore } from "@/lib/storage/account";
import Cookies from "js-cookie";
import { useDict } from "./(i18n)/i18n-provider";

export default function PatreonStatus() {
  const accountStore = useAccountStore();
  const dict = useDict();

  return (
    <>
      {!accountStore.isPatron && (
        <>
          <p className="italic text-md text-center">{dict.menu.patronInfo}</p>
          <a
            href="https://www.th.gl/support-me"
            target="_blank"
            className="my-1 p-2 text-center uppercase text-white bg-[#ff424d] hover:bg-[#ca0f25]"
          >
            {dict.menu.becomePatron}
          </a>
        </>
      )}
      {accountStore.isPatron && (
        <button
          onClick={() => {
            accountStore.setIsPatron(false);
            Cookies.remove("userId");
          }}
          className="my-1 p-2 uppercase text-white bg-[#ff424d] hover:bg-[#ca0f25]"
        >
          {dict.menu.disconnectPatreon}
        </button>
      )}
    </>
  );
}
