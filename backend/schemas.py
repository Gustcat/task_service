from pydantic import BaseModel, ConfigDict
from datetime import datetime


class TaskCreate(BaseModel):
    """Схема для создания задачи"""

    title: str
    description: str | None = None

    model_config = ConfigDict(extra="forbid")


class TaskRead(BaseModel):
    """Схема для чтения задачи"""

    id: int
    title: str
    description: str | None = None
    completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskUpdate(BaseModel):
    """Схема для обновления задачи"""

    completed: bool

    model_config = ConfigDict(extra="forbid")
