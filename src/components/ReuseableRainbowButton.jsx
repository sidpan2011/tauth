import { RainbowButton } from "./ui/rainbow-button";

export function RainbowButtonDemo({ text, className }) {
    return <RainbowButton size="sm" className={className}>{text}</RainbowButton>;
}
