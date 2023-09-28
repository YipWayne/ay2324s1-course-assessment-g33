from fastapi import APIRouter, HTTPException
from config import get_config
import requests
from model.judge import JudgeInput, JudgeOutput, Submission
router = APIRouter(
    prefix="/api/v1/judge",
    tags=["judge"],
    responses={404: {"description": "Not found"}},
)
config = get_config()

@router.post("/submission")
async def add_submission(data: JudgeInput):
    try:
        response = requests.post(config.judge_service_url + "/submissions?wait=true", json=data.dict())
        response.raise_for_status()
        jo = JudgeOutput(**response.json())
        submission = Submission(submission=data, feedback=jo).json()
        response = requests.post(config.question_service_url + "/submission", submission)
        response.raise_for_status()
        return jo
    except Exception:
        return response.reason


@router.get("/submission", response_model= JudgeOutput)
async def get_submission(token:str):
    try:
        response = requests.get(config.judge_service_url + f"/submissions/{token}?base64_encoded=true")
        response.raise_for_status()
        return response.json()
    except Exception:
        return response.reason

@router.get("/submissions")
async def get_submissions():
    try:
        response = requests.get(config.judge_service_url + "/submissions/?base64_encoded=true")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return response.reason


@router.get("/languages")
async def get_all_languages():
    response = requests.get(config.judge_service_url + "/languages")
    return response.json()

@router.post("authorize")
async def authorize():
    try:
        response = requests.post(config.judge_service_url + "/authorize")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return response.reason
