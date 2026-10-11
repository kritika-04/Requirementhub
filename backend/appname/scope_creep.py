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
def scopecreep_mistral(original_requirement,suggested_requirement,implementation_status,sprint_assigned):
    prompt = f"""
You are a software requirements analyst assessing potential scope
creep in a software project.

Original requirement:
{original_requirement}

Suggested requirement:
{suggested_requirement}

Implementation status:
{implementation_status}

Sprint assigned:
{sprint_assigned}

Assess the suggested change using these rules.
implementation_status allowed values:
- notstarted 
- inprogress
- completed
sprint_assigned allowed values:
- True 
- False

CASE 1: NOT STARTED
The requirement is not assigned to any sprint and has
implementation_status = "notstarted".
- Determine whether the suggestion adds functionality beyond
  the original requirement or approved project scope.
- Consider whether it is only a clarification or correction.

CASE 2: IN PROGRESS
The requirement is assigned to a sprint and has
implementation_status = "inprogress".
- Determine whether the suggestion expands the original scope.
- Identify potential rework, additional effort, or sprint disruption.
- Do not assume that every change causes scope creep.

CASE 3: COMPLETED
The requirement is assigned to a sprint and has
implementation_status = "completed".
- Determine whether the suggestion expands the original scope.
- Identify potential rework, regression testing, or future sprint work.
- Do not assume that every change causes scope creep.

GENERAL RULES:
- Compare ONLY the original requirement and the suggested requirement
   to determine whether functionality has changed.
- Treat implementation_status and sprint assignment only as context
   for implementation risk. They are not evidence of scope creep.
- Do not invent features, requirements, deadlines, dependencies,
   or implementation details absent from the input.
- If the suggested requirement adds functionality not present in
   the original, classify it as potential_impact.
- If the suggested requirement merely rephrases the original without
   changing its meaning or functionality, classify it as no_impact.
- Return reason as a string, never an object.
- Return exactly the specified JSON fields and allowed values.
- A clarification, wording correction, or equivalent replacement
  does not automatically constitute scope creep.
- Adding new functionality beyond the approved scope may constitute
  scope creep regardless of implementation status.
- Do not invent project deadlines, effort estimates, or dependencies.
- Treat your result as an assessment for manager review, not a
  final approval or rejection.

Return ONLY valid JSON in this format:

{{
    "scope_impact": "potential_impact",
    "reason": "Explanation of the assessment",
    "implementation_risk": "rework_required",
    "suggested_action": "manager_review"
}}

Allowed values:
scope_impact: "no_impact", "potential_impact"
implementation_risk: "none", "additional_work",
"rework_required", "unknown"
suggested_action: "normal_review", "manager_review"

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


#     prompt=f"""You are a software requirements analyst.

# You are given three cases
# 1. Requirement not assigned to any sprint (implementation_status=notstarted)
# 2. Requirement assigned to any sprint but it is in progress (implementation_status=inprogress)
# 3. Requirement assigned to any sprint and it is in completed (implementation_status=completed)
# Compare the requirement with the suggested requirements and tell whether it is scope creep.

# Scope creep rules for the three cases
# Case 1 — Not assigned to any sprint
# Not Started
# A stakeholder suggests changing the requirement before implementation begins.
# - Check whether the proposed change expands the agreed project scope.
# - Check whether it adds new functionality or changes existing behavior.
# - If it is a meaningful scope change, flag potential scope creep.
# Sprint impact is not applicable yet, but the project scope can still be affected.

# Case 2 — Assigned to a sprint but not completed
# Higher implementation risk
# The requirement is in progress.
# - Identify the difference between the original and proposed requirement.
# - Check whether completed work must be modified or discarded.
# - Check whether additional work affects sprint capacity or deadlines.
# - Raise an alert if the change adds scope or disrupts planned work.

# Case 3 — Assigned to a sprint and completed
# Rework risk
# The original requirement has already been implemented.
# - Determine whether the change requires modifying completed functionality.
# - Identify potential regression testing and rework.
# - Check whether the new work needs a future sprint.
# - Flag potential scope impact for manager approval.
# A change to completed work can cause rework even when it does not delay the current sprint.


# Original requirements:
# {original_requirements}

# Suggested requirement:
# {suggested_requirement}

# Return ONLY valid JSON in this format:

# {{
#   "scope_impact": "potential_impact",
#   "reason": "The change adds Google authentication to an existing login feature.",
#   "implementation_risk": "rework_required",
#   "suggested_action": "manager_review"
# }}


# Do not return markdown or any additional text.
# """