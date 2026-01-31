import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Inisialisasi AI dengan API Key dari Environment Variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const UNS_BLUE = "#00B5E2";

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tuju: '',   // Target Audience
    tanya: '',  // Core Message
    isi: '',    // Details
    tunjuk: '', // CTA
    gaya: 'Formal & Akademis'
  });
  const [result, setResult] = useState("");

  // 2. Fungsi untuk memproses data menggunakan AI
  const generateWithAI = async () => {
    setLoading(true);
    setError("");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Bertindaklah sebagai Creative Director profesional. 
        Tugasmu adalah membuat brief desain konten untuk Universitas Sebelas Maret (UNS).
        
        Data dari koordinator:
        - Sasaran (Target): ${formData.tuju}
        - Pesan Utama (Headline): ${formData.tanya}
        - Detail Informasi: ${formData.isi}
        - Perintah Aksi (CTA): ${formData.tunjuk}
        - Gaya Visual: ${formData.gaya}

        Buatkan brief profesional dalam format berikut:
        1. STRATEGI KONTEN (Tujuan & Audience)
        2. VISUAL HIERARCHY (Headline, Sub-headline, Body Copy, CTA)
        3. DESIGN NOTES (Rekomendasi layout dan warna sesuai Branding UNS)
        
        Gunakan bahasa yang teknis untuk desainer tapi mudah dipahami.
      `;

      const result = await model.generateContent(prompt);
      setResult(result.response.text());
      setStep(5);
    } catch (err: any) {
      setError(err.message || "Gagal memproses brief. Periksa API Key Anda.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans text-slate-800">
      {/* Header Logo UNS */}
      <div className="mb-8 text-center">
        <svg width="180" viewBox="0 0 600 280" fill={UNS_BLUE} className="mx-auto mb-2">
          <path d="M140 10c-71.8 0-130 58.2-130 130s58.2 130 130 130 130-58.2 130-130S211.8 10 140 10zm0 15c63.5 0 115 51.5 115 115s-51.5 115-115 115S25 203.5 25 140 76.5 25 140 25zM313 43h34c6.6 0 12 5.4 12 12v66.4c0 23.4-18.1 42.6-41 43.6-22.9-1-41-20.2-41-43.6V55c0-6.6 5.4-12 12-12h34v81c0 8.3 6.7 15 15 15s15-6.7 15-15V43h-31.6zm56 0h34v115h-34V43zm76 0h34v13.8c-9.9-7.5-22.2-12.1-35.5-12.8-13.8-.7-26.8 4.1-37 12.8V43h-34v115h34v-42.2c9.9 7.5 22.2 12.1 35.5 12.8 13.8.7 26.8-4.1 37-12.8v42.2h34V43h-68z"/>
        </svg>
        <h1 className="text-xl font-bold tracking-tight" style={{color: UNS_BLUE}}>APLIKASI BRIEF KREATIF</h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest">Universitas Sebelas Maret</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-t-8" style={{borderColor: UNS_BLUE}}>
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="font-semibold text-slate-500">AI sedang menyusun brief profesional...</p>
            </div>
          ) : step < 5 ? (
            <div className="space-y-6">
              {/* Progress Dot */}
              <div className="flex space-x-2">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-cyan-400' : 'bg-slate-100'}`} />
                ))}
              </div>

              <h2 className="text-2xl font-bold" style={{color: UNS_BLUE}}>
                {step === 0 && "Siapa sasarannya? (Target)"}
                {step === 1 && "Apa pesan utamanya? (Headline)"}
                {step === 2 && "Apa detailnya? (Body Copy)"}
                {step === 3 && "Apa aksinya? (Call to Action)"}
                {step === 4 && "Pilih Gaya Visual (Vibes)"}
              </h2>

              {step === 4 ? (
                <div className="grid grid-cols-1 gap-2">
                  {['Formal & Akademis', 'Ceria & Mahasiswa', 'Bold & Prestasi', 'Minimalis Modern'].map(g => (
                    <button key={g} onClick={() => setFormData({...formData, gaya: g})}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.gaya === g ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : 'border-slate-100'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea 
                  autoFocus
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-cyan-400 transition-all min-h-[120px]"
                  placeholder="Ketik di sini..."
                  value={Object.values(formData)[step]}
                  onChange={e => {
                    const keys = ['tuju', 'tanya', 'isi', 'tunjuk'];
                    setFormData({...formData, [keys[step]]: e.target.value});
                  }}
                />
              )}

              <button 
                onClick={step === 4 ? generateWithAI : nextStep}
                className="w-full text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-100 transition-transform active:scale-95"
                style={{backgroundColor: UNS_BLUE}}>
                {step === 4 ? "Buat Brief dengan AI" : "Lanjut"}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-bold" style={{color: UNS_BLUE}}>Brief Profesional Anda ✨</h2>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-600 max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                {result}
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(result); alert("Berhasil disalin!"); }}
                className="w-full text-white py-4 rounded-2xl font-bold shadow-lg" style={{backgroundColor: UNS_BLUE}}>
                Salin ke WhatsApp
              </button>
              <button onClick={() => setStep(0)} className="w-full text-slate-400 font-semibold py-2">Buat Baru</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
