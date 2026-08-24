from fastapi import APIRouter
from app.services.replay import replay_manager
from app.models import ReplayStateResponse

router = APIRouter(prefix="/api/replay", tags=["Replay"])

@router.get("/start", response_model=ReplayStateResponse)
async def start_replay():
    """Start or resume background replay execution."""
    replay_manager.start()
    return replay_manager.get_state()

@router.get("/pause", response_model=ReplayStateResponse)
async def pause_replay():
    """Pause background replay execution."""
    replay_manager.pause()
    return replay_manager.get_state()

@router.get("/state", response_model=ReplayStateResponse)
async def get_replay_state():
    """Get current replay state and tick position."""
    return replay_manager.get_state()

@router.post("/reset", response_model=ReplayStateResponse)
async def reset_replay():
    """Reset replay to tick 0 and clear DB tables."""
    replay_manager.reset()
    return replay_manager.get_state()

@router.post("/tick")
async def manual_step_tick():
    """Advance replay by 1 tick manually."""
    res = replay_manager.step_tick()
    state = replay_manager.get_state()
    return {"step_result": res, "state": state}
