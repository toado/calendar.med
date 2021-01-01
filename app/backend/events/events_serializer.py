from rest_framework import serializers
from . import models


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ['event_id', 'course_id', 'training_session', 'event_type', 'event_title', 'event_desc',
                  'event_date', 'start_time', 'end_time', 'total_duration', 'deleted']


class EventGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EventGroup
        fields = ['event_group_id', 'event_id', 'group_id', 'location', 'vodcast_url', 'deleted']


class EventGroupInstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EventGroupInstructor
        fields = ['event_group_instructor_id', 'event_group_id', 'instructor_id', 'deleted']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = ['tag_id', 'tag_name', 'deleted']


class EventTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EventTag
        fields = ['event_tag_id', 'tag_id', 'event_id', 'deleted']
