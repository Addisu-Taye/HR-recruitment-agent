from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage
import operator
import torch
import gc
import re
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
from .pii_utils import scan_pii, redact_pii

# CPU-OPTIMIZED MODELS
ner_pipe = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple",
    device=-1,
    torch_dtype=torch.float32
)

embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device="cpu")

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2-0.5B-Instruct")
llm = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2-0.5B-Instruct",
    device_map="cpu",
    torch_dtype=torch.float32,
    low_cpu_mem_usage=True
)

class RecruitmentState(TypedDict):
    candidate_name: str
    candidate_email: str
    resume_text: str
    job_description: str
    job_requirements: str
    extracted_skills: list
    experience_years: int
    education: str
    match_score: float
    strengths: list
    missing_skills: list
    shortlisted: bool
    messages: Annotated[Sequence[BaseMessage], operator.add]

def resume_parser_node(state: RecruitmentState):
    text = state["resume_text"]
    
    # PII Redaction
    if scan_pii(text):
        text = redact_pii(text)
        state["messages"].append("PII detected and redacted")
    
    # Skill Extraction (limited context)
    try:
        ner_results = ner_pipe(text[:1000])
        skills = list(set([r['word'] for r in ner_results if r['entity_group'] == 'SKILL']))
    except:
        skills = []
    
    # Experience Extraction
    exp_match = re.search(r'(\d+)\+?\s+years?\s+(?:of\s+)?experience', text, re.IGNORECASE)
    experience = int(exp_match.group(1)) if exp_match else 0
    
    # Education Extraction
    edu_keywords = ["bachelor", "master", "phd", "degree", "university"]
    education = next((word for word in text.split() if word.lower() in edu_keywords), "Not specified")
    
    gc.collect()
    return {
        "resume_text": text,
        "extracted_skills": skills[:10],
        "experience_years": experience,
        "education": education,
        "messages": [f"Parsed: {len(skills)} skills, {experience} yrs exp"]
    }

def embedding_node(state: RecruitmentState):
    job_text = f"{state['job_description'][:500]} {state['job_requirements'][:500]}"
    resume_text = state["resume_text"][:500]
    
    try:
        job_vec = embedder.encode(job_text)
        resume_vec = embedder.encode(resume_text)
        similarity = torch.cosine_similarity(
            torch.tensor(job_vec).unsqueeze(0),
            torch.tensor(resume_vec).unsqueeze(0)
        ).item()
        score = min(max(similarity * 100, 0), 100)
    except:
        score = 0.0
    
    gc.collect()
    return {"match_score": score, "messages": [f"Match score: {score:.1f}%"]}

def insight_generator_node(state: RecruitmentState):
    shortlisted = state["match_score"] >= 70
    strengths = state["extracted_skills"][:3] or ["Relevant experience"]
    
    # Missing skills logic
    job_req_lower = state['job_requirements'].lower()
    missing = []
    if "banking" in job_req_lower and not any("bank" in s.lower() for s in strengths):
        missing.append("Banking experience")
    if "python" in job_req_lower and not any("python" in s.lower() for s in strengths):
        missing.append("Python")
    
    gc.collect()
    return {
        "strengths": strengths,
        "missing_skills": missing[:3],
        "shortlisted": shortlisted,
        "messages": [f"Shortlisted: {shortlisted}"]
    }

# BUILD GRAPH
workflow = StateGraph(RecruitmentState)
workflow.add_node("parser", resume_parser_node)
workflow.add_node("embedder", embedding_node)
workflow.add_node("insights", insight_generator_node)

workflow.set_entry_point("parser")
workflow.add_edge("parser", "embedder")
workflow.add_edge("embedder", "insights")
workflow.add_edge("insights", END)

recruitment_graph = workflow.compile()