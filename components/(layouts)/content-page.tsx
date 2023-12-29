import LargeMobileBanner from "../(ads)/large-mobile-banner";
import MobileBanner from "../(ads)/mobile-banner";
import NitroAds from "../(ads)/nitro-ads";
import WideSkyscraper from "../(ads)/wide-skyscrapper";

export default function ContentPage({
  header,
  content,
}: {
  header: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="flex grow pt-[50px]">
      <div>
        <NitroAds>
          <WideSkyscraper id="palia-wide-skyscraper-1" />
        </NitroAds>
      </div>
      <div className="container p-4 text-center space-y-4">
        {header}
        <LargeMobileBanner id="palia-large-mobile-banner" />
        {content}
        <MobileBanner id="palia-mobile-banner" />
      </div>
      <div>
        <NitroAds>
          <WideSkyscraper id="palia-wide-skyscraper-2" />
        </NitroAds>
      </div>
    </div>
  );
}
