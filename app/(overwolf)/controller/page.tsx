import dynamic from "next/dynamic";

const Init = dynamic(() => import("./init"), {
  ssr: false,
});

export const metadata = {
  title: "Controller - Palia Map",
};

export default async function Controller() {
  return <Init />;
}
