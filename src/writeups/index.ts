import { JSCalc } from "./JSCalc";
import { BabyNginxatsu } from "./BabyNginxatsu";
import { TagInfo } from "./tags";
import { PopRestaurant } from "./PopRestaurant";
import { RenderQuest } from "./RenderQuest";
import { Insomnia } from "./Insomnia";
import { NoThreshold } from "./NoThreshold";
import { DoxPit } from "./DoxPit";

export type WriteupType = {
  title: string;
  slug: string;
  author: string;
  authorLink: string;
  challengeLink: string;
  tags: TagInfo[];
  synopsis: string;
  reflection: JSX.Element;
  content: JSX.Element;
  timeTaken: string;
};

export type ReflectionItem = {
  value: string;
  icon: JSX.Element;
  title: JSX.Element | string;
  content: JSX.Element;
};

export const WriteupInfo: Record<string, WriteupType> = {
  jscalc: JSCalc,
  "baby-nginxatsu": BabyNginxatsu,
  "pop-restaurant": PopRestaurant,
  "render-quest": RenderQuest,
  insomnia: Insomnia,
  "no-threshold": NoThreshold,
  doxpit: DoxPit,
};
