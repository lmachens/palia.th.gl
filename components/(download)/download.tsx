"use client";
import screenshot1 from "@/public/screenshots/screenshot1.jpg";
import screenshot2 from "@/public/screenshots/screenshot2.jpg";
import screenshot3 from "@/public/screenshots/screenshot3.jpg";
import screenshot4 from "@/public/screenshots/screenshot4.jpg";
import screenshot5 from "@/public/screenshots/screenshot5.jpg";
import screenshot6 from "@/public/screenshots/screenshot6.jpg";
import type { StaticImageData } from "next/image";
import NitroAds from "../(ads)/nitro-ads";
import WideSkyscraper from "../(ads)/wide-skyscrapper";
import { useDict } from "../(i18n)/i18n-provider";
import ImageZoomPreview from "../image-zoom-preview";
import { trackOutboundLinkClick } from "../plausible-tracker";

const FeatureCard = ({
  title,
  description,
  emoji,
  image,
}: {
  title: string;
  description: string;
  emoji: string;
  image: StaticImageData;
}) => {
  return (
    <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 space-y-4 text-center">
      <h2 className="uppercase tracking-wide text-sm text-white font-semibold">
        {title} {emoji}
      </h2>
      <p className="mt-2 text-gray-300">{description}</p>
      <ImageZoomPreview image={image} />
    </div>
  );
};

const GetTheApp = () => {
  const dict = useDict();

  return (
    <a
      href="https://download.overwolf.com/install/Download?Name=Palia+Map&ExtensionId=fgbodfoepckgplklpccjedophlahnjemfdknhfce&Channel=web_dl_btn"
      target="_blank"
      className="flex pointer-events-auto items-center gap-1 md:rounded-lg bg-orange-600 hover:bg-orange-500 text-white uppercase px-2 py-1 justify-center whitespace-nowrap w-fit mx-auto my-4"
      onClick={() => trackOutboundLinkClick("Overwolf Download Button")}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M17.8 20l-12 -1.5c-1 -.1 -1.8 -.9 -1.8 -1.9v-9.2c0 -1 .8 -1.8 1.8 -1.9l12 -1.5c1.2 -.1 2.2 .8 2.2 1.9v12.1c0 1.2 -1.1 2.1 -2.2 1.9z"></path>
        <path d="M12 5l0 14"></path>
        <path d="M4 12l16 0"></path>
      </svg>
      <span>{dict.download.download}</span>
    </a>
  );
};

export default function Download() {
  const dict = useDict();
  return (
    <div className="grow flex justify-center pt-[50px]">
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-5" />
      </NitroAds>
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{dict.download.title}</h1>
        <GetTheApp />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            title={dict.download.realTimePosition.title}
            description={dict.download.realTimePosition.description}
            emoji="📍"
            image={screenshot6}
          />
          <FeatureCard
            title={dict.download["2ndScreenMode"].title}
            description={dict.download["2ndScreenMode"].description}
            emoji="📺"
            image={screenshot1}
          />
          <FeatureCard
            title={dict.download.overlayMode.title}
            description={dict.download.overlayMode.description}
            emoji="🌟"
            image={screenshot2}
          />
          <FeatureCard
            title={dict.download.weeklyWants.title}
            description={dict.download.weeklyWants.description}
            emoji="🎁"
            image={screenshot3}
          />
          <FeatureCard
            title={dict.download.filteringOptions.title}
            description={dict.download.filteringOptions.description}
            emoji="🔍"
            image={screenshot4}
          />
          <FeatureCard
            title={dict.download.multiLanguageSupport.title}
            description={dict.download.multiLanguageSupport.description}
            emoji="🌐"
            image={screenshot5}
          />
        </div>
        <p className="mt-8 text-gray-500">{dict.download.note}</p>
        <GetTheApp />
      </div>
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-6" />
      </NitroAds>
    </div>
  );
}
