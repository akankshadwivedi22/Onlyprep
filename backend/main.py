import os

import razorpay

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from database import SessionLocal
from models import UserRequest as UserRequestModel
from models import Purchase as PurchaseModel
from models import Kit as KitModel

from email_service import (
    send_kit_email,
    check_email_service,
)


# ==================================================
# APP SETUP
# ==================================================

app = FastAPI()

load_dotenv()


# ==================================================
# RAZORPAY CONFIG
# ==================================================

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(
    auth=(
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
    )
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# PYDANTIC MODELS
# ==================================================

class UserRequest(BaseModel):
    topic: str
    feedback: str


class Purchase(BaseModel):
    kit_id: int
    email: str


class PaymentVerification(BaseModel):
    purchase_id: int
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


# ==================================================
# USER REQUEST API
# ==================================================

@app.post("/user-requests")
def create_user_request(data: UserRequest):

    db = SessionLocal()

    try:

        db_request = UserRequestModel(
            topic=data.topic,
            feedback=data.feedback,
        )

        db.add(db_request)
        db.commit()
        db.refresh(db_request)

        return {
            "message": "Request submitted successfully!",
            "topic": data.topic,
            "feedback": data.feedback,
        }

    except Exception as error:

        db.rollback()

        print(
            "User request failed:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to submit request",
        )

    finally:

        db.close()


# ==================================================
# PURCHASE API
# ==================================================

@app.post("/purchase")
def create_purchase(data: Purchase):

    db = SessionLocal()

    try:

        # ------------------------------------------
        # Find selected kit
        # ------------------------------------------

        kit = (
            db.query(KitModel)
            .filter(
                KitModel.id == data.kit_id
            )
            .first()
        )

        if not kit:

            raise HTTPException(
                status_code=404,
                detail="Kit not found",
            )

        # ------------------------------------------
        # Check PDF BEFORE PAYMENT
        # ------------------------------------------

        pdf_path = os.path.join(
            os.path.dirname(__file__),
            "pdfs",
            kit.pdf_path,
        )

        if not os.path.exists(pdf_path):

            print(
                "PDF not found:",
                pdf_path,
            )

            raise HTTPException(
                status_code=503,
                detail=(
                    "This kit is currently unavailable. "
                    "Please try again later."
                ),
            )

        # ------------------------------------------
        # Check EMAIL SERVICE BEFORE PAYMENT
        # ------------------------------------------

        if not check_email_service():

            raise HTTPException(
                status_code=503,
                detail=(
                    "Email service is currently unavailable. "
                    "Please try again later."
                ),
            )

        # ------------------------------------------
        # Get price from DATABASE
        # ------------------------------------------

        amount = kit.price * 100

        # ------------------------------------------
        # Create Razorpay order
        # ------------------------------------------

        razorpay_order = razorpay_client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "receipt": (
                    f"kit_{data.kit_id}_{data.email}"
                ),
            }
        )

        # ------------------------------------------
        # Create purchase record
        # ------------------------------------------

        db_purchase = PurchaseModel(
            kit_id=data.kit_id,
            email=data.email,
            razorpay_order_id=razorpay_order["id"],
            status="pending",
            email_status="pending",
        )

        db.add(db_purchase)

        db.commit()

        db.refresh(db_purchase)

        # ------------------------------------------
        # Return payment information
        # ------------------------------------------

        return {
            "message": "Purchase created successfully!",
            "purchase_id": db_purchase.id,
            "kit_id": kit.id,
            "kit_title": kit.title,
            "amount": kit.price,
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": RAZORPAY_KEY_ID,
        }

    except HTTPException:

        raise

    except Exception as error:

        db.rollback()

        print(
            "Purchase creation failed:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to create purchase",
        )

    finally:

        db.close()


# ==================================================
# PAYMENT VERIFICATION API
# ==================================================

