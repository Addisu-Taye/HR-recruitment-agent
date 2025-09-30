from django.contrib import admin
from .models import JobPosting, Candidate

@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'is_published', 'created_at']
    list_filter = ['is_published', 'department']
    search_fields = ['title', 'description']

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'job', 'match_score', 'shortlisted', 'created_at']