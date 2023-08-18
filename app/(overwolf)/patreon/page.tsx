import dynamic from "next/dynamic";

const Redirect = dynamic(() => import("./redirect"), {
  ssr: false,
});

export const metadata = {
  title: "Patreon - Palia Map",
};

export default function Patreon() {
  return <Redirect />;
}
