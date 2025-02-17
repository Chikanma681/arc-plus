import RPi.GPIO as GPIO
import time

# GPIO Setup
GPIO.setmode(GPIO.BCM)
GREEN_LED = 17
RED_LED = 27
BUZZER = 16
GPIO.setup(GREEN_LED, GPIO.OUT)
GPIO.setup(RED_LED, GPIO.OUT)
GPIO.setup(BUZZER, GPIO.OUT)

# Create PWM object for buzzer
buzzer_pwm = GPIO.PWM(BUZZER, 1000)  # 440 Hz is the frequency for A4 note

try:
    while True:
        # Turn on Green LED
        GPIO.output(GREEN_LED, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(GREEN_LED, GPIO.LOW)
        
        # Turn on Red LED
        GPIO.output(RED_LED, GPIO.HIGH)
        time.sleep(1)
        GPIO.output(RED_LED, GPIO.LOW)
        
        # Activate Buzzer with PWM
        buzzer_pwm.start(70)  # 50% duty cycle
        time.sleep(1)
        buzzer_pwm.stop()
        time.sleep(0.5)
        
        # Optional: Play different frequencies
        
        # A4, C#5, E5 notes
except KeyboardInterrupt:
    buzzer_pwm.stop()
    print("Cleaning up GPIO")
    GPIO.cleanup()
