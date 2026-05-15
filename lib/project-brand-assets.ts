export type ProjectBrandAsset = {
  src: string;
  className: string;
};

export const PROJECT_BRAND_ASSETS: Record<string, ProjectBrandAsset> = {
  feelsfast: {
    src: "/feelsfast/favicon.svg",
    className: "size-8",
  },
  uicrux: {
    src: "/uicrux-symbol.svg",
    className: "size-6",
  },
  "ux-ui-design-engineering": {
    src: "/ux-ui-d-e.png",
    className: "size-6 rounded-full object-cover",
  },
};

export const CASE_STUDY_BRAND_ASSETS: Record<string, ProjectBrandAsset> = {
  "tokens-that-travel": {
    src: "/case-studies/tokens-that-travel.svg",
    className: "size-6",
  },
};
