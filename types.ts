export interface BriefFormData {
  target: string; // TUJU (Target Audience)
  message: string; // TANYA (Headline/Core Message)
  details: string; // ISI (Body Copy/Supporting Info) - NEW
  action: string; // TUNJUK (CTA)
  style: string; // GAYA (Visual Direction)
}

export interface LayoutElement {
  content: string;
  instruction: string;
}

export interface GeneratedBrief {
  layoutGuide: {
    headline: LayoutElement;
    subHeadline: LayoutElement;
    bodyText: LayoutElement;
    cta: LayoutElement;
    visualStyle: {
      description: string;
      colorPalette: string;
      fontSuggestion: string;
    };
  };
  contentDraft: {
    headline: string;
    caption: string;
    hashtags: string[];
  };
}

export enum Step {
  Welcome = 0,
  Target = 1,
  Message = 2,
  Details = 3, // New Step
  Action = 4,
  Style = 5,
  Result = 6
}
