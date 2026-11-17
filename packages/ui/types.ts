export type NavigationItem = { label: string; href: `#${string}` };
export type Project = {
  id: string;
  title: string;
  description: string;
  alt: string;
  tags: string[];
  status: string;
};
export type Plan = { id: string; name: string; audience: string; features: string[]; monthlyBRL: number };
