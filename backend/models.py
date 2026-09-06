from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy import ForeignKey

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class UserRequest(Base):
    __tablename__ = "user_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    topic: Mapped[str]
    feedback: Mapped[str]
    created_on: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(ZoneInfo("Asia/Kolkata")).replace(microsecond=0)
    ) 
    status: Mapped[str] = mapped_column(default="pending")

class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(primary_key=True)

    kit_id: Mapped[int]

    email: Mapped[str]
    email_status: Mapped[str] = mapped_column(default="pending")

    razorpay_order_id: Mapped[str | None] = mapped_column(
        nullable=True
    )

    razorpay_payment_id: Mapped[str | None] = mapped_column(
        nullable=True
    )

    razorpay_signature: Mapped[str | None] = mapped_column(
        nullable=True
    )

    requested_on: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(
            ZoneInfo("Asia/Kolkata")
        ).replace(microsecond=0)
    )

    status: Mapped[str] = mapped_column(
        default="pending"
    )
class Kit(Base):
    __tablename__ = "kits"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    price: Mapped[int]
    description: Mapped[str]
    questions: Mapped[str]
    pdf_path: Mapped[str]   



