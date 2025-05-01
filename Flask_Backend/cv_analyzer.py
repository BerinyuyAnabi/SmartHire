import re
import logging
from io import BytesIO

# Setup logging
logger = logging.getLogger(__name__)

# PyPDF2 fallback handling
try:
    # For PyPDF2 version 3.0.0 and newer
    from PyPDF2 import PdfReader
    HAS_PYPDF2 = True
except ImportError:
    try:
        # For older PyPDF2 versions
        from PyPDF2 import PdfFileReader as PdfReader
        HAS_PYPDF2 = True
    except ImportError:
        HAS_PYPDF2 = False
        logger.warning("PyPDF2 not installed. PDF parsing will be limited.")

# Textract fallback handling
try:
    import textract
    HAS_TEXTRACT = True
except ImportError:
    HAS_TEXTRACT = False
    logger.warning("Textract not installed. DOCX parsing will be limited.")

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
    if not file_object:
        raise ValueError("No file provided")
        
    filename = file_object.filename.lower() if hasattr(file_object, 'filename') else str(file_object)
    file_content = file_object.read() if hasattr(file_object, 'read') else file_object
    
    try:
        # Create BytesIO object if we have binary content
        if isinstance(file_content, bytes):
            file_content_io = BytesIO(file_content)
        else:
            # If it's already a file-like object, use it directly
            file_content_io = file_content

        # Extract text based on file extension
        if filename.endswith('.pdf'):
            # PDF extraction
            if not HAS_PYPDF2:
                raise ImportError("PyPDF2 is not installed. Cannot process PDF files.")
            
            try:
                pdf_reader = PdfReader(file_content_io)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
            except Exception as e:
                logger.error(f"PDF extraction error: {str(e)}")
                # Try a basic text extraction fallback
                try:
                    # This is a very basic fallback and may not work well
                    decoded = file_content.decode('utf-8', errors='ignore')
                    return decoded
                except:
                    raise ValueError("Could not extract text from PDF.")

        elif filename.endswith('.docx'):
            # DOCX extraction
            if HAS_TEXTRACT:
                try:
                    text = textract.process(file_content_io).decode('utf-8')
                    return text
                except Exception as e:
                    logger.error(f"DOCX extraction error with textract: {str(e)}")
            
            # We don't have textract, try with python-docx if available
            try:
                import docx
                doc = docx.Document(file_content_io)
                return "\n".join([para.text for para in doc.paragraphs])
            except ImportError:
                raise ImportError("Neither textract nor python-docx is installed. Cannot process DOCX files.")
            except Exception as e:
                logger.error(f"DOCX extraction error: {str(e)}")
                raise ValueError(f"Could not extract text from DOCX: {str(e)}")
                
        elif filename.endswith('.txt'):
            # Plain text extraction
            if isinstance(file_content, bytes):
                return file_content.decode('utf-8', errors='ignore')
            return file_content

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


def check_job_requirements(matched_skills, required_skills=None, min_match_percentage=60):
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


def analyze_cs_resume(resume_file, job_id=None):
    """
    Main function to analyze a CS resume
    
    Parameters:
        resume_file: Uploaded resume file object
        job_id: ID of the job being applied for (optional)
        
    Returns:
        Dictionary with analysis results
    """
    try:
        # Get required skills based on job_id if provided
        required_skills = None
        min_match_percentage = 60
        
        if job_id:
            try:
                # Try to get job requirements from database
                # This is just a placeholder - implement as needed
                # required_skills = get_job_requirements(job_id)
                pass
            except Exception as e:
                logger.error(f"Error getting job requirements: {str(e)}")
        
        # Extract text from resume
        try:
            resume_text = extract_text_from_resume(resume_file)
        except ImportError as e:
            # Return limited functionality if dependencies are missing
            logger.error(f"Dependency error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "limited_mode": True,
                "experience_level": "unknown",
                "proceed_to_assessment": True  # Default to allowing assessment
            }
        
        if not resume_text or len(resume_text.strip()) < 100:
            return {
                "success": False,
                "error": "Could not extract sufficient text from the resume",
                "proceed_to_assessment": True  # Let them proceed anyway
            }
        
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
            "error": str(e),
            "proceed_to_assessment": True  # Default to allowing assessment if analysis fails
        }