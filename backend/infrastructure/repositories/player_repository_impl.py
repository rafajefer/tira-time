from typing import List, Optional
from domain.entities.player import Player
from domain.repositories.player_repository import PlayerRepository

class InMemoryPlayerRepository(PlayerRepository):
    def __init__(self):
        self.players: List[Player] = []

    def get_by_id(self, player_id: int) -> Optional[Player]:
        return next((p for p in self.players if p.id == player_id), None)

    def save(self, player: Player) -> None:
        existing = self.get_by_id(player.id)
        if existing:
            existing.confirmed = player.confirmed
        else:
            self.players.append(player)

    def all(self) -> List[Player]:
        return self.players