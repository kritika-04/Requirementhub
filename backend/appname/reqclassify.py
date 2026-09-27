

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from mistralai.client import Mistral
# from google import genai

# from google.genai import types
import json
import os
from mistralai.client.errors.sdkerror import SDKError
from dotenv import load_dotenv

load_dotenv()
# prompt=f"""
# You are an expert software requirements analyst.

# Analyze the client's text {text} and extract individual software requirements.

# For each requirement provide:
# - requirement
# - type
# - priority

# Allowed requirement types:
# - Functional
# - Non-Functional
# - Security
# - Performance
# - UI/UX

# Allowed priorities:
# - Low
# - Medium
# - High
# - Critical

# Return ONLY valid JSON.

# Use exactly this format:

# {
#     "requirements": [
#         {
#             "requirement": "string",
#             "type": "Functional",
#             "priority": "High"
#         }
#     ]
# }
# """
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
def ask_mistral(text):
    prompt=f"""
    You are an expert software requirements analyst.
    Analyze the client's text {text} and extract individual software requirements.

    For each requirement provide:
        - requirement
        - type
        - priority
        - status
        - reason

    Allowed requirement types:
- Functional
- Non-Functional
- Security
- Performance
- UI/UX

Allowed priorities:
- Low
- Medium
- High
- Critical

Allowed statuses:
clear
duplicate 
incomplete
conflict

Reason : If status is incomplete  and conflict, provide the reason for conflict or incomplete.
for example this requirement is conflicting with that requirement in case of conflict
if it is incomplete suggest where it requires clarity

Return ONLY valid JSON.

Use exactly this format:

{{
    "requirements": [
        {{
            "requirement": "string",
            "type": "Functional",
            "priority": "High",
            "status":["conflict","duplicate","incomplete","clear"],
            "reason":"string"(only if status is incomplete  and conflict, provide the reason for conflict or incomplete)
        }}
    ]
}}
"""
    try:
        print("Mistral called")
        client = Mistral(api_key=MISTRAL_API_KEY)
        chat_response = client.chat.complete(
            model="ministral-8b-latest",
            response_format={"type": "json_object"},
            messages=[
            {
                "role": "system",
                "content": "You are an expert software requirement classifier."
            },
            {
                "role": "user",
                "content": prompt
            }
            ]
        )
    except Exception as e:
        return {"error": str(e)}
    return json.loads(chat_response.choices[0].message.content)


    
# text="The system shall allow verified users to securely log in using multi-factor authentication. Users can upload CSV data files up to 50 megabytes through the main dashboard. The application must process these uploaded records and display real-time progress bars. Administrators can export the final processed reports in PDF or Excel format. The system must encrypt all stored user data using AES-256 standards. Response times for page loads must remain under two seconds during peak hours. The software must automatically log out inactive users after fifteen minutes of idle time."
# ans=ask_mistral(text)
# print(ans)
# The system shall allow verified users to securely log in using multi-factor authentication. Users can upload CSV data files up to 50 megabytes through the main dashboard. The application must process these uploaded records and display real-time progress bars. Administrators can export the final processed reports in PDF or Excel format. The system must encrypt all stored user data using AES-256 standards. Response times for page loads must remain under two seconds during peak hours. The software must automatically log out inactive users after fifteen minutes of idle time.


