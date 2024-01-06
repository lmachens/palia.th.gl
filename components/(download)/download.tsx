"use client";
import screenshot1 from "@/public/screenshots/screenshot1.jpg";
import screenshot2 from "@/public/screenshots/screenshot2.jpg";
import screenshot3 from "@/public/screenshots/screenshot3.jpg";
import screenshot4 from "@/public/screenshots/screenshot4.jpg";
import screenshot5 from "@/public/screenshots/screenshot5.jpg";
import screenshot6 from "@/public/screenshots/screenshot6.jpg";
import type { StaticImageData } from "next/image";
import { useDict } from "../(i18n)/i18n-provider";
import ContentPage from "../(layouts)/content-page";
import ImageZoomPreview from "../image-zoom-preview";
import GetTheApp from "./get-the-app";

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

export default function Download({ isScreenshot }: { isScreenshot?: boolean }) {
  const dict = useDict();
  const content = (
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
  );

  if (isScreenshot) {
    return content;
  }
  return (
    <ContentPage
      header={
        <h1 className="text-3xl font-bold mb-4">{dict.download.title}</h1>
      }
      content={
        <>
          <GetTheApp />
          {content}
          <p className="mt-8 text-gray-500">{dict.download.note}</p>
          <GetTheApp />
        </>
      }
    />
  );
}
