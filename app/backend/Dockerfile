FROM python:3.8

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=calendar_med.settings

WORKDIR /app/backend

COPY requirements.txt /app/backend
RUN pip3 install --upgrade pip -r requirements.txt

COPY . /app/backend


EXPOSE 8000
CMD python3 manage.py runserver 0.0.0.0:8000
