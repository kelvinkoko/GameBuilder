import { BigButton } from "./BigButton";

type Props = {
  onContinue: () => void;
};

export function SmallScreenPrompt({ onContinue }: Props) {
  return (
    <div className="small-screen-prompt">
      <div className="ssp-card">
        <div className="ssp-emoji">📱 ➡️ 💻</div>
        <h1>Best on a tablet or laptop</h1>
        <p>Game Builder is designed for a bigger screen.</p>
        <p>You can still try here, but it may not be the best experience.</p>
        <BigButton
          icon="▶️"
          label="Try here anyway"
          variant="good"
          onClick={onContinue}
        />
      </div>
    </div>
  );
}
