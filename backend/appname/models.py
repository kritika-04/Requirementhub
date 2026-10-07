from django.db import models
from django.contrib.auth.hashers import make_password
# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.ForeignKey('Company', on_delete=models.CASCADE, null=True, blank=True)
    class Roles(models.TextChoices):
        OWNER = 'admin', 'Admin'
        MANAGER = 'manager', 'Manager'
        DEVELOPER = 'developer', 'Developer'
        USER = 'user', 'User'
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.USER)
    class Status(models.TextChoices):
        APPROVED='approved','Approved'
        PENDING='pending','Pending'
        REJECTED='rejected','Rejected'
    status=models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    # def save(self, *args, **kwargs):
    #     # Hash password before saving
    #     if not self.password.startswith("requirementhub_"):
    #         self.password = make_password(self.password)

    #     super().save(*args, **kwargs)

    def __str__(self):
        return self.email

class Company(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    companycode=models.CharField(max_length=20, unique=True)
    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=100)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    end_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Sprint(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    goal=models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20,choices=[('planned','Planned'),('inprogress','InProgress'),('completed','Completed'),('onhold','OnHold'),('cancelled','Cancelled')])
    createdby = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    createdat = models.DateTimeField(auto_now_add=True,null=True,blank=True)

class Requirement(models.Model):
    requirement=models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    type=models.CharField(max_length=20,choices=[('Functional','Functional'),('Non-Functional','Non-Functional'),('Security','Security'),('Performance','Performance'),('UI/UX','UI/UX')])
    priority=models.CharField(max_length=20,choices=[('Critical','Critical'),('High','High'),('Medium','Medium'),('Low','Low')])
    status=models.CharField(max_length=20,choices=[("clear","clear"),("incomplete","incomplete"),("conflict","conflict"),("duplicate","duplicate")])
    reason=models.TextField(db_default='')
    sprint = models.ForeignKey(Sprint,on_delete=models.SET_NULL,null=True,blank=True)
    implementation_status=models.CharField(max_length=20,choices=[('notstarted','NotStarted'),('inprogress','InProgress'),('cancelled','Cancelled'),('completed','Completed')],default='notstarted')
    def __str__(self):
        return self.requirement

class VersionHistory(models.Model):
    project=models.ForeignKey(Project,on_delete=models.CASCADE)
    requirement = models.ForeignKey(Requirement, on_delete=models.CASCADE)
    version=models.IntegerField()
    requirementtext=models.TextField(db_default='')
    type=models.CharField(max_length=20,choices=[('Functional','Functional'),('Non-Functional','Non-Functional'),('Security','Security'),('Performance','Performance'),('UI/UX','UI/UX')])
    priority=models.CharField(max_length=20,choices=[('Critical','Critical'),('High','High'),('Medium','Medium'),('Low','Low')])
    status=models.CharField(max_length=20,choices=[("clear","clear"),("incomplete","incomplete"),("conflict","conflict"),("duplicate","duplicate")])
    editedby=models.ForeignKey(User,on_delete=models.CASCADE)
    suggestedby=models.ForeignKey(User,on_delete=models.CASCADE,default=None,related_name='suggestedby',null=True,blank=True)
    editedat=models.DateTimeField(auto_now_add=True)
    
class RequirementSuggestion(models.Model):
    project=models.ForeignKey(Project,on_delete=models.CASCADE)
    requirement = models.ForeignKey(Requirement, on_delete=models.CASCADE)
    suggestedrequirement=models.TextField(db_default='')
    comment = models.TextField(blank=True,null=True)
    suggestedtype=models.CharField(max_length=20,choices=[('Functional','Functional'),('Non-Functional','Non-Functional'),('Security','Security'),('Performance','Performance'),('UI/UX','UI/UX')])
    suggestedpriority=models.CharField(max_length=20,choices=[('Critical','Critical'),('High','High'),('Medium','Medium'),('Low','Low')])
    status=models.CharField(max_length=20,choices=[('pending','Pending'),('approved','Approved'),('rejected','Rejected')])
    suggestedby=models.ForeignKey(User,on_delete=models.CASCADE)
    suggestedat=models.DateTimeField(auto_now_add=True)

class ProjectPlanning(models.Model):
    project = models.OneToOneField(
        Project,
        on_delete=models.CASCADE
    )
    planned_end_date = models.DateTimeField()
    planned_number_of_sprints = models.IntegerField()
    planned_number_of_team_members = models.IntegerField()
    status = models.CharField(max_length=20,choices=[('notplanned','NotPlanned'),('planned','Planned'),('inprogress','InProgress'),('completed','Completed'),('onhold','OnHold'),('cancelled','Cancelled')],default='notplanned')
    createdby = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    createdat = models.DateTimeField(auto_now_add=True,null=True,blank=True)


class ProjectMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)