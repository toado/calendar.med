from datetime import datetime
from django.core.exceptions import ValidationError
from django.http import HttpResponse, HttpResponseBadRequest
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from courses.models import Course
from groups.models import Group, GroupParticipant
from participants.models import Participant
from .events_serializer import EventSerializer, EventGroupSerializer, TagSerializer, EventTagSerializer, \
    EventGroupInstructorSerializer
from .models import Event, EventGroup, Tag, EventTag, EventGroupInstructor


# helper function to check if search query has a number in it
def has_numbers(input_string):
    return any(char.isdigit() for char in input_string)


# query check search string has a number
def search_number(query):
    """
    Search through all events and the return a set of
    all the events where the query is contained by the field
    """
    session = Event.objects.filter(training_session__icontains=query)
    date = Event.objects.filter(event_date__icontains=query)
    end = Event.objects.filter(start_time__icontains=query)
    start = Event.objects.filter(end_time__icontains=query)
    total_set = session | date | end | start
    return total_set


def search_non_number(query):
    """
    Search through all events and the retrun a set of
    all the events where the query is contained by the field
    It also cycles through the event tags
    """
    titles = Event.objects.filter(event_title__icontains=query)
    desc = Event.objects.filter(event_desc__icontains=query)
    e_type = Event.objects.filter(event_type__icontains=query)
    tags = Tag.objects.filter(tag_name__icontains=query)
    total_set = titles | desc | e_type
    for tag in tags:
        event_tags = EventTag.objects.filter(tag_id=tag.tag_id)
        for event_tag in event_tags:
            total_set = total_set | Event.objects.filter(event_id=event_tag.event_id.event_id)
    return total_set


# helper function to check if a Course exists with with a certain id, if it doesnt it returns a validation error
def validate_course_id(data):
    if "course_id" not in data:
        raise ValidationError("The field 'course_id' is required")
    course = Course.objects.filter(course_id=data["course_id"], deleted=False).first()
    if course is None:
        raise ValidationError("Invalid course_id")
    data.pop("course_id")
    return course


# checks to see if start time is before end time and returns difference between times in minutes
def validate_start_and_end_time(start_time, end_time):
    if start_time > end_time:
        raise ValidationError("End time cannot be before start time")
    formatted_start_time = datetime.strptime(start_time, '%H:%M:%S')
    formatted_end_time = datetime.strptime(end_time, '%H:%M:%S')
    return int((formatted_end_time - formatted_start_time).total_seconds() / 60)


@api_view(["GET", "POST"])
def open_path(request):
    """
    handles event path "events/" and events?param=search
    """
    if request.method == "GET":
        if len(request.GET) > 0:
            return general_query(request)
        data = Event.objects.all().filter(deleted=False)
        serializer = EventSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        json_data = request.data
        new_event = Event()
        # TODO: make sure event does not exist already (check deleted)
        try:
            new_event.course_id = validate_course_id(json_data)
        except ValidationError as e:
            return HttpResponseBadRequest(e.message)
        try:
            duration = validate_start_and_end_time(json_data["start_time"], json_data["end_time"])
        except ValidationError:
            return HttpResponseBadRequest("End time cannot be before start time")
        json_data["total_duration"] = duration
        for k, v in json_data.items():
            setattr(new_event, k, v)
        new_event.full_clean()
        new_event.save()
        return HttpResponse("Event successfully added")


@api_view(["GET", "DELETE", "PUT"])
def look_up(request, event_id):
    """
    allows GET, DELETE, PUT commands
    handles event path "events/{event_id}"
    """
    if request.method == "GET":
        data = get_object_or_404(Event, pk=event_id, deleted=False)
        serializer = EventSerializer(data)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "DELETE":
        data = get_object_or_404(Event, pk=event_id, deleted=False)
        data.deleted = True
        data.save()
        return HttpResponse("Event successfully deleted")
    else:
        # TODO: validate end and start time here as well
        updated_event = get_object_or_404(Event, pk=event_id, deleted=False)
        json_data = request.data
        try:
            updated_event.course_id = validate_course_id(json_data)
        except ValidationError as e:
            return HttpResponseBadRequest(e.message)
        try:
            duration = validate_start_and_end_time(json_data["start_time"], json_data["end_time"])
        except ValidationError:
            return HttpResponseBadRequest("End time cannot be before start time")
        json_data["total_duration"] = duration
        for k, v in json_data.items():
            setattr(updated_event, k, v)
        updated_event.save()
        return HttpResponse("Event successfully updated")


