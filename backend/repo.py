from typing import Type

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc
from db.models import Task
from exceptions import TaskNotFoundError, TaskAlreadyExistsError


async def get_tasks(session: AsyncSession) -> list[Task]:
    stmt = select(Task).order_by(asc(Task.completed), desc(Task.created_at))
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def create_task(
    session: AsyncSession, title: str, description: str | None = None
):
    task = Task(title=title, description=description)
    session.add(task)
    try:
        await session.flush()
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        if getattr(e.orig, "pgcode", None) == "23505":
            raise TaskAlreadyExistsError(title)
        raise
    return task


async def update_task(session: AsyncSession, task: Task, completed: bool) -> Task:
    task.completed = completed
    await session.flush()
    await session.commit()
    return task


async def delete_task(session: AsyncSession, task: Task):
    await session.delete(task)
    await session.commit()


async def get_task_or_404(session: AsyncSession, task_id: int) -> Type[Task]:
    task = await session.get(Task, task_id)
    if not task:
        raise TaskNotFoundError(task_id)
    return task
