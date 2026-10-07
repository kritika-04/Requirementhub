
import json

from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
# from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from .reqclassify import ask_mistral
from .models import ProjectPlanning, User , Sprint , ProjectMember
from .models import Company
from .models import Project
from .models import Requirement
from .models import VersionHistory
from .models import RequirementSuggestion
from django.db.models import Max
from django.contrib.auth.hashers import make_password

import pdfplumber
import traceback
import docx
@csrf_exempt
def signup(request):
    if request.method == "OPTIONS":
        return JsonResponse(
            {"message": "OK"},
            status=200
        )
    if request.method != "POST":
        return JsonResponse(
            {
                "message": "Only POST request is allowed"
            },
            status=405
        )
    try:
        data = json.loads(request.body)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role=data.get("role")
        companyname=data.get("companyname")
        companycode=data.get("companycode")
        print("Received signup data:", name, email, password, role, companyname, companycode)
        # Check required fields
        if not name or not email or not password:
            return JsonResponse(
                {
                    "message": "Name, email and password are required"
                },
                status=400
            )
        # Check existing email
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {
                    "message": "Email already registered"
                },
                status=400
            )
        companyobj=Company.objects.filter(name=companyname,companycode=companycode).first()
        if not companyobj:
            return JsonResponse(
                {
                    "message": "Company not found"
                },
                status=400
            )
        # Create user
        user = User(
            email=email,
            password=password,
            name=name,
            role=role,
            company=companyobj,
        )
        user.password = make_password(password)
        user.save()
        print("User created successfully:", user)

        return JsonResponse(
            {
                "message": "Signup successful",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            },
            status=201
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "message": "Invalid JSON"
            },
            status=400
        )


@csrf_exempt
def login(request):
    if request.method == "OPTIONS":
        return JsonResponse(
            {"message": "OK"},
            status=200
        )
    
    if request.method != "POST":
        return JsonResponse(
            {
                "message": "Only POST request is allowed"
            },
            status=405
        )

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return JsonResponse(
                {
                    "message": "Email and password are required"
                },
                status=400
            )
        user = User.objects.filter(email=email).first()
        print("User not found for email:", email,password)
        print("User not found for email:", email,password),
        print("EMAIL RECEIVED:", email)
        print("USER FOUND:", user)
        print("ROLE:", user.role if user else None)
        print("STATUS:", user.status if user else None)
        # if user:
        #     print("PASSWORD MATCH:",check_password("manager1", type(user.password) ,user.password))
        # User doesn't exist
        if user is None:
            return JsonResponse(
                
                {"message": "Invalid email or password"},
                status=401
            )

        # Check password
        if not check_password(password, user.password):
            return JsonResponse(
                {"message": "Invalid email or password"},
                status=401
            )
        # Create JWT
        token = AccessToken()
        # Store user's ID inside JWT
        token["user_id"] = user.id
        return JsonResponse(
            {
                "message": "Login successful",
                "access_token": str(token),
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            },
            status=200
        )
    except json.JSONDecodeError:
        return JsonResponse(
            {"message": "Invalid JSON"},
            status=400
        )

    except Exception as e:
        return JsonResponse(
            {
                "message": "Something went wrong",
                "error": str(e)
            },
            status=500
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return JsonResponse(
            {"message": "Authorization token required"},
            status=401
        )
    try:
        token = auth_header.split(" ")[1]
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        user = User.objects.get(id=user_id)
        return JsonResponse({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status,
            "role": user.role,
            "company": user.company.name if user.company else None,
            "companyid": user.company.id if user.company else None
        })
    except User.DoesNotExist:
        return JsonResponse(
            {"message": "User not found"},
            status=401
        )

    except Exception:
        return JsonResponse(
            {"message": "Invalid or expired token"},
            status=401)

def logout(request):
    response = JsonResponse({"message": "Logged out"})
    # response.delete_cookie(
    #     key="access_token",
    #     path="/",
    #     samesite="Lax"
    # )

    return response

@api_view(['GET'])
def companyall(request):
    companies=Company.objects.all()
    return JsonResponse([{"id":company.id,"name":company.name,"companycode":company.companycode} for company in companies],safe=False)
@api_view(['GET'])
def alluser(request):
    users=User.objects.all()
    return JsonResponse([{"id":user.id,"name":user.name,"email":user.email,"role":user.role,"status":user.status,"company":user.company.id if user.company else None} for user in users],safe=False)

@api_view(['POST'])
def approveuser(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("id")
            user = User.objects.get(id=user_id)
            user.status = "approved"
            user.save()
            return JsonResponse({"message": "User approved successfully"})
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)


@api_view(['POST'])
def create_project(request):
    if request.method=='POST':
        try:
            print(request.data)
            userid=request.data.get('userid')
            companyid=request.data.get('companyid')
            name=request.data.get('projectname')
            description=request.data.get('description')
            project=Project(name=name,description=description,company_id=companyid,user_id=userid)
            project.save()
            return JsonResponse({"message":"Project created successfully","project":{"name":project.name,"description":project.description,"company_id":project.company_id,"user_id":project.user_id}},status=201)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)

