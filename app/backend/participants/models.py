from django.db import models


class Participant(models.Model):
    class Meta:
        db_table = "cal_participant"

    class ParticipantType(models.TextChoices):
        INSTRUCTOR = "Instructor"
        STUDENT = "Student"
        ADMIN = "Admin"

    participant_id = models.CharField(max_length=120, primary_key=True)
    participant_type = models.TextField(choices=ParticipantType.choices)
    first = models.TextField(max_length=120)
    last = models.TextField(max_length=120)
    deleted = models.BooleanField(default=False)
