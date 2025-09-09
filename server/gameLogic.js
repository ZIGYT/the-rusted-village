const ROLES = ['Killer', 'Doctor', 'Villager', 'Judge', 'Butcher'];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeGame(players) {
  let shuffledPlayers = shuffle([...players]);
  let gameState = {
    phase: 'night',
    players: shuffledPlayers.map((p, i) => ({
      ...p,
      role: ROLES[i % ROLES.length],
      alive: true,
      action: null
    })),
    chat: [],
    votes: []
  };
  return gameState;
}

module.exports = { handleGameLogic: { initializeGame } };