def projectlist(request,companyid):
    if request.method=='GET':
        try:
            projects=Project.objects.filter(company_id=companyid)
            return JsonResponse([{"id":project.id,"name":project.name,"description":project.description,"company_id":project.company_id} for project in projects],safe=False)
        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)

def projectdetails(request,projectid):
    if request.method=='GET':
        try:
            project=Project.objects.get(id=projectid)
            return JsonResponse({"id":project.id,"name":project.name,"description":project.description,"company_id":project.company_id})
        except Project.DoesNotExist:
            return JsonResponse({"message": "Project not found"}, status=404)
        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)

@api_view(['POST'])
def askai(request):
    if request.method=="POST":
        try:
            # data = json.loads(request.body)
            text=request.data.get("pastedText")
            result=ask_mistral(text)
            return JsonResponse(result)
        
        except Exception as e:
                    import traceback 
                    traceback.print_exc()
                    return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)

@csrf_exempt
def upload(request):
    if request.method=='POST':
        try:
            file=request.FILES.get('file')
            if not file:
                return JsonResponse({"message": "No file uploaded"}, status=400)
            print(f"Uploaded file: {file}")
            if file.name.endswith('.pdf'):
                # Process PDF file
                raw_text = ''
                with pdfplumber.open(file) as pdf:
                    for page in pdf.pages:
                        if page.extract_text():
                            raw_text += page.extract_text() + "\n"
                # Clean the text
                raw_text = raw_text.split("\n")
                raw_text = [l.strip() for l in raw_text if l.strip()]
                clean = "\n".join(raw_text)
                print("Cleaned text:", clean)
            if file.name.endswith('.txt'):
                # Process TXT file
                raw_text = file.read().decode('utf-8')
                clean = raw_text.strip()
                print("Cleaned text:", clean)
            if file.name.endswith('.docx'):
                # Process DOCX file
                doc = docx.Document(file)
                raw_text = '\n'.join([para.text for para in doc.paragraphs])
                clean = raw_text.strip()
                print("Cleaned text:", clean)
           
            result=ask_mistral(clean)
            # save in database
            # reqlist=[Requirement(requirement=r.get('requirement'),project_id=projectid,type=r.get('type'),priority=r.get('priority'),status=r.get('status')) for r in result]
            # reqlist=Requirement.objects.bulk_create(reqlist)
            return JsonResponse(result, safe=False)
        except Exception as e:
            traceback.print_exc()  
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)
# manager1 manager1@example.com manager1 MANAGER ABC Software Solutions ABC7F29

def Extract_file_content(file):
    raw_text=''
    try:
        if file.name.endswith('.pdf'):
                # Process PDF file
                with pdfplumber.open(file) as pdf:
                    for page in pdf.pages:
                        if page.extract_text():
                            raw_text += page.extract_text() + "\n"
                        # Clean the text
                        raw_text = raw_text.split("\n")
                        raw_text = [l.strip() for l in raw_text if l.strip()]
                        clean = "\n".join(raw_text)
                        print("Cleaned text:", clean)
        if file.name.endswith('.txt'):
                        # Process TXT file
            raw_text = file.read().decode('utf-8')
            clean = raw_text.strip()
            print("Cleaned text:", clean)
        if file.name.endswith('.docx'):
                        # Process DOCX file
            doc = docx.Document(file)
            raw_text = '\n'.join([para.text for para in doc.paragraphs])
            clean = raw_text.strip()
            print("Cleaned text:", clean)
        return clean
    except Exception as e:
        print(e)


@api_view(['POST'])
def requirement_submit(request):
    if request.method=='POST':
        try:
            print("Received requirements data:", request.data)
            text = request.data.get("pastedText")
            files = request.FILES.getlist("files")
            filecontent=''
            for f in files:
                content=Extract_file_content(f)
                filecontent=content+"\n"
            if(text):
                filecontent="\n"+text
            # result=ask_mistral(filecontent)
            # print(filecontent)
            # result={'requirements': [{'requirement': 'The system shall support secure multi-factor authentication (MFA) for verified users to ensure authorized access.', 'type': 'Security', 'priority': 'Critical', 'status': 'clear'}, {'requirement': 'The system shall allow verified users to log in securely using multi-factor authentication (MFA).', 'type': 'Functional', 'priority': 'High', 'status': 'clear'}, {'requirement': 'The system shall enable users to upload CSV data files via the main dashboard, with a maximum file size limit of 50 megabytes.', 'type': 'Functional', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall validate and process uploaded CSV files without exceeding the 50MB size limit, rejecting files that violate this constraint.', 'type': 'Performance', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall provide a user-friendly interface in the main dashboard for uploading CSV files, including clear instructions and feedback on upload status.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'incomplete'}, {'requirement': 'The system shall extract individual software requirements from the uploaded CSV data files.', 'type': 'Functional', 'priority': 'High', 'status': 'clear'}, {'requirement': 'The system shall ensure that the extraction of software requirements from CSV files is accurate and error-free, handling malformed data gracefully.', 'type': 'Non-Functional', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall maintain the integrity and confidentiality of uploaded CSV files during processing and storage, adhering to security best practices.', 'type': 'Security', 'priority': 'High', 'status': 'incomplete'}, {'requirement': 'The system shall provide real-time feedback to users regarding the progress and success/failure of CSV file uploads and requirement extraction.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'clear'}]}
            result=ask_mistral(filecontent)
            return JsonResponse(result, safe=False)
            # return JsonResponse({"message":"Requirements submitted successfully"})
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON"}, status=400)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({"message": "Something went wrong", "error": str(e)}, status=500)
        # reqlist=data.get('requirements')
            # projectid=data.get('projectid')
            # reqlist=[Requirement(requirement=r.get('requirement'),project_id=projectid,type=r.get('type'),priority=r.get('priority'),status=r.get('status')) for r in reqlist]
            # reqlist=Requirement.objects.bulk_create(reqlist)

@api_view(["POST"])
def saverequirement(request):
    data=request.data
    uid=data.get('Userid')
    projectid=data.get('projectid')
    datar=data.get('req')
    if(data.get('status') == "clear"):
        r=Requirement(requirement=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),reason='',project_id=projectid)
        r.save()
        v=VersionHistory(requirement_id=r.id,requirementtext=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),project_id=projectid,editedby_id=uid,version=1)
        v.save()
    else:
        r=Requirement(requirement=datar.get('requirement'),status=datar.get('status'),type=datar.get('type'),priority=datar.get('priority'),reason=datar.get('reason'),project_id=projectid,editedby_id=uid)
        r.save()
        v=VersionHistory(requirement_id=r.id,requirementtext=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),project_id=projectid,editedby_id=uid,version=1)
        v.save()
    return JsonResponse({"message":"Requirement saved successfully"})

