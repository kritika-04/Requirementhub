from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from mistralai.client import Mistral
import json
import os
from mistralai.client.errors.sdkerror import SDKError
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
def comparereq_mistral(existing_requirements,new_requirement):
    prompt=f"""You are a software requirements analyst.

You are given:
1. Existing requirements from a project.
2. A newly saved requirement.

Compare the newly saved requirement with the existing requirements.

Determine whether the new requirement:
- is CLEAR: it does not duplicate or conflict with any existing requirement.
- is DUPLICATE: it has the same or substantially similar meaning as an existing requirement.
- is CONFLICT: it contradicts or creates an incompatible condition with an existing requirement.

Do not consider requirements duplicate just because they use some of the same words.
Focus on their meaning and intended behavior.

Existing requirements:
{existing_requirements}

New requirement:
{new_requirement}

Return ONLY valid JSON in this format:

{{
    "requirements": [
        {{
            "requirement": "string",
            "result": "clear",
            "related_requirement": "",
            "reason": ""
        }}
    ]
    
}}

If the result is "duplicate" or "conflict", provide the related existing requirement in "related_requirement".
If the result is "clear", keep "related_requirement" empty.

Do not return markdown or any additional text.
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
                "content": "You are an expert software requirement analyst."
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


