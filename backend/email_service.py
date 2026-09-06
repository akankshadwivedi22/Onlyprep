import os
import smtplib

from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


# ==================================================
# ENV CONFIG
# ==================================================

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


# ==================================================
# CHECK EMAIL SERVICE
# ==================================================

def check_email_service():

    # ------------------------------------------
    # Check SMTP configuration exists
    # ------------------------------------------

    if not SMTP_EMAIL or not SMTP_PASSWORD:

        print(
            "SMTP configuration is missing."
        )

        return False

    try:

        # ------------------------------------------
        # Connect to Gmail SMTP
        # ------------------------------------------

        with smtplib.SMTP(
            "smtp.gmail.com",
            587,
            timeout=10,
        ) as server:

            # ------------------------------------------
            # Start TLS
            # ------------------------------------------

            server.starttls()

            # ------------------------------------------
            # Verify SMTP credentials
            # ------------------------------------------

            server.login(
                SMTP_EMAIL,
                SMTP_PASSWORD,
            )

        print(
            "SMTP service is available."
        )

        return True

    except Exception as error:

        print(
            "SMTP service check failed:",
            error,
        )

        return False


# ==================================================
# SEND KIT EMAIL
# ==================================================

def send_kit_email(
    to_email: str,
    pdf_path: str,
    kit_title: str,
):

    message = MIMEMultipart()

    message["From"] = SMTP_EMAIL
    message["To"] = to_email
    message["Subject"] = (
        f"Your OnlyPrep {kit_title} 🎉"
    )

    # ------------------------------------------
    # Email body
    # ------------------------------------------

    body = f"""
Hi,

Thank you for choosing OnlyPrep! 💜

Your {kit_title} is attached to this email and is ready for your interview preparation.

We hope this kit helps you prepare with more confidence and less stress —
all for less than the price of a Starbucks coffee ☕✨

Wishing you the very best for your interview!

You've got this. 💪

Warm regards,
Team OnlyPrep


────────────────────────────────────

IMPORTANT

This study kit is intended for personal use by the original purchaser only.

© 2026 OnlyPrep. All rights reserved.

This PDF may not be resold, redistributed, reproduced, shared publicly,
uploaded to any website or platform, or used for commercial purposes
without prior written permission from OnlyPrep.
"""

    message.attach(
        MIMEText(
            body,
            "plain",
        )
    )

    # ==================================================
    # ATTACH PDF
    # ==================================================

    with open(
        pdf_path,
        "rb",
    ) as file:

        pdf = MIMEApplication(
            file.read(),
            _subtype="pdf",
        )

    pdf.add_header(
        "Content-Disposition",
        "attachment",
        filename=os.path.basename(pdf_path),
    )

    message.attach(pdf)

    # ==================================================
    # SEND EMAIL
    # ==================================================

    with smtplib.SMTP(
        "smtp.gmail.com",
        587,
        timeout=20,
    ) as server:

        # ------------------------------------------
        # Start TLS
        # ------------------------------------------

        server.starttls()

        # ------------------------------------------
        # Login
        # ------------------------------------------

        server.login(
            SMTP_EMAIL,
            SMTP_PASSWORD,
        )

        # ------------------------------------------
        # Send email
        # ------------------------------------------

        server.sendmail(
            SMTP_EMAIL,
            to_email,
            message.as_string(),
        )

    print(
        "Kit email sent successfully!"
    )