import re

def scan_pii(text):
    """Detect PII patterns in text"""
    ssn_pattern = r'\b\d{3}-?\d{2}-?\d{4}\b'
    account_pattern = r'\b\d{8,17}\b'
    phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
    
    has_pii = (
        bool(re.search(ssn_pattern, text)) or
        bool(re.search(account_pattern, text)) or
        bool(re.search(phone_pattern, text))
    )
    return has_pii

def redact_pii(text):
    """Redact PII patterns"""
    text = re.sub(r'\b\d{3}-?\d{2}-?\d{4}\b', '[REDACTED_SSN]', text)
    text = re.sub(r'\b\d{8,17}\b', '[REDACTED_ACCOUNT]', text)
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[REDACTED_PHONE]', text)
    return text