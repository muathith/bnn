const DEMO_KEY = "bcare_demo_mode";

export const isDemoMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_KEY) === "1";
};

export const enableDemoMode = (): void => {
  if (typeof window !== "undefined") localStorage.setItem(DEMO_KEY, "1");
};

export const disableDemoMode = (): void => {
  if (typeof window !== "undefined") localStorage.removeItem(DEMO_KEY);
};
