import time
import board
import busio
from adafruit_pn532.i2c import PN532_I2C
import requests

# Set up I2C connection
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)

WEBHOOK_URL = " https://238d-2620-101-c040-7e5-5c6a-5224-e630-7814.ngrok-free.app/api/webhooks/nfc" # Replace with your actual Next.js API URL

# Initialize PN532
pn532.SAM_configuration()

print("Waiting for NFC card...")

while True:
    uid = pn532.read_passive_target()

    if uid:
        CARD_NO = "".join([format(i, "02X") for i in uid])
        print(f"Found NFC card: {CARD_NO}")

        try:
            # Send request to webhook with card number
            response = requests.post(WEBHOOK_URL, json={"card_no": CARD_NO})

            # Check if response is JSON
            res_json = response.json()

            if response.status_code == 200 and res_json.get("success"):
                print("✅ Transaction Approved: Fare Deducted")
            elif response.status_code == 400:
                print("❌ Transaction Failed: Insufficient Balance")
            elif response.status_code == 404:
                print("❌ Transaction Failed: Card Not Found")
            else:
                print("❌ Unknown Error:", res_json)

        except requests.exceptions.RequestException as e:
            print("🚨 Request Error:", e)
        except ValueError:
            print("🚨 Invalid JSON Response Received")

        # Wait 1 second before scanning again
        time.sleep(1)

