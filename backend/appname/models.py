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

    def __str__(self):
        return self.name


class Requirement(models.Model):
    requirement=models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    type=models.CharField(max_length=20,choices=[('Functional','Functional'),('Non-Functional','Non-Functional'),('Security','Security'),('Performance','Performance'),('UI/UX','UI/UX')])
    priority=models.CharField(max_length=20,choices=[('Critical','Critical'),('High','High'),('Medium','Medium'),('Low','Low')])
    status=models.CharField(max_length=20,choices=[("clear","clear"),("incomplete","incomplete"),("conflict","conflict"),("duplicate","duplicate")])
    reason=models.TextField(db_default='')
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
    editedat=models.DateTimeField(auto_now_add=True)
    
