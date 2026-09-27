from django.urls import path
from . import views
# from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns=[
    path('signup',views.signup,name='signup'),
    path('login',views.login,name='login'),
    path('profile',views.profile,name='profile'),
    path('companyall',views.companyall,name='companyall'),
    path('alluser',views.alluser,name='alluser'),
    path('approveuser',views.approveuser,name='approveuser'),
    path('askai',views.askai,name='askai'),
    path('upload',views.upload,name='upload'),
    path('create_project',views.create_project,name='create_project'),
    path('projectlist/<int:companyid>',views.projectlist,name='projectlist'),
    path('projectdetails/<int:projectid>',views.projectdetails,name='projectdetails'),
    path('requirement_submit',views.requirement_submit,name='requirement_submit'),
    path('saverequirement',views.saverequirement,name='saverequirement'),
    path('saveallrequirement',views.saveallrequirement,name="saveallrequirement"),
    path('getrequirements/<int:projectid>',views.getrequirements,name='getrequirements'),
    path('editrequirement',views.editrequirement,name="editrequirement"),
    path('<int:reqid>/versionhistory',views.versionhistory,name="versionhistory")
]