@api_view(["POST"])
def saveallrequirement(request):
    print(request)
    print(request.data)
    print(request.data.get('requirements'))
    req=request.data.get('requirements')
    print(request.data.get('projectid'))
    projectid=request.data.get('projectid')
    uid=request.data.get('uid')
    # r=[Requirement(requirement=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),project_id=projectid) for datar in req ]
    for datar in req:
        r=Requirement(requirement=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),project_id=projectid)
        r.save()
        v=VersionHistory(requirement_id=r.id,requirementtext=datar.get('requirement'),status='clear',type=datar.get('type'),priority=datar.get('priority'),project_id=projectid,editedby_id=uid,version=1)
        v.save()
    # Requirement.objects.bulk_create(r)
    return JsonResponse({"message":"All Requirements saved successfully"})

# {'requirements': [{'id': 0, 'requirement': 'The system shall support secure multi-factor authentication (MFA) for verified users to ensure authorized access.', 'type': 'Security', 'priority': 'Critical', 'status': 'clear', 'saved': True}, {'id': 1, 'requirement': 'The system shall allow verified users to log in securely using multi-factor authentication (MFA).', 'type': 'Functional', 'priority': 'High', 'status': 'clear', 'saved': False}, {'id': 2, 'requirement': 'The system shall enable users to upload CSV data files via the main dashboard, with a maximum file size limit of 50 megabytes.', 'type': 'Functional', 'priority': 'Medium', 'status': 'clear', 'saved': False}, {'id': 3, 'requirement': 'The system shall validate and process uploaded CSV files without exceeding the 50MB size limit, rejecting files that violate this constraint.', 'type': 'Performance', 'priority': 'Medium', 'status': 'clear', 'saved': False}, {'id': 4, 'requirement': 'The system shall provide a user-friendly interface in the main dashboard for uploading CSV files, including clear instructions and feedback on upload status.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'clear', 'saved': False}, {'id': 5, 'requirement': 'The system shall extract individual software requirements from the uploaded CSV data files.', 'type': 'Functional', 'priority': 'High', 'status': 'clear', 'saved': False}, {'id': 6, 'requirement': 'The system shall ensure that the extraction of software requirements from CSV files is accurate and error-free, handling malformed data gracefully.', 'type': 'Non-Functional', 'priority': 'Medium', 'status': 'clear', 'saved': False}, {'id': 7, 'requirement': 'The system shall maintain the integrity and confidentiality of uploaded CSV files during processing and storage, adhering to security best practices.', 'type': 'Security', 'priority': 'High', 'status': 'clear', 'saved': False}, {'id': 8, 'requirement': 'The system shall provide real-time feedback to users regarding the progress and success/failure of CSV file uploads and requirement extraction.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'clear', 'saved': False}]}
@api_view(['GET'])
def getrequirements(request,projectid):
    if request.method=='GET':
        try:
            reqs=Requirement.objects.filter(project_id=projectid)
            print(reqs)
            return JsonResponse([{"id":r.id,"requirement":r.requirement,"status":r.status,
                                  "priority":r.priority,"type":r.type,"projectid":projectid,
                                  "reason":r.reason,"implementation_status":r.implementation_status,
                                  "sprint_id":r.sprint_id} for r in reqs],safe=False)
        except Exception as e:
            print(e)

@api_view(["POST"])
def editrequirement(request):
    try:
        data = request.data.get("editingReq")
        userid = request.data.get("Userid")
        req = Requirement.objects.get(id=data.get("id"))
        latest_version = (VersionHistory.objects.filter(requirement_id=req.id).aggregate(Max("version"))["version__max"] or 0)
        vh = VersionHistory.objects.create(
            requirement_id=req.id,
            project_id=data.get("projectid"),
            requirementtext=data.get("requirement"),
            type=data.get("type"),
            priority=data.get("priority"),
            status=data.get("status"),
            editedby_id=userid,
            version=latest_version+1
        )
        req.requirement = data.get("requirement")
        req.type = data.get("type")
        req.priority = data.get("priority")
        req.status = data.get("status")
        req.save()
        return Response({"message": "Requirement updated successfully"})
    except Exception as e:
        traceback.print_exc()   
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def versionhistory(request,reqid):
    print(reqid)
    try:
        vh=list(VersionHistory.objects.filter(requirement_id=reqid).values())
        print(vh)
        return JsonResponse(vh,safe=False)
    except Exception as e:
        return Response({"error": str(e)})

