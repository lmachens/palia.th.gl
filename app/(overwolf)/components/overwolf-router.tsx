"use client";
import { createContext, useContext, useState } from "react";

type Value = {
  name: string;
  mapName: string;
  search: string;
  coordinates: string;
};

const Context = createContext<{
  value: Value;
  update: (newValue: Partial<Value>) => void;
} | null>(null);

export const OverwolfRouterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<Value>({
    name: "",
    mapName: "kilima-valley",
    search: "",
    coordinates: "",
  });

  const update = (newValue: Partial<Value>) => {
    setValue((value) => ({ ...value, ...newValue }));
  };

  return (
    <Context.Provider
      value={{
        value,
        update,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useOverwolfRouter = () => {
  return useContext(Context);
};
