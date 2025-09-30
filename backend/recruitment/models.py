from django.db import models

class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):  # ← ADD THIS EXACT METHOD
        return self.title

class Candidate(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    resume_file = models.FileField(upload_to='resumes/')
    resume_text = models.TextField()
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    match_score = models.FloatField(default=0.0)
    skills = models.JSONField(default=list)
    experience_years = models.IntegerField(default=0)
    education = models.CharField(max_length=200, blank=True)
    shortlisted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):  # ← ADD THIS EXACT METHOD
        return f"{self.name} - {self.job.title if self.job else 'No Job'}"