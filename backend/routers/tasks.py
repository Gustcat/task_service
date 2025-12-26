from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_204_NO_CONTENT

import repo
from db.session import get_async_session, SessionDep
from schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter()


@router.get("/", response_model=list[TaskRead])
async def read_tasks(session: SessionDep):
    return await repo.get_tasks(session)


@router.post("/", response_model=TaskRead)
async def create_task(task_schema: TaskCreate, session: SessionDep):
    return await repo.create_task(session, task_schema.title, task_schema.description)


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task_status(
    task_id: int,
    task_schema: TaskUpdate,
    session: SessionDep,
):
    task = await repo.get_task_or_404(session, task_id)
    return await repo.update_task(session, task, task_schema.completed)


@router.delete("/{task_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_task_endpoint(task_id: int, session: SessionDep):
    task = await repo.get_task_or_404(session, task_id)
    await repo.delete_task(session, task)
