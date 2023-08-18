import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), {
  ssr: false,
});

export const metadata = {
  title: "Palia Map",
};

export default function Page() {
  return <App />;
}
