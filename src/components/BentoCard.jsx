import { BackpackIcon, FingerprintIcon, RocketIcon, ShieldCheckIcon } from "lucide-react";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
import { LockClosedIcon } from "@radix-ui/react-icons";

const features = [
  {
    Icon: FingerprintIcon,
    name: "Biometric Keystrokes",
    description: "Every keystroke is as unique as your fingerprint. Our AI learns your typing DNA for unbreachable security.",
    href: "/how-it-works",
    cta: "See it in action",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: RocketIcon,
    name: "3-Line Integration",
    description: "Add TAuth to your app in minutes, not days. Simple SDK that works with React, Next.js, and more.",
    href: "/docs",
    cta: "View Docs",
    background: <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-blue-600/20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ShieldCheckIcon,
    name: "AI-Powered Security",
    description: "Machine learning that adapts to your typing style, getting stronger with every keystroke.",
    href: "/security",
    cta: "Learn how",
    background: <div className="absolute inset-0 bg-gradient-to-bl from-red-600/20 to-blue-600/20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BackpackIcon,
    name: "Drop-in Components",
    description: "Beautiful, pre-built authentication components that work out of the box.",
    href: "/components",
    cta: "Explore components",
    background: <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-amber-600/20 opacity-60" />,
    className: "lg:col-start-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: LockClosedIcon,
    name: "Enterprise Ready",
    description: "SOC2 certified, GDPR compliant, with SSO, audit logs, and dedicated support. Ready for your business.",
    href: "/enterprise",
    cta: "Get started",
    background: <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-emerald-600/20 opacity-60" />,
    className: "lg:col-start-3 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}