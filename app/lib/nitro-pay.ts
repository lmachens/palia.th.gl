export type NitroAds = {
  // eslint-disable-next-line no-unused-vars
  createAd: (id: string, options: any) => void;
  addUserToken: () => void;
  queue: ([string, any, (value: unknown) => void] | [string, any])[];
};

interface MyWindow extends Window {
  nitroAds: NitroAds;
}
declare let window: MyWindow;

export function getNitroAds() {
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
  return window.nitroAds;
}
