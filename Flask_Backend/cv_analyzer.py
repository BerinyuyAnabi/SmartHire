import re
import textract
from io import BytesIO
import logging

try:
    # For PyPDF2 version 3.0.0 and newer
    from PyPDF2 import PdfReader
except ImportError:
    # For older PyPDF2 versions
    from PyPDF2 import PdfFileReader as PdfReader

logger = logging.getLogger(__name__)

# CS Skills Dictionary with categories and keywords
CS_SKILLS = {
    "programming_languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
        "php", "ruby", "swift", "kotlin", "scala", "perl", "r", "matlab"
    ],
    "web_frontend": [
        "html", "css", "react", "angular", "vue", "svelte", "jquery", "bootstrap",
        "tailwind", "sass", "less", "webpack", "babel", "vite", "nextjs", "nuxt"
    ],
    "web_backend": [
        "node.js", "express", "django", "flask", "spring", "asp.net", "laravel",
        "fastapi", "graphql", "rest api", "microservices", "serverless"
    ],
    "database": [
        "sql", "mysql", "postgresql", "mongodb", "nosql", "oracle", "sqlite",
        "redis", "cassandra", "dynamodb", "mariadb", "firebase", "elasticsearch"
    ],
    "devops": [
        "docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "ci/cd",
        "terraform", "ansible", "git", "github", "gitlab", "bitbucket"
    ],
    "algorithms": [
        "data structures", "algorithms", "big o notation", "sorting", "searching",
        "dynamic programming", "recursion", "graph algorithms", "tree traversal"
    ],
    "software_engineering": [
        "agile", "scrum", "kanban", "tdd", "bdd", "unit testing", "debugging",
        "code review", "oop", "design patterns", "solid principles", "clean code"
    ]
}

# Flatten the skills dictionary for easier searching
ALL_CS_SKILLS = [skill for category in CS_SKILLS.values() for skill in category]

