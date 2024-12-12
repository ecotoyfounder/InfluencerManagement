from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Influencer(Base):
    __tablename__ = "influencers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    # Relationship with Employee
    manager = relationship("Employee", back_populates="influencers")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)

    # Relationship with Influencer
    influencers = relationship("Influencer", back_populates="manager")
