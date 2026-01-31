import React, { useState, useEffect } from 'react';
import { Step, BriefFormData, GeneratedBrief } from './types';
import { generateCreativeBrief } from './services/geminiService';
import { StepCard } from './components/StepCard';
import { Button } from './components/Button';

const STEPS_TOTAL = 6;

// Icon sets using standard emojis
const ICONS = {
  welcome: "🏛️",
  target: "🎯",
  message: "📢",
  details: "📝",
  action: "👆",
  style: "🎨",
  loading: "⚙️",
  result: "✅"
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Welcome);
  const [formData, setFormData] = useState<BriefFormData>({
    target: '',
    message: '',
    details: '',
    action: '',
    style: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < Step.Style) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > Step.Welcome) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateField = (field: keyof BriefFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedBrief = await generateCreativeBrief(formData);
      setResult(generatedBrief);
      setCurrentStep(Step.Result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setError(`Gagal memproses brief: ${errorMessage}. Coba lagi atau periksa koneksi/API Key.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const { layoutGuide, contentDraft } = result;
    
    const text = `
*BRIEF KREATIF UNS*
------------------
*PANDUAN VISUAL HIERARCHY*

1. HEADLINE (Visual Terbesar):
"${layoutGuide.headline.content}"
(Instruksi: ${layoutGuide.headline.instruction})

2. SUB-HEADLINE (Konteks):
"${layoutGuide.subHeadline.content}"
(Instruksi: ${layoutGuide.subHeadline.instruction})

3. BODY COPY (Detail Info):
"${layoutGuide.bodyText.content}"
(Instruksi: ${layoutGuide.bodyText.instruction})

4. CTA (Tombol):
"${layoutGuide.cta.content}"
(Instruksi: ${layoutGuide.cta.instruction})

*ARAHAN VISUAL*
Palette: ${layoutGuide.visualStyle.colorPalette}
Mood: ${layoutGuide.visualStyle.description}

*DRAFT CAPTION (IG/Medsos)*
------------------
${contentDraft.headline}

${contentDraft.caption}

${contentDraft.hashtags.map(t => `#${t.replace('#', '')}`).join(' ')}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Brief berhasil disalin! Siap dikirim ke WhatsApp Group.");
  };

  const resetApp = () => {
    setFormData({ target: '', message: '', details: '', action: '', style: '' });
    setResult(null);
    setCurrentStep(Step.Welcome);
  };

  const renderProgressBar = () => {
    if (currentStep === Step.Welcome || currentStep === Step.Result) return null;
    const progress = (currentStep / (STEPS_TOTAL - 1)) * 100;
    return (
      <div className="w-full max-w-md mx-auto mb-8 px-4">
        <div className="flex justify-between text-xs font-semibold text-uns-cerulean mb-2">
          <span>Progress Brief</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-uns-sky transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <StepCard 
          title="Menyusun Brief..." 
          description="Sistem sedang memformat data sesuai standar Branding UNS." 
          icon={ICONS.loading}
        >
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-uns-cerulean border-t-uns-yellow"></div>
            <p className="text-sm text-gray-400">Mohon tunggu sebentar</p>
          </div>
        </StepCard>
      );
    }

    // Common styling for inputs/textareas
    const inputClasses = "w-full p-4 bg-uns-yellow/20 border-2 border-uns-yellow/30 rounded-lg focus:border-uns-cerulean focus:ring-1 focus:ring-uns-cerulean outline-none text-uns-cerulean placeholder-uns-cerulean/40 text-base mb-6 transition-colors font-medium";

    switch (currentStep) {
      case Step.Welcome:
        return (
          <StepCard 
            title="Aplikasi Brief UNS" 
            description="Tools resmi Tim Humas untuk membuat brief desain konten yang terstruktur dan sesuai brand guideline." 
            icon={ICONS.welcome}
          >
            <div className="bg-sky-50 p-4 rounded-lg mb-6 border border-sky-100">
               <h4 className="font-bold text-uns-cerulean text-sm mb-1">Panduan Singkat:</h4>
               <ul className="text-xs text-gray-600 list-disc ml-4 space-y-1">
                 <li>Isi data tahap demi tahap.</li>
                 <li>Gunakan bahasa yang jelas.</li>
                 <li>Hasil otomatis diformat untuk Desainer.</li>
               </ul>
            </div>
            <Button fullWidth onClick={handleNext}>Buat Brief Baru</Button>
            <p className="text-xs text-center text-gray-400 mt-6">Universitas Sebelas Maret © {new Date().getFullYear()}</p>
          </StepCard>
        );

      case Step.Target:
        return (
          <StepCard 
            title="TUJU (Target Audience)" 
            description="Siapa sasaran utama konten ini?" 
            icon={ICONS.target}
          >
            <input 
              autoFocus
              type="text" 
              className={inputClasses}
              placeholder="Contoh: Mahasiswa Baru Jalur SNBP, Dosen, Alumni..."
              value={formData.target}
              onChange={(e) => updateField('target', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && formData.target && handleNext()}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="w-1/3">Kembali</Button>
              <Button fullWidth onClick={handleNext} disabled={!formData.target} className="w-2/3">Lanjut</Button>
            </div>
          </StepCard>
        );

      case Step.Message:
        return (
          <StepCard 
            title="TANYA (Pesan Utama)" 
            description="Apa pesan inti yang ingin disampaikan? (Akan menjadi Headline Terbesar)." 
            icon={ICONS.message}
          >
            <textarea 
              autoFocus
              rows={3}
              className={inputClasses}
              placeholder="Contoh: PENDAFTARAN WISUDA PERIODE III DIBUKA..."
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="w-1/3">Kembali</Button>
              <Button fullWidth onClick={handleNext} disabled={!formData.message} className="w-2/3">Lanjut</Button>
            </div>
          </StepCard>
        );

      case Step.Details:
        return (
          <StepCard 
            title="ISI (Detail Informasi)" 
            description="Apa saja informasi pendukung yang wajib ada? (Syarat, Waktu, Lokasi)." 
            icon={ICONS.details}
          >
            <textarea 
              autoFocus
              rows={4}
              className={inputClasses}
              placeholder="Contoh: Senin 20 Mei 2024, di Auditorium UNS. Wajib bawa KTM."
              value={formData.details}
              onChange={(e) => updateField('details', e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="w-1/3">Kembali</Button>
              <Button fullWidth onClick={handleNext} disabled={!formData.details} className="w-2/3">Lanjut</Button>
            </div>
          </StepCard>
        );

      case Step.Action:
        return (
          <StepCard 
            title="TUNJUK (Call to Action)" 
            description="Apa perintah aksi untuk audiens?" 
            icon={ICONS.action}
          >
             <input 
              autoFocus
              type="text" 
              className={inputClasses}
              placeholder="Contoh: Kunjungi uns.ac.id, Cek Email UNS..."
              value={formData.action}
              onChange={(e) => updateField('action', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && formData.action && handleNext()}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="w-1/3">Kembali</Button>
              <Button fullWidth onClick={handleNext} disabled={!formData.action} className="w-2/3">Lanjut</Button>
            </div>
          </StepCard>
        );

      case Step.Style:
        const styles = [
          { id: 'Formal & Akademis', desc: 'Sesuai standar universitas' },
          { id: 'Ceria & Mahasiswa', desc: 'Warna-warni, ilustrasi fun' },
          { id: 'Bold & Prestasi', desc: 'Tegas, foto dokumentasi kuat' },
          { id: 'Minimalis & Modern', desc: 'Clean, banyak white space' },
        ];
        return (
          <StepCard 
            title="GAYA (Visual Direction)" 
            description="Bagaimana nuansa visual yang diinginkan?" 
            icon={ICONS.style}
          >
            <div className="grid grid-cols-1 gap-3 mb-6">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFormData(prev => ({ ...prev, style: s.id }))}
                  className={`p-4 rounded-lg text-left transition-all border group
                    ${formData.style === s.id 
                      ? 'bg-uns-cerulean text-white border-uns-cerulean shadow-md' 
                      : 'bg-white border-gray-200 hover:border-uns-cerulean hover:shadow-sm text-gray-700'
                    }`}
                >
                  <span className="block font-bold text-sm">{s.id}</span>
                  <span className={`text-xs ${formData.style === s.id ? 'text-gray-200' : 'text-gray-500'}`}>{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="w-1/3">Kembali</Button>
              <Button fullWidth onClick={submitForm} disabled={!formData.style} className="w-2/3">Generate Brief</Button>
            </div>
          </StepCard>
        );

      case Step.Result:
        if (!result) return null;
        return (
          <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
            
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-uns-yellow/20 text-4xl mb-3">{ICONS.result}</div>
              <h2 className="text-2xl font-bold text-uns-cerulean uppercase tracking-wide">Brief Kreatif Siap</h2>
              <p className="text-gray-500 text-sm">Silakan salin dan kirim ke Tim Desain.</p>
            </div>

            {/* Visual Hierarchy Guide */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
               <div className="bg-uns-cerulean p-5 text-white flex justify-between items-center">
                 <div>
                   <h3 className="font-bold text-lg flex items-center gap-2">
                     Panduan Visual Hierarchy
                   </h3>
                   <p className="text-xs text-white opacity-80">Instruksi layout berdasarkan branding UNS</p>
                 </div>
                 <div className="h-8 w-8 bg-uns-yellow rounded-full border-2 border-white"></div>
               </div>
               
               <div className="p-6 space-y-6">
                 {/* Hierarchy Elements */}
                 <div className="space-y-4">
                    <div className="border-l-4 border-uns-cerulean pl-4 py-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. Headline (Visual Utama)</label>
                        <p className="text-xl font-bold text-gray-900 mt-1">"{result.layoutGuide.headline.content}"</p>
                        <p className="text-sm text-uns-cerulean mt-1">ℹ️ {result.layoutGuide.headline.instruction}</p>
                    </div>

                    <div className="border-l-4 border-uns-sky pl-4 py-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Sub-Headline / Konteks</label>
                        <p className="text-lg font-medium text-gray-800 mt-1">"{result.layoutGuide.subHeadline.content}"</p>
                        <p className="text-sm text-gray-500 mt-1">ℹ️ {result.layoutGuide.subHeadline.instruction}</p>
                    </div>

                    <div className="border-l-4 border-gray-300 pl-4 py-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Body Copy (Detail)</label>
                        <p className="text-base text-gray-600 mt-1 whitespace-pre-line">"{result.layoutGuide.bodyText.content}"</p>
                        <p className="text-sm text-gray-500 mt-1">ℹ️ {result.layoutGuide.bodyText.instruction}</p>
                    </div>

                    <div className="border-l-4 border-uns-yellow pl-4 py-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">4. CTA Element</label>
                        <div className="mt-2 inline-block px-4 py-2 bg-gray-100 rounded text-gray-800 font-bold border border-gray-200">
                          {result.layoutGuide.cta.content}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">ℹ️ {result.layoutGuide.cta.instruction}</p>
                    </div>
                 </div>

                 {/* Branding Note */}
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                    <h4 className="font-bold text-sm text-uns-cerulean mb-2 uppercase">Brand Guidelines Note:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Warna:</span>
                        <p className="text-gray-600">{result.layoutGuide.visualStyle.colorPalette}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Font & Style:</span>
                        <p className="text-gray-600">{result.layoutGuide.visualStyle.fontSuggestion}</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Social Media Draft */}
             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50">
                 <h3 className="font-bold text-gray-700 text-sm uppercase">Draft Caption Medsos</h3>
               </div>
               <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">{result.contentDraft.headline}</h4>
                  <p className="whitespace-pre-line text-gray-600 mb-4 leading-relaxed">{result.contentDraft.caption}</p>
                  <p className="text-uns-cerulean text-sm">{result.contentDraft.hashtags.map(t => `#${t.replace('#', '')}`).join(' ')}</p>
               </div>
            </div>

            <div className="flex flex-col gap-3 sticky bottom-4 z-10">
              <Button onClick={copyToClipboard} variant="primary" className="shadow-xl">
                Salin Brief ke WhatsApp 📋
              </Button>
              <Button onClick={resetApp} variant="outline" className="bg-white">
                Buat Brief Baru 🔄
              </Button>
            </div>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800 flex flex-col items-center">
      
      {/* UNS Header */}
      {currentStep !== Step.Result && (
        <header className="mb-8 text-center animate-fade-in-down w-full max-w-md">
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
             {/* Official UNS Logo */}
             <img 
               src="https://cdna.uns.ac.id/wp-content/uploads/sites/10/2025/03/LOGO-UNS-01.png" 
               alt="Logo UNS" 
               className="h-24 w-auto drop-shadow-sm hover:scale-105 transition-transform duration-300"
             />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-uns-cerulean uppercase">Aplikasi Brief Kreatif</h1>
          <p className="text-xs text-gray-500 tracking-widest font-semibold">UNIVERSITAS SEBELAS MARET</p>
        </header>
      )}

      {renderProgressBar()}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg w-full max-w-md text-center text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold underline">Tutup</button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default App;