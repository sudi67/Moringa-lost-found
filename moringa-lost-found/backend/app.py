# app.py
from flask import Flask, request, jsonify
import requests, base64, os
from datetime import datetime
from requests.auth import HTTPBasicAuth

def create_app():
    app = Flask(__name__)

    # Use environment variables for security
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    shortcode = "174379"
    passkey = os.getenv("MPESA_PASSKEY")
    callback_url = os.getenv("MPESA_CALLBACK_URL")  # better to use env var here

    def get_token():
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
        if response.status_code == 200:
            return response.json().get("access_token")
        else:
            app.logger.error("Failed to get access token: %s", response.text)
            return None

    def generate_password():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        raw = shortcode + passkey + timestamp
        password = base64.b64encode(raw.encode()).decode()
        return password, timestamp

    @app.route("/api/pay", methods=["POST"])
    def lipa_na_mpesa():
        data = request.get_json()
        phone = data.get("phone")
        amount = data.get("amount")

        # Normalize phone number to 2547XXXXXXXX format if needed
        if phone.startswith("0"):
            phone = "254" + phone[1:]
        elif phone.startswith("+"):
            phone = phone[1:]

        token = get_token()
        if not token:
            return jsonify({"error": "Failed to authenticate with M-Pesa"}), 500

        password, timestamp = generate_password()

        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        body = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": shortcode,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": "Ref001",
            "TransactionDesc": "Payment test"
        }

        res = requests.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", json=body, headers=headers)
        if res.status_code == 200:
            return jsonify(res.json())
        else:
            app.logger.error("STK push failed: %s", res.text)
            return jsonify({"error": "STK push request failed"}), 500

    @app.route("/api/mpesa/callback", methods=["POST"])
    def callback():
        app.logger.info("Callback received: %s", request.json)
        # Process callback logic here (e.g., update DB)
        return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})

    return app
