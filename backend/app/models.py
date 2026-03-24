from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Scheme(Base):
	__tablename__ = "scheme"

	id = Column(Integer, primary_key=True, index=True)
	scheme_name = Column(String, nullable=False)
	ministry = Column(String, nullable=True)
	category = Column(String, nullable=True)
	benefit_description = Column(String, nullable=True)
	apply_link = Column(String, nullable=True)
	state = Column(String, nullable=True)

	eligibility_rules = relationship(
		"EligibilityRule",
		back_populates="scheme",
		cascade="all, delete-orphan",
	)
	documents = relationship(
		"Document",
		back_populates="scheme",
		cascade="all, delete-orphan",
	)
	application_histories = relationship(
		"ApplicationHistory",
		back_populates="scheme",
		cascade="all, delete-orphan",
	)


class EligibilityRule(Base):
	__tablename__ = "eligibility_rule"

	id = Column(Integer, primary_key=True, index=True)
	scheme_id = Column(Integer, ForeignKey("scheme.id"), nullable=False, index=True)
	rule_json = Column(JSON, nullable=False)

	scheme = relationship("Scheme", back_populates="eligibility_rules")


class Document(Base):
	__tablename__ = "document"

	id = Column(Integer, primary_key=True, index=True)
	scheme_id = Column(Integer, ForeignKey("scheme.id"), nullable=False, index=True)
	document_name = Column(String, nullable=False)
	required = Column(Boolean, nullable=False, default=True)

	scheme = relationship("Scheme", back_populates="documents")


class UserProfile(Base):
	__tablename__ = "user_profile"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	age = Column(Integer, nullable=True)
	gender = Column(String, nullable=True)
	state = Column(String, nullable=True)
	income = Column(Numeric(12, 2), nullable=True)
	occupation = Column(String, nullable=True)
	land_owned = Column(Numeric(12, 2), nullable=True)
	category = Column(String, nullable=True)

	application_histories = relationship(
		"ApplicationHistory",
		back_populates="user",
		cascade="all, delete-orphan",
	)


class ApplicationHistory(Base):
	__tablename__ = "application_history"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("user_profile.id"), nullable=False, index=True)
	scheme_id = Column(Integer, ForeignKey("scheme.id"), nullable=False, index=True)
	status = Column(String, nullable=False)
	date_applied = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

	user = relationship("UserProfile", back_populates="application_histories")
	scheme = relationship("Scheme", back_populates="application_histories")
