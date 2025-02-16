import time
import board
import busio
from adafruit_pn532.i2c import PN532_I2C
import requests

# Set up I2C connection
i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)

URL="https://238d-2620-101-c040-7e5-5c6a-5224-e630-7814.ngrok-free.app/api/webhooks/nfc"


# Initialize PN532
pn532.SAM_configuration()

print("Waiting for NFC card...")

while True:
    # Check for NFC cards
    uid = pn532.read_passive_target()
    
    if uid is not None:
        print("Found NFC card!")
        print("Card ID:","".join([format(i, "02X") for i in uid]))
        req = requests.post(URL)
        print(req.json())
        time.sleep(1)
                                            
