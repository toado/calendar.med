from . import views
from django.urls import path, re_path


urlpatterns = [
    path("<event_id>", views.look_up),
    re_path(r'^$', views.open_path, name="open path"),
    re_path(r'^(?P<event_id>\d+)/groups/$', views.get_event_groups),
    path("<event_id>/groups/<group_id>/", views.manage_event_group),
    path("<event_id>/groups/<group_id>/instructors/", views.base_group_instructors),
    path("<event_id>/groups/<group_id>/instructors/<participant_id>/", views.handle_group_instructors),
    path("tags/", views.general_tags),
    path("tags/<tag_id>/", views.manage_tags),
    path("<event_id>/tags/", views.event_tags),
    path("<event_id>/tags/<tag_id>/", views.manage_event_tag),
]
