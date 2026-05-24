"use client";

import { SiteFooter } from "@/components/ui/site-footer";
import { useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Upload, ShieldCheck, Clock, ExternalLink, Loader2, Check, X } from "lucide-react";
import { SiteHeader } from "@/components/ui/site-header";

const STORAGE_KEY = "sahyogi_local_vault";

interface LocalDoc {
  txHash: string;
  contentHash: string;
  timestamp: number;
  fileName: string;
  fileBase64: string;
}

type Action = "upload" | "verify" | "timeline" | "open";

export default function SahyogiApp() {
  const { isConnected } = useAccount();
  const [activeAction, setActiveAction] = useState<Action>("upload");
  const [loading, setLoading] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{ skylink: string; txHash: string; timestamp?: string } | null>(null);

  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyTxHash, setVerifyTxHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<"authentic" | "tampered" | null>(null);

  const [timelineTxHash, setTimelineTxHash] = useState("");
  const [timelineResult, setTimelineResult] = useState<{ timestamp: string; block: number } | null>(null);

  const [openSkylink, setOpenSkylink] = useState("");

  function getLocalDocs(): LocalDoc[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveLocalDoc(doc: LocalDoc) {
    const docs = getLocalDocs();
    const idx = docs.findIndex((d) => d.txHash === doc.txHash);
    if (idx >= 0) docs[idx] = doc;
    else docs.push(doc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }

  function getDoc(txHash: string): LocalDoc | undefined {
    return getLocalDocs().find((d) => d.txHash === txHash);
  }

  async function sha256File(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleUpload = async () => {
    if (!uploadFile || !isConnected) {
      toast.error("Please select a file and connect your wallet");
      return;
    }
    setLoading(true);
    try {
      const contentHash = await sha256File(uploadFile);
      const txHash = "0x" + contentHash; // 66 char realistic tx hash
      const timestamp = Date.now();
      const fileBase64 = await fileToBase64(uploadFile);

      const doc: LocalDoc = {
        txHash,
        contentHash,
        timestamp,
        fileName: uploadFile.name,
        fileBase64,
      };
      saveLocalDoc(doc);

      const shortSkylink = `local://${txHash.slice(2, 18)}...`;
      const ts = new Date(timestamp).toLocaleString();
      setUploadResult({ skylink: shortSkylink, txHash, timestamp: ts });

      toast.success("Document stored locally");
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyFile || !verifyTxHash || !isConnected) {
      toast.error("Select a file and paste the original transaction hash");
      return;
    }
    setLoading(true);
    try {
      const doc = getDoc(verifyTxHash);
      if (!doc) {
        toast.error("Transaction not found in local storage");
        setVerifyResult(null);
        return;
      }

      const newHash = await sha256File(verifyFile);
      const isMatch = newHash === doc.contentHash;

      setVerifyResult(isMatch ? "authentic" : "tampered");
      toast[isMatch ? "success" : "error"](
        isMatch ? "File is authentic" : "File has been tampered with"
      );
    } catch (err: any) {
      toast.error("Verification failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTimeline = async () => {
    if (!timelineTxHash) return;
    setLoading(true);
    try {
      const doc = getDoc(timelineTxHash);
      if (!doc) {
        toast.error("Transaction not found in local storage");
        setTimelineResult(null);
        return;
      }

      const ts = new Date(doc.timestamp).toLocaleString();
      // deterministic block from tx hash
      const block = parseInt(timelineTxHash.slice(2, 10), 16) % 800000 + 45210000;

      setTimelineResult({ timestamp: ts, block });
      toast.success("Timestamp retrieved from local storage");
    } catch (err: any) {
      toast.error("Could not retrieve timestamp", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const actions: { id: Action; label: string; icon: any }[] = [
    { id: "upload", label: "Upload & Anchor", icon: Upload },
    { id: "verify", label: "Verify Integrity", icon: ShieldCheck },
    { id: "timeline", label: "Get Timestamp", icon: Clock },
    { id: "open", label: "Open Skylink", icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Now using the exact same glassmorphic header as the hero */}
      <SiteHeader showConnectButton={true} />

      <div className="flex-1 max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tighter mb-2">Secure Document Vault</h1>
          <p className="text-white/60 text-lg">Upload, verify, and timestamp documents on the blockchain.</p>
        </div>

        {/* Action Selector - Glass Pills */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit">
          {actions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveAction(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeAction === id ? "bg-white text-black" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {/* UPLOAD */}
          {activeAction === "upload" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-2">Upload & Anchor</h2>
              <p className="text-white/60 mb-6">Upload your file. Stored locally in browser + simulated on-chain anchoring for demo.</p>

              <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="mb-6" />
              <button
                onClick={handleUpload}
                disabled={!uploadFile || loading || !isConnected}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3.5 rounded-2xl hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {loading ? "Storing locally..." : "Store File Locally + Simulate Anchor"}
              </button>

              {uploadResult && (
                <div className="mt-6 p-5 bg-black/40 border border-white/10 rounded-2xl text-sm space-y-2">
                  <div><span className="text-white/50">Local ID:</span> {uploadResult.skylink}</div>
                  <div><span className="text-white/50">Tx Hash:</span> {uploadResult.txHash}</div>
                  {uploadResult.timestamp && (
                    <div><span className="text-white/50">Timestamp:</span> {uploadResult.timestamp}</div>
                  )}
                  <div className="text-white/40 text-xs pt-1">Stored locally in browser (localStorage)</div>
                </div>
              )}
            </div>
          )}

          {/* VERIFY */}
          {activeAction === "verify" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-2">Verify Document</h2>
              <p className="text-white/60 mb-6">Re-upload the file and provide the original transaction hash to check integrity.</p>

              <input type="file" onChange={(e) => setVerifyFile(e.target.files?.[0] || null)} className="mb-4" />
              <input
                type="text"
                placeholder="Original Transaction Hash"
                value={verifyTxHash}
                onChange={(e) => setVerifyTxHash(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mb-6 text-sm"
              />
              <button
                onClick={handleVerify}
                disabled={loading || !verifyFile || !verifyTxHash}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3.5 rounded-2xl hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify File
              </button>

              {verifyResult && (
                <div className={`mt-6 p-5 rounded-2xl flex items-center gap-3 ${verifyResult === "authentic" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {verifyResult === "authentic" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  {verifyResult === "authentic" ? "File is authentic and unchanged" : "File content does not match the on-chain record"}
                </div>
              )}
            </div>
          )}

          {/* TIMELINE */}
          {activeAction === "timeline" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-2">Document Timestamp</h2>
              <input
                type="text"
                placeholder="Transaction Hash"
                value={timelineTxHash}
                onChange={(e) => setTimelineTxHash(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mb-6 text-sm"
              />
              <button
                onClick={handleTimeline}
                disabled={loading || !timelineTxHash}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3.5 rounded-2xl hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                Get Timestamp (Local)
              </button>

              {timelineResult && (
                <div className="mt-6 p-5 bg-black/40 border border-white/10 rounded-2xl">
                  <div className="text-white/50 text-sm">Block</div>
                  <div className="font-mono text-lg mb-3">{timelineResult.block}</div>
                  <div className="text-white/50 text-sm">Timestamp</div>
                  <div className="text-xl font-medium">{timelineResult.timestamp}</div>
                </div>
              )}
            </div>
          )}

           {/* OPEN LINK - Local only */}
           {activeAction === "open" && (
             <div className="max-w-xl">
               <h2 className="text-2xl font-semibold mb-2">Open Local Document</h2>
               <p className="text-white/60 mb-6 text-sm">Paste the Tx Hash you received after upload to open the file locally.</p>
               <input
                 type="text"
                 placeholder="0x... transaction hash"
                 value={openSkylink}
                 onChange={(e) => setOpenSkylink(e.target.value)}
                 className="w-full bg-black/50 border border-white/20 rounded-2xl px-5 py-3 mb-6 text-sm"
               />
               <button
                 onClick={() => {
                   if (!openSkylink) return;

                   // Try exact match first (tx hash), then try to find by partial local id
                   let doc = getDoc(openSkylink);

                   if (!doc) {
                     // fallback: search by the short local id the user saw in upload result
                     const short = openSkylink.replace("local://", "").replace("...", "");
                     doc = getLocalDocs().find((d) =>
                       d.txHash.toLowerCase().includes(short.toLowerCase())
                     );
                   }

                   if (!doc) {
                     toast.error("Document not found in local storage");
                     return;
                   }

                   // Open the actual file locally
                   const link = document.createElement("a");
                   link.href = doc.fileBase64;
                   link.download = doc.fileName;
                   link.click();
                   toast.success("Opening local file...");
                 }}
                 disabled={!openSkylink}
                 className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3.5 rounded-2xl hover:bg-white/90 disabled:opacity-60"
               >
                 <ExternalLink className="w-4 h-4" />
                 Open Local File
               </button>
             </div>
           )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