@app.post("/payment/verify")
def verify_payment(data: PaymentVerification):

    db = SessionLocal()

    try:

        # ------------------------------------------
        # Find purchase
        # ------------------------------------------

        purchase = (
            db.query(PurchaseModel)
            .filter(
                PurchaseModel.id == data.purchase_id
            )
            .first()
        )

        if not purchase:

            raise HTTPException(
                status_code=404,
                detail="Purchase not found",
            )

        # ------------------------------------------
        # Make sure Razorpay order exists
        # ------------------------------------------

        if not purchase.razorpay_order_id:

            raise HTTPException(
                status_code=400,
                detail="Razorpay order not found",
            )

        # ------------------------------------------
        # Already paid?
        # ------------------------------------------

        if purchase.status == "paid":

            return {
                "message": "Payment already verified",
                "purchase_id": purchase.id,
                "status": purchase.status,
                "email_status": purchase.email_status,
            }

        # ------------------------------------------
        # Verify Razorpay signature
        # ------------------------------------------

        razorpay_client.utility.verify_payment_signature(
            {
                "razorpay_order_id": (
                    purchase.razorpay_order_id
                ),
                "razorpay_payment_id": (
                    data.razorpay_payment_id
                ),
                "razorpay_signature": (
                    data.razorpay_signature
                ),
            }
        )

        # ==================================================
        # PAYMENT IS GENUINE
        # ==================================================

        purchase.razorpay_payment_id = (
            data.razorpay_payment_id
        )

        purchase.razorpay_signature = (
            data.razorpay_signature
        )

        purchase.status = "paid"

        # ------------------------------------------
        # Save payment as PAID first
        # ------------------------------------------

        db.commit()

        db.refresh(purchase)

        print(
            f"Payment verified successfully: "
            f"purchase_id={purchase.id}"
        )

        # ==================================================
        # FIND PURCHASED KIT
        # ==================================================

        kit = (
            db.query(KitModel)
            .filter(
                KitModel.id == purchase.kit_id
            )
            .first()
        )

        if not kit:

            purchase.email_status = "failed"

            db.commit()

            print(
                "Kit not found after successful payment:",
                purchase.kit_id,
            )

            return {
                "message": (
                    "Payment successful, but we "
                    "couldn't find your kit."
                ),
                "purchase_id": purchase.id,
                "kit_id": purchase.kit_id,
                "status": purchase.status,
                "email_status": purchase.email_status,
            }

        # ==================================================
        # PDF PATH
        # ==================================================

        pdf_path = os.path.join(
            os.path.dirname(__file__),
            "pdfs",
            kit.pdf_path,
        )

        # ==================================================
        # CHECK PDF EXISTS
        # ==================================================

        if not os.path.exists(pdf_path):

            purchase.email_status = "failed"

            db.commit()

            print(
                "PDF not found:",
                pdf_path,
            )

            return {
                "message": (
                    "Payment successful, but we "
                    "couldn't deliver your kit."
                ),
                "purchase_id": purchase.id,
                "kit_id": kit.id,
                "status": purchase.status,
                "email_status": purchase.email_status,
            }

        # ==================================================
        # SEND EMAIL
        # ==================================================

        try:

            send_kit_email(
                to_email=purchase.email,
                pdf_path=pdf_path,
                kit_title=kit.title,
            )

            # ------------------------------------------
            # Email successfully sent
            # ------------------------------------------

            purchase.email_status = "sent"

            db.commit()

            print(
                f"Kit email sent successfully: "
                f"purchase_id={purchase.id}"
            )

            return {
                "message": (
                    "Payment successful and kit "
                    "sent to your email!"
                ),
                "purchase_id": purchase.id,
                "kit_id": kit.id,
                "status": purchase.status,
                "email_status": purchase.email_status,
                "email": purchase.email,
            }

        except Exception as email_error:

            # ------------------------------------------
            # PAYMENT IS STILL PAID
            # ------------------------------------------

            print(
                "Email sending failed:",
                email_error,
            )

            purchase.email_status = "failed"

            db.commit()

            return {
                "message": (
                    "Payment successful, but we "
                    "couldn't send the kit to your email."
                ),
                "purchase_id": purchase.id,
                "kit_id": kit.id,
                "status": purchase.status,
                "email_status": purchase.email_status,
                "email": purchase.email,
            }

    # ==================================================
    # HTTP ERRORS
    # ==================================================

    except HTTPException:

        raise

    # ==================================================
    # RAZORPAY SIGNATURE ERROR
    # ==================================================

    except razorpay.errors.SignatureVerificationError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Payment verification failed",
        )

    # ==================================================
    # OTHER ERRORS
    # ==================================================

    except Exception as error:

        db.rollback()

        print(
            "Payment verification error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to verify payment",
        )

    finally:

        db.close()