def send_shortlist_notification(candidate_id):
    from .models import Candidate
    candidate = Candidate.objects.get(id=candidate_id)
    
    message = Mail(
        from_email='recruitment@hibretbank.com',
        to_emails=candidate.email,
        subject='Congratulations! Shortlisted at Hibret Bank',
        plain_text_content=f"""
Dear {candidate.name},

Congratulations! You've been shortlisted for {candidate.job.title}.
Match Score: {candidate.match_score:.1f}%

Next Steps:
- Interview scheduling: https://cal.com/hibret-bank/interview
- Required documents: ID, Degree certificates, CV

Best regards,
Hibret Bank HR Team
        """
    )  # ← Aligned with "message = Mail("
    
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        sg.send(message)
    except Exception as e:
        print(f"Email failed: {str(e)}")