@api_view(['POST'])
def requirementsuggest(request,reqid):
    print(request.data)
    if request.method == 'POST':
        try:
            # {'req': {'id': 31, 'requirement': 'Users must be able to register for an account using either email or Google login.', 'status': 'clear', 'priority': 'Critical', 'type': 'Functional', 'projectid': 1, 'comment': 'I have changed priority because it is important'}, 'uid': 6}
            suggestedby_id=request.data.get('uid')
            data=request.data.get('req')
            rs=RequirementSuggestion(project_id=data.get('projectid'),requirement_id=reqid,suggestedrequirement=data.get('requirement'), suggestedtype=data.get('type'),suggestedpriority=data.get('priority'),status='pending',comment = data.get('comment'),suggestedby_id=suggestedby_id)
            rs.save()
            print('saved')
            return JsonResponse({"messsage":"saved successfully"})
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['GET'])
def allrequirementsuggestion(request,reqid):
    try:
        rs=list(RequirementSuggestion.objects.filter(requirement_id=reqid).values())
        return JsonResponse(rs,safe=False)
    except Exception as e:
        return Response({"error": str(e)})

@api_view(['POST'])
def statusrequirementsuggest(request,sid):
    print(request.data)
    if request.method == 'POST':
        try:
            status=request.data.get('status')
            rid=request.data.get('rid')
            Userid=request.data.get('Userid')
            rs=RequirementSuggestion.objects.get(id=sid)
            print(rs.suggestedby_id)
            # rs.status=status
            # rs.save()
            if(status=='approve'):
                r=Requirement.objects.get(id=rid)
                # r.requirement=rs.suggestedrequirement
                # r.type=rs.suggestedtype
                # r.priority=rs.suggestedpriority
                # r.save()
                # print(r.suggestedby)
                latest_version = (VersionHistory.objects.filter(requirement_id=rid).aggregate(Max("version"))["version__max"] or 0)
                vh = VersionHistory.objects.create(
                    requirement_id=rid,
                    project_id=r.project_id,
                    requirementtext=rs.suggestedrequirement,
                    type=rs.suggestedtype,
                    priority=rs.suggestedpriority,
                    status=r.status,
                    editedby_id=Userid,
                    suggestedby_id=rs.suggestedby_id,
                    version=latest_version+1
                        )
                vh.save()
# {'rid': 31, 'status': 'approve'}
            return JsonResponse({"messsage":"status saved successfully"})
        except Exception as e:
            return Response({"error": str(e)})
# {'id': 0, 'requirement': 'The system shall support secure multi-factor authentication (MFA) for verified users to ensure authorized access.', 'type': 'Security', 'priority': 'Critical', 'status': 'clear', 'saved': False}
#{'req': {'id': 2, 'requirement': 'The system shall enable users to upload CSV data files via the main dashboard, with a maximum file size limit of 50 megabytes.', 'type': 'Functional', 'priority': 'Medium', 'status': 'clear', 'saved': False}, 'projectid': '1'}
    
@api_view(['POST'])
def projectplanning(request, pid):
    if request.method=='POST':
        try:
            data=request.data
            pp=ProjectPlanning(project_id=pid,planned_end_date=data.get('planned_end_date'),planned_number_of_sprints=data.get('planned_number_of_sprints'),planned_number_of_team_members=data.get('planned_number_of_team_members'),status='planned',createdby_id=data.get('userid'))
            pp.save()
            pm=ProjectMember(project_id=pid,user_id=data.get('userid'))
            pm.save()
            print(data,pid)
            return JsonResponse({"message":"Project planning saved successfully"})
        except Exception as e:
            return Response({"error": str(e)})
