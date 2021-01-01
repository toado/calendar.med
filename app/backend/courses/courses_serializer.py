from rest_framework import serializers
from . import models


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = ['course_id', 'course_code', 'year_level', 'course_name', 'course_objectives', 'course_overview']


class CourseParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseParticipant
        fields = ['course_id', 'course_participant_id', 'participant_id']
