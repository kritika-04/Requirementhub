from .models import Requirement
from .comparereq import ask_mistral
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from appname.models import Requirement
def allsavedrequirement(pid):
    strreq = ""
    reqs = Requirement.objects.filter(project_id=pid)
    for r in reqs:
        if r.status == "clear":
            strreq += r.requirement + "\n"
    return strreq

existingrequiremnent=allsavedrequirement(1)
newrequirement="""The system shall allow verified users to securely log in using multi-factor authentication. 
Users can upload CSV data files up to 50 megabytes through the main dashboard. 
The application must process these uploaded records and display real-time progress bars. 
Administrators can export the final processed reports in PDF or Excel format. 
The system must encrypt all stored user data using AES-256 standards. 
Response times for page loads must remain under two seconds during peak hours. 
The software must automatically log out inactive users after fifteen minutes of idle time."""

allsavedrequirement(existingrequiremnent,newrequirement)