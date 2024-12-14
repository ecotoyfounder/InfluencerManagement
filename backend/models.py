from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Influencer(Base):
    __tablename__ = "influencers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    social_media_accounts = relationship("SocialMediaAccount", back_populates="influencer")

    # Relationship with Employee
    manager = relationship("Employee", back_populates="influencers")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)

    # Relationship with Influencer
    influencers = relationship("Influencer", back_populates="manager")

class SocialMediaAccount(Base):
    __tablename__ = "social_media_accounts"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)
    username = Column(String(50), nullable=False)
    influencer_id = Column(Integer, ForeignKey("influencers.id"))
    influencer = relationship("Influencer", back_populates="social_media_accounts")

    __table_args__ = (
            UniqueConstraint("platform", "username", name="unique_platform_username"),
        )