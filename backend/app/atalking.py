# import package
import africastalking


# Initialize SDK
username = "smeazy_invoices"    # use 'sandbox' for development in the test environment
api_key = "atsk_28e13f1f258c83c1adad736397c902f3679dd368a094dc97c2b1e83d7addad2280edd39d"      # use your sandbox app API key for development in the test environment
africastalking.initialize(username, api_key)


# Initialize a service e.g. SMS
sms = africastalking.SMS


# Use the service synchronously
response = sms.send("Hello Message!", ["+254732898412"])
print(response)

# Or use it asynchronously
def on_finish(error, response):
    if error is not None:
        raise error
    print(response)

sms.send("Hello Message!", ["+254732898412"], callback=on_finish)
