from domain.entities.player import Player
from domain.repositories.player_repository import PlayerRepository

class PresenceService:
    def __init__(self, repository: PlayerRepository):
        self.repository = repository

    def confirm_presence(self, player_id: int, name: str) -> Player:
        player = self.repository.get_by_id(player_id)
        if not player:
            player = Player(id=player_id, name=name, confirmed=True)
        else:
            player.confirmed = True

        self.repository.save(player)
        return player

    def list_present_players(self):
        return [p for p in self.repository.all() if p.confirmed]