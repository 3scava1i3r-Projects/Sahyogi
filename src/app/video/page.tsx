"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { SiteFooter } from "@/components/ui/site-footer";
import { useState } from "react";
import { Video } from "lucide-react";
import { SiteHeader } from "@/components/ui/site-header";

export default function VideoCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomName, setRoomName] = useState("");

  const generateRandomRoom = (): string => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 30 }, () => possible[Math.floor(Math.random() * possible.length)]).join("");
  };

  const startCall = () => {
    const newRoom = generateRandomRoom();
    setRoomName(newRoom);
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setRoomName("");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <SiteHeader />

      {!isCallActive ? (
        <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-[3px] text-white/60 mb-4">
              POWERED BY JITSI MEET
            </div>
            <h1 className="text-4xl font-semibold tracking-tighter mb-3">Secure Video Calls</h1>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Start an instant encrypted video call. No account required. New room every time.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-8">
            <button
              onClick={startCall}
              className="group flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-xl font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.985] hoverable"
            >
              <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Start a Video Call
            </button>
            <p className="mt-4 text-sm text-white/50">Click to generate a private room on Jitsi Meet</p>
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full overflow-hidden">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: true,
              disableModeratorIndicator: false,
              startScreenSharing: false,
              enableEmailInStats: false,
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
            onApiReady={() => {
              // Jitsi API is ready
            }}
            onReadyToClose={() => {
              endCall();
            }}
          />
        </main>
      )}

      {isCallActive && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={endCall}
            className="rounded-xl bg-red-600/90 px-6 py-2 text-sm font-medium hover:bg-red-600 transition-colors shadow-lg hoverable"
          >
            End Call
          </button>
        </div>
      )}

      {!isCallActive && <SiteFooter />}
    </div>
  );
}
