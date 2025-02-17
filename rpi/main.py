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

# Initialize both LEDs to OFF state
GPIO.output(GREEN_LED, GPIO.LOW)
GPIO.output(RED_LED, GPIO.LOW)

# Create PWM object for buzzer
buzzer_pwm = GPIO.PWM(BUZZER, 1000)  # Starting frequency

# Set up I2C connection
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)

WEBHOOK_URL = "https://238d-2620-101-c040-7e5-5c6a-5224-e630-7814.ngrok-free.app/api/webhooks/nfc"

def play_success_sound():
    # Play a pleasant ascending tone
    frequencies = [1000, 1500, 2000]  # Ascending frequencies
    for freq in frequencies:
        buzzer_pwm.ChangeFrequency(freq)
        buzzer_pwm.start(70)
        time.sleep(0.1)
    buzzer_pwm.stop()

def play_error_sound():
    # Play a descending "error" tone
    frequencies = [2000, 1000, 500]  # Descending frequencies
    for freq in frequencies:
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

try:
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
                print("🚨 Request Error:", e)
                error_feedback()
            except ValueError:
                print("🚨 Invalid JSON Response Received")
                error_feedback()
                
            # Wait before scanning again
            time.sleep(1)

except KeyboardInterrupt:
    print("Cleaning up GPIO")
    buzzer_pwm.stop()
    GPIO.cleanup()
