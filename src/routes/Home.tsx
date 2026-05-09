import { useEffect, useState } from "react";
import { BigButton } from "../ui/BigButton";
import { Modal } from "../ui/Modal";
import { TEMPLATES } from "../templates";
import { listGames, deleteGame, saveGame } from "../state/library";
import type { GameProject } from "../types";

type Props = {
  onOpen: (project: GameProject) => void;
};

export function Home({ onOpen }: Props) {
  const [games, setGames] = useState<GameProject[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<GameProject | null>(null);

  async function refresh() {
    setGames(await listGames());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function startNew(template: (typeof TEMPLATES)[number]) {
    const project = template.build();
    // Auto-name with sequence so kid never has to type.
    const existing = await listGames();
    const n = existing.filter((g) => g.template === template.id).length + 1;
    project.name = template.id === "blank" ? `My game ${n}` : `${template.name} ${n}`;
    await saveGame(project);
    onOpen(project);
  }

  return (
    <>
      <header className="topbar">
        <h1>🎮 Game Builder</h1>
      </header>
      <main className="home">
        <h2>Make a new game</h2>
        <div className="template-row">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className="template-card"
              onClick={() => startNew(t)}
            >
              <span className="big-emoji">{t.emoji}</span>
              <span className="name">{t.name}</span>
            </button>
          ))}
        </div>

        {games.length > 0 && (
          <>
            <h2 style={{ marginTop: 28 }}>My games</h2>
            <div className="template-row">
              {games.map((g) => (
                <div key={g.id} className="game-card" onClick={() => onOpen(g)}>
                  <span className="big-emoji">
                    {TEMPLATES.find((t) => t.id === g.template)?.emoji ?? "🎮"}
                  </span>
                  <span className="name">{g.name}</span>
                  <button
                    className="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(g);
                    }}
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <h2>Throw away?</h2>
        <p className="confirm-text">{confirmDelete?.name}</p>
        <div className="modal-actions">
          <BigButton
            icon="❤️"
            label="Keep"
            variant="ghost"
            onClick={() => setConfirmDelete(null)}
          />
          <BigButton
            icon="🗑️"
            label="Throw away"
            variant="accent"
            onClick={async () => {
              if (confirmDelete) {
                await deleteGame(confirmDelete.id);
                setConfirmDelete(null);
                await refresh();
              }
            }}
          />
        </div>
      </Modal>
    </>
  );
}
