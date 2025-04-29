import time
import board
import busio
from adafruit_pn532.i2c import PN532_I2C
import requests
import RPi.GPIO as GPIO
from picamera2 import Picamera2
import cv2
from pyzbar.pyzbar import decode
import numpy as np
from threading import Thread

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
buzzer_pwm = GPIO.PWM(BUZZER, 1000)

# Set up I2C connection for NFC
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)

# Initialize camera
picam2 = Picamera2()
camera_config = picam2.create_preview_configuration()
picam2.configure(camera_config)
picam2.start()

WEBHOOK_URL = "https://ac96-165-140-231-123.ngrok-free.app/api/webhooks/nfc"

def play_success_sound():
    frequencies = [1000, 1500, 2000]
    for freq in frequencies:
        buzzer_pwm.ChangeFrequency(freq)
        buzzer_pwm.start(70)
        time.sleep(0.1)
    buzzer_pwm.stop()

def play_error_sound():
    frequencies = [2000, 1000, 500]
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

def process_card_number(card_no):
    try:
        response = requests.post(WEBHOOK_URL, json={"card_no": card_no})
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

def scan_qr_code():
    while True:
        # Capture frame from camera
        frame = picam2.capture_array()
        
        # Convert to grayscale for QR detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Scan for QR codes
        decoded_objects = decode(gray)
        
        for obj in decoded_objects:
            # Get the QR code data
            card_no = obj.data.decode('utf-8')
            print(f"Found QR code: {card_no}")
            process_card_number(card_no)
            time.sleep(1)  # Prevent multiple scans of the same QR code

def scan_nfc():
    # Initialize PN532
    pn532.SAM_configuration()
    
    while True:
        uid = pn532.read_passive_target()
        if uid:
            card_no = "".join([format(i, "02X") for i in uid])
            print(f"Found NFC card: {card_no}")
            process_card_number(card_no)
            time.sleep(1)

# Start both NFC and QR scanning in separate threads
print("Starting card reader system...")
print("Press Ctrl+C to exit")

try:
    # Create and start threads for NFC and QR scanning
    nfc_thread = Thread(target=scan_nfc, daemon=True)
    qr_thread = Thread(target=scan_qr_code, daemon=True)
    
    nfc_thread.start()
    qr_thread.start()
    
    # Keep the main thread alive
    while True:
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nCleaning up...")
    buzzer_pwm.stop()
    GPIO.cleanup()
    picam2.stop()
    print("System shutdown complete")
