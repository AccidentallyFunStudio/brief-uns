import { BriefFormData, GeneratedBrief } from "../types";

export const generateCreativeBrief = async (data: BriefFormData): Promise<GeneratedBrief> => {
  // Endpoint Cloudflare Worker baru Anda
  const endpoint = "https://wandering-lab-e1ae.shafryyusuf.workers.dev/";

  // Mapping data dari format Frontend (BriefFormData) ke format API Worker
  const payload = {
    tuju: data.target,    // Target Audience
    tanya: data.message,  // Core Message
    isi: data.details,    // Details
    tunjuk: data.action,  // Call to Action
    gaya: data.style      // Visual Style
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    // Worker mengembalikan JSON yang sesuai dengan interface GeneratedBrief
    return result as GeneratedBrief;

  } catch (error) {
    console.error("Error generating brief:", error);
    // Melempar error agar bisa ditangkap dan ditampilkan di UI (App.tsx)
    throw error;
  }
};