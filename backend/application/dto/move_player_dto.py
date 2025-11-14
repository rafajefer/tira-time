from pydantic import BaseModel
from typing import Literal


class Move_Player_Input(BaseModel):
    name: str
    room_type: Literal["confirmation_room", "game_room"]