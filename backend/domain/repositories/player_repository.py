from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entities.player import Player

class PlayerRepository(ABC):
    @abstractmethod
    def get_by_id(self, player_id: int) -> Optional[Player]:
        pass

    @abstractmethod
    def save(self, player: Player) -> None:
        pass

    @abstractmethod
    def all(self) -> List[Player]:
        pass