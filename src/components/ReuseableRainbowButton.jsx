import { RainbowButton } from "./ui/rainbow-button.jsx";

export function RainbowButtonDemo({ text, className }) {
    return <RainbowButton size="sm" className={className}>{text}</RainbowButton>;
}
