import { JSX } from "react";

export type PlatformOption = {
  label: string;
  description: string;
  icon: JSX.Element;
  platform: 'mobile' | 'web';
};
export type Platform = 'mobile' | 'web';