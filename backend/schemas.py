from pydantic import BaseModel
from typing import List, Optional


class ManagerResponse(BaseModel):
    id: int
    first_name: str
    last_name: str


class SocialMediaAccountCreate(BaseModel):
    platform: str
    username: str


class SocialMediaAccountResponse(BaseModel):
    platform: str
    username: str


class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


class InfluencerCreate(BaseModel):
    first_name: str
    last_name: str
    social_media_accounts: List[SocialMediaAccountCreate] = []


class InfluencerResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    social_media_accounts: List[SocialMediaAccountResponse] = []
    manager: Optional[EmployeeResponse] = None

    class Config:
        from_attributes = True


class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True