@api_view(["GET"])
def get_event_groups(request, event_id):
    """
    allows GET commands
    handles event path "events/{event_id}/groups"
    returns all the events_groups associated with an event_id
    """
    if request.GET.get("participant"):
        participant_id = request.GET.get("participant")
        groups = GroupParticipant.objects.filter(participant_id=participant_id)
        query = []
        for group in groups.iterator():
            events = EventGroup.objects.filter(group_id=group.group_id.group_id, event_id=event_id)
            if(events.count() > 0):
                ser = EventGroupSerializer(events, many=True)
                query.append(ser.data)
        return JsonResponse(query, safe=False)
    data = EventGroup.objects.all().filter(event_id=event_id, deleted=False)
    serializer = EventGroupSerializer(data, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(["POST", "DELETE", "PUT", "GET"])
def manage_event_group(request, event_id, group_id):
    """
    handles event path "events/{event_id}/groups/{group_id}/"
    """
    if request.method == "POST":
        json_data = request.data
        event = get_object_or_404(Event, pk=event_id)
        g = get_object_or_404(Group, pk=group_id)
        search = EventGroup.objects.filter(event_id=event_id, group_id=group_id)
        if search.count() == 0:
            event_group = EventGroup(event_id=event, group_id=g)
            for k, v in json_data.items():
                setattr(event_group, k, v)
            event_group.save()
            return HttpResponse("Group successfully added to event")
        return HttpResponse("Group with that id already exists", status=status.HTTP_409_CONFLICT)
    elif request.method == "DELETE":
        event_group = EventGroup.objects.get(event_id=event_id, group_id=group_id)
        event_group.deleted = True
        event_group.save()
        return HttpResponse("Group successfully deleted from event")
    elif request.method == "GET":
        event_group = EventGroup.objects.get(event_id=event_id, group_id=group_id)
        ser = EventGroupSerializer(event_group)
        return JsonResponse(ser.data, safe=True)
    else:
        json_data = request.data
        search = EventGroup.objects.filter(event_id=event_id, group_id=group_id)
        if search.count() > 1:
            return HttpResponse("too many event groups exist", status=status.HTTP_403_FORBIDDEN)
        elif search.count() == 1:
            event = EventGroup.objects.get(event_id=event_id, group_id=group_id)
            for k, v in json_data.items():
                setattr(event, k, v)
            event.full_clean()
            event.save()
            return HttpResponse("event group editied")
        return HttpResponse("event group doesnt exist", status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(["POST", "GET"])
def general_tags(request):
    """
    handles event path "events/tags/"
    creates a new tag and gets a list of tags
    """
    if request.method == "GET":
        data = Tag.objects.filter(deleted=False)
        ser = TagSerializer(data, many=True)
        return JsonResponse(ser.data, safe=False)
    elif request.method == "POST":
        json_data = request.data
        if "tag_name" in json_data:
            tag_name = json_data["tag_name"]
            new_tag = Tag(tag_name=tag_name)
            new_tag.full_clean()
            new_tag.save()
            return HttpResponse("Tag successfully created")


@api_view(["GET", "PUT", "DELETE"])
def manage_tags(request, tag_id):
    """
    handles event path "events/tags/{tag_id}"
    edits tag and gets a specific tag and deletes a tag
    """
    if request.method == "GET":
        data = Tag.objects.filter(tag_id=tag_id)
        ser = TagSerializer(data, many=True)
        return JsonResponse(ser.data, safe=False)
    elif request.method == "PUT":
        json_data = request.data
        if "tag_name" in json_data:
            tag_name = json_data["tag_name"]
            data = get_object_or_404(Tag, tag_id=tag_id)
            data.tag_name = tag_name
            data.full_clean()
            data.save()
            return HttpResponse("Tag successfully edited")
    else:
        data = get_object_or_404(Tag, tag_id=tag_id)
        data.deleted = True
        data.full_clean()
        data.save()
        return HttpResponse("Tag successfully deleted")


@api_view(["POST", "GET"])
def event_tags(request, event_id):
    """
    handles event path "events/{event_id}/tags/"
    creates a event tag and gets a list of event tags
    """
    if request.method == "POST":
        event = get_object_or_404(Event, pk=event_id, deleted=False)
        json_data = request.data
        if "tag_id" in json_data:
            tag_id = json_data["tag_id"]
            tag = get_object_or_404(Tag, pk=tag_id, deleted=False)
            if EventTag.objects.filter(event_id=event, tag_id=tag).count() < 1:
                new_tag = EventTag(event_id=event, tag_id=tag)
                new_tag.full_clean()
                new_tag.save()
                return HttpResponse("Event tag successfully created")
            return HttpResponse("tag already added to this event", status=status.HTTP_403_FORBIDDEN)
    if request.method == "GET":
        data = EventTag.objects.filter(event_id=event_id, deleted=False)
        ser = EventTagSerializer(data, many=True)
        return JsonResponse(ser.data, safe=False)


@api_view(["GET", "DELETE"])
def manage_event_tag(request, event_id, tag_id):
    """
    handles event path "events/{event_id}/tags/{tag_id}/"
    gets a specific tag and deletes it
    """
    if request.method == "GET":
        get_object_or_404(Tag, pk=tag_id, deleted=False)
        get_object_or_404(Event, pk=event_id, deleted=False)
        data = EventTag.objects.filter(event_id=event_id, tag_id=tag_id)
        ser = EventTagSerializer(data, many=True)
        return JsonResponse(ser.data, safe=False)
    else:
        data = EventTag.objects.get(tag_id=tag_id, event_id=event_id)
        data.deleted = True
        data.full_clean()
        data.save()
        return HttpResponse("Tag successfully deleted")


def general_query(request):
    """
    handles event path "events?search={search query}"
    , "events?search={search query}"&participant={participant=_id}
    , "events?event_type={event_type1,event_type2}"&participant={participant=_id}
    """
    total_set = Event.objects.all()
    search = request.GET.get("search")
    part_events = Event.objects.all()
    # if there is a participant id available
    if request.GET.get("participant"):
        part_events = get_events_from_participant(request)
    if search:
        # check every field
        if has_numbers(search):
            # union set of all events with strings matching query
            non_number = search_non_number(search)
            number = search_number(search)
            data = non_number | number
            data = data & part_events
            serializer = EventSerializer(data.distinct(), many=True)
            return JsonResponse(serializer.data, safe=False)
        # check title, description, type
        else:
            data = search_non_number(search)
            data = data & part_events
            serializer = EventSerializer(data.distinct(), many=True)
            return JsonResponse(serializer.data, safe=False)
    # general filtering for most paths
    else:
        query_set = Event.objects.none()
        if request.GET.get("event_type"):
            # unions set of all event_types
            string = request.GET.get("event_type")
            sub = string.split(",")
            count = len(sub)
            initial = Event.objects.none()
            for i in range(0, count):
                query = sub[i]
                e_type = Event.objects.filter(event_type__icontains=query)
                initial |= e_type
            total_set = total_set & initial
        # intersects them with set of participants and all event_types
        query_set = total_set & part_events
        serializer = EventSerializer(query_set.distinct(), many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def base_group_instructors(request, event_id, group_id):
    """
        handles event path "events/{event_id}/groups/{group_id}/instructors/
        gets a list of instructors tied to and event
    """
    event_group = EventGroup.objects.get(event_id=event_id, group_id=group_id)
    data = EventGroupInstructor.objects.filter(event_group_id=event_group.event_group_id, deleted=False)
    ser = EventGroupInstructorSerializer(data, many=True)
    return JsonResponse(ser.data, safe=False)


@api_view(["POST", "DELETE"])
def handle_group_instructors(request, event_id, group_id, participant_id):
    """
        handles event path "events/{event_id}/groups/{group_id}/instructors/{participant_id}
        creates event_instructor table instance and deletes it
    """
    if request.method == "POST":
        event_group = EventGroup.objects.get(event_id=event_id, group_id=group_id)
        part = get_object_or_404(Participant, pk=participant_id)
        if part.participant_type == "instructor":
            if EventGroupInstructor.objects.filter(event_group_id=event_group, instructor_id=part).count() == 0:
                new_EGI = EventGroupInstructor(event_group_id=event_group, instructor_id=part)
                new_EGI.full_clean()
                new_EGI.save()
                return HttpResponse("instructor successfully added")
            return HttpResponse("participant with that id already exists", status=status.HTTP_409_CONFLICT)
        else:
            return HttpResponse("participant not an instructor", status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    else:
        event_group = EventGroup.objects.get(event_id=event_id, group_id=group_id)
        part = Participant.objects.get(participant_id=participant_id)
        new_EGI = EventGroupInstructor.objects.get(event_group_id=event_group, instructor_id=part)
        new_EGI.delete()
        return HttpResponse("instructor removed")


# returns every event associated with a particular participant_id
def get_events_from_participant(request):
    """
        returns all the events associated with a participant_id
    """
    participant_id = request.GET.get("participant")
    part = Participant.objects.get(participant_id=participant_id)
    group_part = GroupParticipant.objects.filter(participant_id=participant_id)
    final_events = Event.objects.none()
    if part.participant_type != "instructor":
        if group_part.count() > 0:
            for i in range(0, len(group_part)):
                e_groups = EventGroup.objects.filter(group_id=group_part[i].group_id)
                for x in range(0, len(e_groups)):
                    final_events |= Event.objects.filter(event_id=e_groups[x].event_id.event_id)
            return final_events
    else:
        EGI = EventGroupInstructor.objects.filter(instructor_id=participant_id)
        total_set = Event.objects.none()
        for i in range(0, len(EGI)):
            total_set |= Event.objects.filter(event_id=EGI[i].event_group_id.event_id.event_id)
        return total_set
