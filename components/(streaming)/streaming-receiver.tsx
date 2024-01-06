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
import GetTheApp from "../(download)/get-the-app";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function StreamingReceiver({
  className,
}: {
  className?: string;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const peerRef = useRef<Peer | null>(null);
  const [appId, setAppId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function closeConnectionToPeerServer() {
    setErrorMessage("");
    setIsLoading(false);
    closeExistingConnection();
    if (peerRef.current) {
      peerRef.current.destroy();
    }
  }
  function closeExistingConnection() {
    if (connection) {
      connection.close();
      setConnection(null);
    }
  }

  function initializeConnection(conn: DataConnection) {
    closeExistingConnection();

    conn.on("open", () => {
      setConnection(conn);
      console.log("conn open", conn.connectionId);
    });
    conn.on("data", (data) => {
      console.log("DATA", data);
    });
    conn.on("close", () => {
      setConnection(null);
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
      closeExistingConnection();
    });
    peerRef.current.on("error", (error) => {
      setErrorMessage(error.message);
      console.log("peer error", error, error.name, error.message);
    });
    peerRef.current.on("open", (id) => {
      console.log("peer open", id);
      setIsConnected(true);
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

  function handleId(id: string) {
    if (!id) {
      setErrorMessage("Please enter an ID");
      return;
    }
    if (!peerRef.current || peerRef.current.disconnected) {
      setErrorMessage("Connect to peer server first");
      return;
    }
    if (id === peerRef.current.id) {
      setErrorMessage("You can not connect to yourself");
      return;
    }
    setErrorMessage("");
    const conn = peerRef.current.connect(id);
    initializeConnection(conn);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get("app_id");
    if (appId) {
      setAppId(appId);
      connectToPeer(() => {
        if (peerRef.current) {
          handleId(appId);
        }
      });
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    connectToPeer(() => {
      if (peerRef.current) {
        handleId(appId);
      }
      setIsLoading(false);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            className,
            connection
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
            Install the Desktop app to sync your player position and spawned
            nodes with this map on every device.
            <GetTheApp />
            This Feature is in preview-release and is only available for{" "}
            <Link
              href="https://www.th.gl/support-me"
              target="_blank"
              className="text-brand underline"
            >
              Elite subscribers
            </Link>{" "}
            at the moment.
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-2 overflow-hidden">
          <p className="flex items-center gap-2">
            <span
              className={cn(
                "w-3 h-3 inline-block rounded-xl",
                connection
                  ? "bg-green-400"
                  : isConnected
                  ? "bg-yellow-500"
                  : "bg-orange-500"
              )}
            ></span>
            <span>
              {connection
                ? "Connected to app"
                : isConnected
                ? "Connected to peer server"
                : "Not connected to peer server"}
            </span>
          </p>
          <p className="uppercase text-orange-500 h-6 truncate ">
            {errorMessage}
          </p>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                type="text"
                value={appId}
                onChange={(event) => setAppId(event.target.value)}
                required
                placeholder="You can find the ID in the app"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Connect to app
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
