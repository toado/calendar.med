from django.db import models


class Interm(models.Model):
    statement = models.CharField(max_length=100)
