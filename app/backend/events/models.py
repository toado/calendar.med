from django.db import models
from courses.models import Course
from participants.models import Participant
from groups.models import Group


class Event(models.Model):

    class TrainingSession(models.TextChoices):
        SESSION_1920 = '2019-2020'
        SESSION_2021 = '2020-2021'
        SESSION_2122 = '2021-2022'
        SESSION_2223 = '2022-2023'
        SESSION_2324 = '2023-2024'

    class EventType(models.TextChoices):
        EXAM = 'Exam'
        DISCOVERY_LEARNING = 'Discovery Learning'
        LECTURE = 'Lecture'
        WHOLE_CLASS = 'Whole Class'
        SPECIAL_EVENTS = 'Special Events'
        SELF_DIRECTED_LEARNING = 'Self Directed Learning'
        LABS = 'Labs'
        TEAM_BASED_LEARNING = 'Team Based Learning'
        SMALL_GROUP = 'Small Group'
        CAREER_PLANNING = 'Career Planning'
        LEARNING_COMMUNITIES = 'Learning Communities'
        CLINICAL_SKILLS = 'Clinical Skills'
        CLINICAL_SHADOWING = 'Clinical Shadowing'
        OSCE = 'OSCE'

    event_id = models.AutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, db_column='course_id')
    training_session = models.TextField(choices=TrainingSession.choices)
    event_type = models.TextField(choices=EventType.choices)
    event_title = models.TextField()
    event_desc = models.TextField(null=True)
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_duration = models.IntegerField()
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "cal_event"


class EventGroup(models.Model):
    event_group_id = models.AutoField(primary_key=True)
    location = models.TextField(max_length=120, null=True)
    vodcast_url = models.TextField(max_length=120, null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE, db_column='event_id')
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, db_column='group_id')
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "cal_event_group"


class EventGroupInstructor(models.Model):
    event_group_instructor_id = models.AutoField(primary_key=True)
    event_group_id = models.ForeignKey(EventGroup, on_delete=models.CASCADE, db_column='event_group_id')
    instructor_id = models.ForeignKey(Participant, on_delete=models.CASCADE, db_column='instructor_id')
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "cal_event_group_instructor"


class Tag(models.Model):
    def save(self, *args, **kwargs):
        self.tag_name = self.tag_name.lower()
        return super(Tag, self).save(*args, **kwargs)

    tag_id = models.AutoField(primary_key=True)
    tag_name = models.TextField(max_length=120)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "cal_tag"


class EventTag(models.Model):
    event_tag_id = models.AutoField(primary_key=True)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE, db_column='tag_id')
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE, db_column='event_id')
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "cal_event_tag"
