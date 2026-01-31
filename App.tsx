import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Inisialisasi AI (Pastikan API Key sudah diset di Cloudflare)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const UNS_CYAN = "#00B5E2";

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ target: '', message: '', details: '', action: '', style: 'Formal' });

  const nextStep = () => setStep(s => s + 1);

  // 2. Fungsi Utama Generative AI
  const generateBrief = async () => {
    setLoading(true);
    setError("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Buatkan brief kreatif profesional untuk konten UNS dengan data berikut:
        Target: ${formData.target}
        Pesan: ${formData.message}
        Detail: ${formData.details}
        CTA: ${formData.action}
        Gaya: ${formData.style}
        Output harus dalam format: 1. Konsep Visual, 2. Headline & Copy, 3. Rekomendasi Layout.`;

      const res = await model.generateContent(prompt);
      setResult(res.response.text());
      setStep(6);
    } catch (err: any) {
      setError("Gagal menghubungi AI. Pastikan API KEY sudah benar di Settings Cloudflare.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans">
      {/* Header Logo UNS */}
      <div className="mb-8 text-center">
        <img src="https://cdna.uns.ac.id/wp-content/uploads/sites/10/2025/03/LOGO-UNS-01.png" className="h-20 mx-auto mb-2" alt="UNS" />
        <h1 className="font-bold text-xl uppercase tracking-tighter" style={{color: UNS_CYAN}}>Aplikasi Brief Kreatif</h1>
        <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em]">UNIVERSITAS SEBELAS MARET</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border-t-8 transition-all" style={{borderColor: UNS_CYAN}}>
        {loading ? (
          <div className="py-20 text-center animate-pulse">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="font-bold text-gray-500">AI sedang merancang brief...</p>
          </div>
        ) : step < 6 ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="flex gap-1">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-cyan-400' : 'bg-gray-100'}`} />
              ))}
            </div>

            <h2 className="text-2xl font-bold leading-tight" style={{color: UNS_CYAN}}>
              {[
                "Siapa sasarannya? (Target)", 
                "Apa pesan utamanya? (Headline)", 
                "Detail tambahannya?", 
                "Harus ngapain? (CTA)",
                "Pilih Gaya Visual",
                "Review & Generate"
              ][step]}
            </h2>

            {step === 4 ? (
              <div className="grid grid-cols-1 gap-2">
                {['Formal', 'Ceria', 'Bold', 'Minimalist'].map(g => (
                  <button key={g} onClick={() => setFormData({...formData, style: g})}
                    className={`p-4 rounded-2xl border-2 text-left ${formData.style === g ? 'border-cyan-400 bg-cyan-50' : 'border-gray-50'}`}>
                    {g}
                  </button>
                ))}
              </div>
            ) : step === 5 ? (
              <div className="text-sm bg-gray-50 p-4 rounded-xl space-y-2">
                <p><strong>Target:</strong> {formData.target}</p>
                <p><strong>Pesan:</strong> {formData.message}</p>
              </div>
            ) : (
              <textarea autoFocus className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-200 min-h-[120px]" 
                placeholder="Ketik di sini..."
                onChange={e => {
                  const keys = ['target', 'message', 'details', 'action'];
                  setFormData({...formData, [keys[step]]: e.target.value});
                }}
              />
            )}

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

            <button onClick={step === 5 ? generateBrief : nextStep} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg" style={{backgroundColor: UNS_CYAN}}>
              {step === 5 ? "Buat Brief Sekarang" : "Lanjut"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold" style={{color: UNS_BLUE}}>Hasil Brief AI ✨</h2>
            <div className="p-5 bg-slate-50 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 max-h-[400px] overflow-y-auto">
              {result}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(result); alert("Tersalin!"); }} 
              className="w-full py-4 rounded-2xl text-white font-bold" style={{backgroundColor: UNS_CYAN}}>Salin ke WhatsApp</button>
            <button onClick={() => setStep(0)} className="w-full text-gray-400 text-sm font-bold">Mulai Baru</button>
          </div>
        )}
      </div>
    </div>
  );
}
