import dynamic from "next/dynamic";

const Exit = dynamic(() => import("./exit"), {
  ssr: false,
});

export const metadata = {
  title: "Patreon - Palia Map",
};

export default function PatreonExit() {
  return <Exit />;
}
