from dataclasses import dataclass

@dataclass
class Player:
    id: int
    nick: str
    confirmed: bool = False