import time
import board
import busio
from adafruit_pn532.i2c import PN532_I2C
import requests
import RPi.GPIO as GPIO

# GPIO Setup
GPIO.setmode(GPIO.BCM)
GREEN_LED = 17
RED_LED = 27
BUZZER = 16

GPIO.setup(GREEN_LED, GPIO.OUT)
GPIO.setup(RED_LED, GPIO.OUT)
GPIO.setup(BUZZER, GPIO.OUT)

GPIO.output(GREEN_LED, GPIO.LOW)
GPIO.output(RED_LED, GPIO.LOW)

# Create PWM object for buzzer
buzzer_pwm = GPIO.PWM(BUZZER, 1000)  # Start frequency

# Set up I2C connection
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)

WEBHOOK_URL = "https://238d-2620-101-c040-7e5-5c6a-5224-e630-7814.ngrok-free.app/api/webhooks/nfc"

def play_success_sound():
    for freq in [1000, 1500, 2000]:  # Ascending tones
        buzzer_pwm.ChangeFrequency(freq)
        buzzer_pwm.start(70)
        time.sleep(0.1)
    buzzer_pwm.stop()

def play_error_sound():
    for freq in [2000, 1000, 500]:  # Descending tones
        buzzer_pwm.ChangeFrequency(freq)
        buzzer_pwm.start(70)
        time.sleep(0.15)
    buzzer_pwm.stop()

def success_feedback():
    GPIO.output(GREEN_LED, GPIO.HIGH)
    play_success_sound()
    time.sleep(1)
    GPIO.output(GREEN_LED, GPIO.LOW)

def error_feedback():
    GPIO.output(RED_LED, GPIO.HIGH)
    play_error_sound()
    time.sleep(1)
    GPIO.output(RED_LED, GPIO.LOW)

# Initialize PN532
pn532.SAM_configuration()
print("Waiting for NFC card...")

def read_nfc():
    """Reads an NFC card and returns the UID as a string."""
    try:
        uid = pn532.read_passive_target()
        if uid:
            return "".join([format(i, "02X") for i in uid])
    except Exception as e:
        print(f"🚨 NFC Read Error: {e}")
    return None

def send_request(card_no):
    """Sends the NFC card number to the server and handles the response."""
    try:
        response = requests.post(WEBHOOK_URL, json={"card_no": card_no}, timeout=5)
        response.raise_for_status()  # Raise error for HTTP failures (4xx, 5xx)
        
        res_json = response.json()
        if res_json.get("success"):
            print("✅ Transaction Approved: Fare Deducted")
            success_feedback()
        elif response.status_code == 400:
            print("❌ Transaction Failed: Insufficient Balance")
            error_feedback()
        elif response.status_code == 404:
            print("❌ Transaction Failed: Card Not Found")
            error_feedback()
        else:
            print("❌ Unknown Error:", res_json)
            error_feedback()
    except requests.exceptions.RequestException as e:
        print(f"🚨 Request Error: {e}")
        error_feedback()
    except ValueError:
        print("🚨 Invalid JSON Response Received")
        error_feedback()

# Keep running the loop even if an error occurs
while True:
    try:
        print("\nWaiting for NFC card...")  # Print after each attempt
        card_no = read_nfc()
        if card_no:
            print(f"Found NFC card: {card_no}")
            send_request(card_no)

        time.sleep(1)  # Short delay before the next scan
    except Exception as e:
        print(f"⚠️ Unexpected Error: {e}")
        time.sleep(2)  # Give it a moment before retrying

# Cleanup on exit
except KeyboardInterrupt:
    print("Cleaning up GPIO")
    buzzer_pwm.stop()
    GPIO.cleanup()
