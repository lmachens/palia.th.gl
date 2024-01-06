"use client";
import { cn } from "@/lib/utils";
import type { DataConnection } from "peerjs";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import QR from "./streaming-qr";
import { create } from "zustand";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { useShallow } from "zustand/react/shallow";

const useConnectionStore = create<{
  connections: Record<string, DataConnection>;
  addConnection: (conn: DataConnection) => void;
  closeExistingConnection: (peer: string) => void;
  closeExistingConnections: () => void;
  initializeConnection: (conn: DataConnection) => void;
}>((set) => ({
  connections: {},
  addConnection: (conn) => {
    set((state) => ({
      connections: {
        ...state.connections,
        [conn.peer]: conn,
      },
    }));
  },
  closeExistingConnection: (peer) => {
    set((state) => {
      const next = { ...state.connections };
      delete next[peer];
      return { connections: next };
    });
  },
  closeExistingConnections: () => {
    set({ connections: {} });
  },
  initializeConnection: (conn) => {
    set((state) => {
      const next = { ...state.connections };
      next[conn.peer] = conn;
      return { connections: next };
    });
  },
}));

export default function StreamingSender({ className }: { className?: string }) {
  const connectionStore = useConnectionStore();
  const [isConnected, setIsConnected] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const peerRef = useRef<Peer | null>(null);
  const [appId, setAppId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const liveGameInfo = useGameInfoStore(
    useShallow((state) => ({
      player: state.player,
      villagers: state.villagers,
      otherPlayers: state.otherPlayers,
      spawnNodes: state.spawnNodes,
      currentGiftPreferences: state.currentGiftPreferences,
    }))
  );

  function sendToConnections(data: any) {
    Object.values(connectionStore.connections).forEach((conn) => {
      conn.send(data);
    });
  }

  useEffect(() => {
    sendToConnections({ player: liveGameInfo.player });
  }, [liveGameInfo.player]);
  useEffect(() => {
    sendToConnections({ villagers: liveGameInfo.villagers });
  }, [liveGameInfo.villagers]);
  useEffect(() => {
    sendToConnections({ otherPlayers: liveGameInfo.otherPlayers });
  }, [liveGameInfo.otherPlayers]);
  useEffect(() => {
    sendToConnections({ spawnNodes: liveGameInfo.spawnNodes });
  }, [liveGameInfo.spawnNodes]);
  useEffect(() => {
    sendToConnections({
      currentGiftPreferences: liveGameInfo.currentGiftPreferences,
    });
  }, [liveGameInfo.currentGiftPreferences]);

  function closeConnectionToPeerServer() {
    setErrorMessage("");
    setIsLoading(false);
    connectionStore.closeExistingConnections();
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  }

  function initializeConnection(conn: DataConnection) {
    connectionStore.closeExistingConnection(conn.peer);

    conn.on("open", () => {
      connectionStore.addConnection(conn);
      console.log("conn open", conn.connectionId);
    });
    conn.on("close", () => {
      connectionStore.closeExistingConnection(conn.peer);
      console.log("conn close", conn.connectionId);
    });
    conn.on("error", (error) => {
      console.log("conn error", error);
    });
  }

  function connectToPeer(onOpen?: () => void) {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    peerRef.current = new Peer();
    peerRef.current.on("close", () => {
      console.log("peer close");
      setIsConnected(false);
      connectionStore.closeExistingConnections();
    });
    peerRef.current.on("error", (error) => {
      setErrorMessage(error.message);
      console.log("peer error", error, error.name, error.message);
    });
    peerRef.current.on("open", (id) => {
      console.log("peer open", id);
      setIsConnected(true);
      setAppId(id);
      if (onOpen) {
        onOpen();
      }
    });
    peerRef.current.on("connection", (conn) => {
      console.log("peer connection", conn);
      initializeConnection(conn);
    });
    peerRef.current.on("disconnected", (connectionId) => {
      console.log("peer disconnected", connectionId);
      setIsConnected(false);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    connectToPeer(() => {
      setIsLoading(false);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            className,
            Object.keys(connectionStore.connections).length > 0
              ? "text-green-400"
              : isConnected
              ? "text-yellow-500"
              : "text-orange-500"
          )}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 4v8" />
            <path d="M16 4.5v7" />
            <path d="M12 5v16" />
            <path d="M8 5.5v5" />
            <path d="M4 6v4" />
            <path d="M20 8h-16" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Live Mode Sync</DialogTitle>
          <DialogDescription>
            Stream the player position and spawned nodes by connecting t a
            browser on your favorite device (phone, tablet, PC). The connection
            is peer-to-peer and does not go through our servers. A server is
            only used to establish the connection.
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-2">
          <p className="flex items-center gap-2">
            <span
              className={cn(
                "w-3 h-3 inline-block rounded-xl",
                Object.keys(connectionStore.connections).length > 0
                  ? "bg-green-400"
                  : isConnected
                  ? "bg-yellow-500"
                  : "bg-orange-500"
              )}
            ></span>
            <span>
              {Object.keys(connectionStore.connections).length > 0
                ? `Connected to ${
                    Object.keys(connectionStore.connections).length
                  } browser`
                : isConnected
                ? "Waiting for a browser to connect"
                : "Not ready to connect"}
            </span>
          </p>
          <p className="uppercase text-orange-500 h-6">{errorMessage}</p>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="appId">App ID (click to copy)</Label>
              <Button
                type="button"
                id="appId"
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(appId)}
                disabled={!appId}
              >
                {appId || "No app ID"}
              </Button>
              <QR
                value={
                  appId
                    ? `https://palia.th.gl?app_id=${appId}`
                    : "https://palia.th.gl"
                }
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Connect to streaming server
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!isConnected}
              className="w-full"
              onClick={() => closeConnectionToPeerServer()}
            >
              Disconnect
            </Button>
          </form>
        </section>
      </DialogContent>
    </Dialog>
  );
}