#{'planned_end_date': '2026-11-30T17:41', 'planned_number_of_sprints': '4', 'planned_number_of_team_members': '4'}

@api_view(['GET'])
def getprojectplanning(request,pid):
    if request.method == 'GET':
        try:
            pp=ProjectPlanning.objects.get(project_id=pid)
            print(pp)
            return Response({
            "id": pp.id,
            "projectid": pp.project_id,
            "planned_end_date": pp.planned_end_date,
            "planned_number_of_sprints": pp.planned_number_of_sprints,
            "planned_number_of_team_members": pp.planned_number_of_team_members,
        })
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['POST'])
def addsprint(request, pid):
    print(pid)
    if request.method=='POST':
        try:
            data=request.data
            s=Sprint(project_id=pid,createdby_id=data.get('userid'),name=data.get('name'),goal=data.get('goal'),start_date=data.get('start_date'),end_date=data.get('end_date'),status='planned')
            s.save()
            pp=ProjectPlanning.objects.get(project_id=pid)
            pp.status='inprogress'
            pp.save()
            return JsonResponse({"message":"Sprint added successfully"})
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['GET'])
def getallsprint(request,pid):
    if request.method=='GET':
        try:
            sprints=Sprint.objects.filter(project_id=pid)
            return JsonResponse([{"id":s.id,"name":s.name,"goal":s.goal,"start_date":s.start_date,"end_date":s.end_date} for s in sprints],safe=False)
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['POST'])
def addrequirement(request,sid):
    if request.method=='POST':
        try:
            data=request.data
            rid=data.get('requirement_id')
            r=Requirement.objects.get(id=rid)
            r.sprint_id=sid
            r.implementation_status='inprogress'
            r.save()
            s=Sprint.objects.get(id=sid)
            s.status='inprogress'
            s.save()
            return JsonResponse({"message":"Requirement added to sprint successfully"})
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['GET'])
def getsprint(request,sid):
    if request.method=='GET':
        try:
            s=Sprint.objects.get(id=sid)
            return JsonResponse({"id":s.id,"name":s.name,"goal":s.goal,"start_date":s.start_date,"end_date":s.end_date,"status":s.status,"createdby_id":s.createdby_id,"project_id":s.project_id})
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['POST'])
def editsprint(request,sid):
    if request.method=='POST':
        try:
            data=request.data.get('editingSprint')
            print(f"Data is {data}")
            s=Sprint.objects.get(id=sid)
            s.name=data.get('name')
            s.goal=data.get('goal')
            s.start_date=data.get('start_date') 
            s.end_date=data.get('end_date')
            print(data.get('end_date'))
            s.save()
            return JsonResponse({"message":"Sprint updated successfully"})
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['GET'])
def allusers(request,cid):
    if request.method=='GET':
        try:
            users=User.objects.filter(company_id=cid)
            return JsonResponse([{"id":u.id,"name":u.name,"email":u.email,"role":u.role,"status":u.status} for u in users],safe=False)
        except Exception as e:
            return Response({"error": str(e)})


@api_view(['POST'])
def addprojectmember(request,pid):
    if request.method=='POST':
        try:
            data=request.data
            users=request.data.get('users')
            print(f"Data is {users}")
            pms=[ProjectMember(project_id=pid,user_id=u["id"]) for u in users]
            ProjectMember.objects.bulk_create(pms)
            return JsonResponse({"message":"Project member added successfully"})
        # Data is {'users': [{'id': 6, 'name': 'developer1', 'email': 'developer1@example.com', 'role': 'DEVELOPER', 'status': 'approved', 'company': 1}]}
        except Exception as e:
            return Response({"error": str(e)})

@api_view(['GET'])
def allprojectmember(request,pid):
    if request.method=='GET':
        try:
            users=ProjectMember.objects.filter(project_id=pid)
            nameusers=[{"id":u.user_id,"name":User.objects.get(id=u.user_id).name,"role":User.objects.get(id=u.user_id).role} for u in users]
            return JsonResponse(nameusers,safe=False)
        except Exception as e:
            return Response({"error": str(e)})