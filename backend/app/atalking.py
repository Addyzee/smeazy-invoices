# import package
import africastalking

from .config import settings


# Initialize SDK
username = settings.at_username    # use 'sandbox' for development in the test environment
api_key = settings.at_key      # use your sandbox app API key for development in the test environment
africastalking.initialize(username, api_key)


# Initialize a service e.g. SMS
sms = africastalking.SMS

if sms is None:
    raise Exception("AfricasTalking SMS service not initialized properly")

phone_numbers = None

if phone_numbers is None:
    raise Exception("Phone numbers are not set")

# Use the service synchronously
response = sms.send("Hello Message!", phone_numbers)

# Or use it asynchronously
def on_finish(error, response):
    if error is not None:
        raise error

sms.send("Hello Message!", phone_numbers, callback=on_finish)
