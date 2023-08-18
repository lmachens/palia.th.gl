export type GameSession = {
  name: string;
  traceLine: {
    x: number;
    y: number;
    z: number;
    timestamp: number;
  }[];
};

export function startNewGameSession() {
  return new Promise((resolve) => {
    const newSession = {
      name: Date.now().toString(),
      traceLine: [],
    };
    overwolf.io.writeFileContents(
      `${overwolf.io.paths.documents}\\Palia Map\\sessions\\${newSession.name}.json`,
      JSON.stringify(newSession),
      "UTF8" as overwolf.io.enums.eEncoding.UTF8,
      true,
      () => resolve(newSession)
    );

    return newSession;
  });
}

export function getGameSessionNames(): Promise<string[]> {
  return new Promise((resolve) => {
    overwolf.io.dir(
      `${overwolf.io.paths.documents}\\Palia Map\\sessions`,
      (result) => {
        if (result.data) {
          const gameSessions = result.data
            .filter((file) => file.type === "file")
            .map((file) => file.name);
          resolve(gameSessions);
        } else {
          resolve([]);
        }
      }
    );
  });
}

export async function getGameSession(name: string): Promise<GameSession> {
  return new Promise((resolve, reject) => {
    overwolf.io.readFileContents(
      `${overwolf.io.paths.documents}\\Palia Map\\sessions\\${name}`,
      "UTF8" as overwolf.io.enums.eEncoding.UTF8,
      (result) => {
        if (result.content) {
          try {
            const gameSession = JSON.parse(result.content) as GameSession;
            resolve(gameSession);
          } catch (e) {
            reject();
          }
        } else {
          reject();
        }
      }
    );
  });
}

export async function getLatestGameSession(): Promise<GameSession> {
  const gameSessionNames = await getGameSessionNames();
  if (gameSessionNames.length === 0) {
    await startNewGameSession();
    return getLatestGameSession();
  }
  const sortedGameSessionNames = gameSessionNames.sort();
  return getGameSession(
    sortedGameSessionNames[sortedGameSessionNames.length - 1]
  );
}

export async function setGameSession(gameSession: GameSession): Promise<void> {
  return new Promise((resolve) => {
    overwolf.io.writeFileContents(
      `${overwolf.io.paths.documents}\\Palia Map\\sessions\\${gameSession.name}.json`,
      JSON.stringify(gameSession),
      "UTF8" as overwolf.io.enums.eEncoding.UTF8,
      true,
      () => resolve()
    );
  });
}

export async function addTraceLineItem(item: {
  x: number;
  y: number;
  z: number;
}) {
  const latestSession = await getLatestGameSession();
  latestSession.traceLine.push({ ...item, timestamp: Date.now() });
  await setGameSession(latestSession);
}