# Common synonyms and variations for skills
SKILL_SYNONYMS = {
    "javascript": ["js", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py"],
    "node.js": ["nodejs", "node js"],
    "react": ["reactjs", "react.js"],
    "angular": ["angularjs", "angular.js"],
    "vue": ["vuejs", "vue.js"],
    "ci/cd": ["ci cd", "continuous integration", "continuous delivery", "continuous deployment"],
    "machine learning": ["ml"],
    "artificial intelligence": ["ai"],
    "mongodb": ["mongo"],
    "postgresql": ["postgres"],
    "git": ["version control"],
    # Add more synonyms as needed
}


def extract_text_from_resume(file_object):
    """
    Extract text from uploaded resume file (PDF, DOCX, TXT)
    """
    filename = file_object.filename.lower()
    file_content = file_object.read()
    file_content_io = BytesIO(file_content)

    try:
        if filename.endswith('.pdf'):
            # Extract text from PDF
            pdf_reader = PyPDF2.PdfReader(file_content_io)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text

        elif filename.endswith('.docx'):
            # Extract text from DOCX
            text = textract.process(file_content_io).decode('utf-8')
            return text

        elif filename.endswith('.txt'):
            # Extract text from TXT
            return file_content.decode('utf-8')

        else:
            logger.error(f"Unsupported file format: {filename}")
            raise ValueError(f"Unsupported file format: {filename}")

    except Exception as e:
        logger.error(f"Error extracting text from resume: {str(e)}")
        raise Exception(f"Error extracting text from resume: {str(e)}")


def analyze_cs_skills(resume_text):
    """
    Analyze a resume for CS skills and return matched skills
    """
    resume_text = resume_text.lower()
    matched_skills = {}
    
    # Check for each skill and its synonyms
    for skill in ALL_CS_SKILLS:
        # Check for the main skill term
        if re.search(r'\b' + re.escape(skill) + r'\b', resume_text):
            matched_skills[skill] = True
            continue
            
        # Check for synonyms
        if skill in SKILL_SYNONYMS:
            for synonym in SKILL_SYNONYMS[skill]:
                if re.search(r'\b' + re.escape(synonym) + r'\b', resume_text):
                    matched_skills[skill] = True
                    break
    
    # Group matched skills by category
    results_by_category = {}
    for category, skills in CS_SKILLS.items():
        category_matches = [skill for skill in skills if skill in matched_skills]
        if category_matches:
            results_by_category[category] = category_matches
    
    return {
        "matched_skills": list(matched_skills.keys()),
        "total_skills": len(ALL_CS_SKILLS),
        "match_count": len(matched_skills),
        "match_percentage": round((len(matched_skills) / len(ALL_CS_SKILLS)) * 100, 2),
        "categories": results_by_category
    }


def check_job_requirements(matched_skills, required_skills, min_match_percentage=60):
    """
    Check if a candidate's skills match the job requirements
    
    Parameters:
        matched_skills: List of skills found in the candidate's resume
        required_skills: List of skills required for the job
        min_match_percentage: Minimum percentage of required skills to match
        
    Returns:
        Dictionary with match results
    """
    if not required_skills:
        # If no specific requirements, use a default threshold of found skills
        return {
            "passes": len(matched_skills) >= 5,
            "match_percentage": 100 if len(matched_skills) >= 5 else (len(matched_skills) * 20),
            "matched_required": matched_skills[:5],
            "missing_required": []
        }
    
    # Check which required skills are matched
    matched_required = [skill for skill in required_skills if skill in matched_skills]
    missing_required = [skill for skill in required_skills if skill not in matched_skills]
    
    # Calculate match percentage against requirements
    match_percentage = 0
    if required_skills:
        match_percentage = (len(matched_required) / len(required_skills)) * 100
    
    return {
        "passes": match_percentage >= min_match_percentage,
        "match_percentage": round(match_percentage, 2),
        "matched_required": matched_required,
        "missing_required": missing_required
    }


def evaluate_experience_level(resume_text):
    """
    Estimate the experience level based on resume content
    """
    resume_text = resume_text.lower()
    
    # Keywords suggesting experience levels
    senior_keywords = [
        "senior", "lead", "principal", "architect", "manager", "head of", "director",
        "7+ years", "7 years", "8 years", "9 years", "10 years", "10+ years"
    ]
    
    mid_keywords = [
        "mid-level", "intermediate", "3 years", "4 years", "5 years", "6 years",
        "3+ years", "4+ years", "5+ years"
    ]
    
    junior_keywords = [
        "junior", "entry level", "entry-level", "intern", "internship", "graduate",
        "1 year", "2 years", "1-2 years", "<3 years", "bootcamp"
    ]
    
    # Count matches for each level
    senior_count = sum(1 for keyword in senior_keywords if keyword in resume_text)
    mid_count = sum(1 for keyword in mid_keywords if keyword in resume_text)
    junior_count = sum(1 for keyword in junior_keywords if keyword in resume_text)
    
    # Determine level based on highest count
    counts = {
        "senior": senior_count,
        "mid": mid_count,
        "junior": junior_count
    }
    
    # Default to junior if no clear indicators
    if senior_count == 0 and mid_count == 0 and junior_count == 0:
        return "junior"
        
    return max(counts, key=counts.get)


def analyze_cs_resume(resume_file, required_skills=None, min_match_percentage=60):
    """
    Main function to analyze a CS resume
    
    Parameters:
        resume_file: Uploaded resume file object
        required_skills: List of skills required for the job (optional)
        min_match_percentage: Minimum percentage of required skills to match
        
    Returns:
        Dictionary with analysis results
    """
    try:
        # Extract text from resume
        resume_text = extract_text_from_resume(resume_file)
        
        # Analyze skills
        skills_analysis = analyze_cs_skills(resume_text)
        
        # Check against job requirements
        job_match = check_job_requirements(
            skills_analysis["matched_skills"], 
            required_skills,
            min_match_percentage
        )
        
        # Estimate experience level
        experience_level = evaluate_experience_level(resume_text)
        
        # Combine results
        return {
            "success": True,
            "skills_analysis": skills_analysis,
            "job_match": job_match,
            "experience_level": experience_level,
            "proceed_to_assessment": job_match["passes"]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }