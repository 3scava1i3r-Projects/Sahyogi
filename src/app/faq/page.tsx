import { SiteFooter } from "@/components/ui/site-footer";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/ui/site-header";

const faqs = [
  { q: "Why should we use it?", a: ["More Secure", "You have full control over your documents", "Immutable records", "Built-in Timestamping", "No fraud documents possible", "Decentralized — if one node fails, others support it"] },
  { q: "How much can we rely on its Security and Authentication?", a: "Earlier your data was under the control of one central server. Now you get full control of your data. Even if someone wants to hack it, they would need at least 51% of the computational power of the entire network — which is practically impossible." },
  { q: "Can there be any fraud or 3rd party involvement like in centralized systems?", a: "No. There is no involvement of any third party. The system is based on Blockchain which works on the principle of 'help without trust'. Cryptographic hashes make it extremely secure and reliable." },
  { q: "How is it convenient to use?", a: ["Medical records not accessible to unauthorized parties", "Full control over who can access your documents/data", "Saves Time, Paper, Money, and Movement", "No more carrying bulky physical documents everywhere"] },
  { q: "How is it better than traditional methods of file storage?", a: ["Serverless architecture", "No worry of server going down", "Immutable — records cannot be altered", "Zero chance of fraud documents", "Significantly more secure"] },
  { q: "In which other fields can this technology be used?", a: ["Defence", "Health & Medical Records", "Office / Business Documentation", "Education (certificates, transcripts)", "Crime Investigation & Legal Records", "And many more..."] },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tighter mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-white/70">Everything you need to know about Sahyogi</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white/5 border border-white/10 rounded-2xl p-4 open:border-white/20 transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-lg">
                {faq.q}
                <span className="text-white/50 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 text-white/80 leading-relaxed pl-1">
                {Array.isArray(faq.a) ? (
                  <ul className="space-y-1.5 list-disc pl-5">
                    {faq.a.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : (
                  <p>{faq.a}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
