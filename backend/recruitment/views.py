import json
import gc
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from PyPDF2 import PdfReader
from .langgraph_agent.workflow import recruitment_graph
from .models import JobPosting, Candidate
from .tasks import send_shortlist_notification

@csrf_exempt
def process_application(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'})
    
    try:
        job_id = request.POST.get('job_id')
        candidate_name = request.POST.get('name')
        candidate_email = request.POST.get('email')
        resume_file = request.FILES.get('resume')
        
        # Save and extract PDF
        file_path = default_storage.save(f'temp/{resume_file.name}', resume_file)
        full_path = default_storage.path(file_path)
        
        reader = PdfReader(full_path)
        resume_text = ""
        for page in reader.pages:
            resume_text += page.extract_text() or ""
        
        # Get job
        job = JobPosting.objects.get(id=job_id)
        
        # Run LangGraph
        initial_state = {
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
            "resume_text": resume_text,
            "job_description": job.description,
            "job_requirements": job.requirements,
            "extracted_skills": [],
            "experience_years": 0,
            "education": "",
            "match_score": 0.0,
            "strengths": [],
            "missing_skills": [],
            "shortlisted": False,
            "messages": []
        }
        
        final_state = recruitment_graph.invoke(initial_state)
        
        # Save candidate
        candidate = Candidate.objects.create(
            name=candidate_name,
            email=candidate_email,
            resume_file=resume_file,
            resume_text=resume_text,
            job=job,
            match_score=final_state["match_score"],
            skills=final_state["extracted_skills"],
            experience_years=final_state["experience_years"],
            education=final_state["education"],
            shortlisted=final_state["shortlisted"]
        )
        
        # Send email if shortlisted
        if final_state["shortlisted"]:
            send_shortlist_notification(candidate.id)
        
        gc.collect()
        return JsonResponse({
            "candidate_id": candidate.id,
            "match_score": final_state["match_score"],
            "shortlisted": final_state["shortlisted"],
            "strengths": final_state["strengths"],
            "missing_skills": final_state["missing_skills"]
        })
    
    except Exception as e:
        gc.collect()
        return JsonResponse({'error': str(e)}, status=500)

def job_listings(request):
    jobs = JobPosting.objects.filter(is_published=True).values(
        'id', 'title', 'department', 'description', 'requirements'
    )
    return JsonResponse(list(jobs), safe=False)

def analytics_data(request):
    from django.db.models import Avg, Count
    total = Candidate.objects.count()
    shortlisted = Candidate.objects.filter(shortlisted=True).count()
    avg_score = Candidate.objects.aggregate(avg=Avg('match_score'))['avg'] or 0
    
    job_scores = Candidate.objects.values('job__title').annotate(
        avg_score=Avg('match_score')
    ).order_by('-avg_score')[:5]
    
    return JsonResponse({
        "job_titles": [item['job__title'] for item in job_scores],
        "match_scores": [float(item['avg_score']) for item in job_scores],
        "total_candidates": total,
        "shortlisted": shortlisted,
        "avg_score": avg_score
    })