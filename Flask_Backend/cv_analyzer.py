"""
cv_analyzer.py - Save this file in your project root
"""

import os
import re
import uuid
import logging
from io import BytesIO
from flask import Blueprint, request, jsonify, send_file

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# PyPDF2 fallback handling
try:
    from PyPDF2 import PdfReader

    HAS_PYPDF2 = True
except ImportError:
    try:
        from PyPDF2 import PdfFileReader as PdfReader

        HAS_PYPDF2 = True
    except ImportError:
        HAS_PYPDF2 = False
        logger.warning("PyPDF2 not installed. PDF parsing will be limited.")

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
}


def save_uploaded_file(file_object, upload_folder, applicant_id=None, file_type="resume"):
    if not file_object:
        return None

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder, exist_ok=True)

    if hasattr(file_object, 'filename'):
        original_filename = file_object.filename
    elif hasattr(file_object, 'name'):
        original_filename = file_object.name
    else:
        extension = ".pdf"
        original_filename = f"uploaded_file{extension}"

    unique_id = str(uuid.uuid4())[:8]
    if applicant_id:
        filename = f"{applicant_id}_{file_type}_{unique_id}_{os.path.basename(original_filename)}"
    else:
        filename = f"{file_type}_{unique_id}_{os.path.basename(original_filename)}"

    file_path = os.path.join(upload_folder, filename)

    try:
        if hasattr(file_object, 'read'):
            if hasattr(file_object, 'seek'):
                file_object.seek(0)
            file_content = file_object.read()
        elif isinstance(file_object, bytes):
            file_content = file_object
        else:
            logger.error(f"Cannot read content from file object: {original_filename}")
            return None

        with open(file_path, 'wb') as f:
            f.write(file_content)

        logger.info(f"Saved uploaded file to: {file_path}")
        return file_path

    except Exception as e:
        logger.error(f"Error saving uploaded file: {str(e)}")
        return None


def extract_text_from_pdf_file(filepath):
    if not HAS_PYPDF2:
        raise ImportError("PyPDF2 is not installed. Cannot process PDF files.")

    try:
        logger.info(f"Reading PDF from disk: {filepath}")
        with open(filepath, 'rb') as file:
            pdf_reader = PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF file: {str(e)}")
        raise ValueError(f"Could not extract text from PDF: {str(e)}")


def extract_text_from_docx_file(filepath):
    try:
        import docx
        doc = docx.Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])
    except ImportError:
        logger.error("python-docx not installed")
        raise ImportError("python-docx is not installed. Cannot process DOCX files.")
    except Exception as e:
        logger.error(f"DOCX extraction error: {str(e)}")
        raise ValueError(f"Could not extract text from DOCX: {str(e)}")


def extract_text_from_resume(file_object, save_to_disk=True, upload_folder=None, applicant_id=None, file_type="resume"):
    if not file_object:
        logger.error("No file provided")
        raise ValueError("No file provided")

    saved_file_path = None

    try:
        if hasattr(file_object, 'filename'):
            filename = file_object.filename.lower()
        elif hasattr(file_object, 'name'):
            filename = file_object.name.lower()
        else:
            filename = str(file_object).lower()

        logger.info(f"Processing file: {filename}")

        if not (filename.endswith('.pdf') or filename.endswith('.docx') or filename.endswith('.txt')):
            logger.error(f"Unsupported file format: {filename}")
            raise ValueError(f"Unsupported file format. Please upload a PDF, DOCX, or TXT file.")

        if save_to_disk and upload_folder:
            saved_file_path = save_uploaded_file(
                file_object,
                upload_folder,
                applicant_id,
                file_type
            )

            if saved_file_path:
                if filename.endswith('.pdf'):
                    text = extract_text_from_pdf_file(saved_file_path)
                elif filename.endswith('.docx'):
                    text = extract_text_from_docx_file(saved_file_path)
                elif filename.endswith('.txt'):
                    with open(saved_file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        text = f.read()

                return text, saved_file_path

        if hasattr(file_object, 'read'):
            if hasattr(file_object, 'seek'):
                file_object.seek(0)
            file_content = file_object.read()
        elif isinstance(file_object, bytes):
            file_content = file_object
        else:
            logger.error("Could not read file content")
            raise ValueError("Invalid file object")

        file_content_io = BytesIO(file_content)

        if filename.endswith('.pdf'):
            if not HAS_PYPDF2:
                raise ImportError("PyPDF2 is not installed. Cannot process PDF files.")

            try:
                logger.info("Attempting to read PDF with PyPDF2")
                pdf_reader = PdfReader(file_content_io)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text, saved_file_path
            except Exception as e:
                logger.error(f"PDF extraction error: {str(e)}")
                try:
                    decoded = file_content.decode('utf-8', errors='ignore')
                    logger.info("Used fallback UTF-8 decoding for PDF")
                    return decoded, saved_file_path
                except Exception as decode_error:
                    logger.error(f"Fallback decoding failed: {str(decode_error)}")
                    raise ValueError("Could not extract text from PDF.")

        elif filename.endswith('.docx'):
            try:
                import docx
                doc = docx.Document(file_content_io)
                return "\n".join([para.text for para in doc.paragraphs]), saved_file_path
            except ImportError:
                logger.error("python-docx not installed")
                raise ImportError("python-docx is not installed. Cannot process DOCX files.")
            except Exception as e:
                logger.error(f"DOCX extraction error: {str(e)}")
                raise ValueError(f"Could not extract text from DOCX: {str(e)}")

        elif filename.endswith('.txt'):
            return file_content.decode('utf-8', errors='ignore'), saved_file_path

    except Exception as e:
        logger.error(f"Error extracting text from resume: {str(e)}")
        if saved_file_path:
            return None, saved_file_path
        raise Exception(f"Error extracting text from resume: {str(e)}")


def analyze_cs_skills(resume_text):
    resume_text = resume_text.lower()
    matched_skills = {}

    for skill in ALL_CS_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', resume_text):
            matched_skills[skill] = True
            continue

        if skill in SKILL_SYNONYMS:
            for synonym in SKILL_SYNONYMS[skill]:
                if re.search(r'\b' + re.escape(synonym) + r'\b', resume_text):
                    matched_skills[skill] = True
                    break

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
    if not required_skills:
        return {
            "passes": len(matched_skills) >= 5,
            "match_percentage": 100 if len(matched_skills) >= 5 else (len(matched_skills) * 20),
            "matched_required": matched_skills[:5],
            "missing_required": []
        }

    matched_required = [skill for skill in required_skills if skill in matched_skills]
    missing_required = [skill for skill in required_skills if skill not in matched_skills]

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
    resume_text = resume_text.lower()

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

    senior_count = sum(1 for keyword in senior_keywords if keyword in resume_text)
    mid_count = sum(1 for keyword in mid_keywords if keyword in resume_text)
    junior_count = sum(1 for keyword in junior_keywords if keyword in resume_text)

    counts = {
        "senior": senior_count,
        "mid": mid_count,
        "junior": junior_count
    }

    if senior_count == 0 and mid_count == 0 and junior_count == 0:
        return "junior"

    return max(counts, key=counts.get)


def analyze_cs_resume(resume_file, job_id=None, applicant_id=None, upload_folder="static/uploads"):
    try:
        required_skills = None
        min_match_percentage = 60

        if job_id:
            try:
                pass  # Get job requirements from database here
            except Exception as e:
                logger.error(f"Error getting job requirements: {str(e)}")

        try:
            resume_text, saved_file_path = extract_text_from_resume(
                resume_file,
                save_to_disk=True,
                upload_folder=upload_folder,
                applicant_id=applicant_id,
                file_type="resume"
            )
        except ImportError as e:
            logger.error(f"Dependency error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "limited_mode": True,
                "experience_level": "unknown",
                "proceed_to_assessment": True,
                "resume_path": None
            }

        if not resume_text or len(resume_text.strip()) < 100:
            return {
                "success": False,
                "error": "Could not extract sufficient text from the resume",
                "proceed_to_assessment": True,
                "resume_path": saved_file_path
            }

        skills_analysis = analyze_cs_skills(resume_text)

        job_match = check_job_requirements(
            skills_analysis["matched_skills"],
            required_skills,
            min_match_percentage
        )

        experience_level = evaluate_experience_level(resume_text)

        return {
            "success": True,
            "skills_analysis": skills_analysis,
            "job_match": job_match,
            "experience_level": experience_level,
            "proceed_to_assessment": job_match["passes"],
            "resume_path": saved_file_path
        }

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "proceed_to_assessment": True,
            "resume_path": None
        }


def generate_applicant_id(applicant_data):
    import hashlib

    name = f"{applicant_data.get('firstName', '')} {applicant_data.get('lastName', '')}"
    email = applicant_data.get('email', '')

    hash_input = f"{name}{email}{uuid.uuid4()}"
    return hashlib.md5(hash_input.encode()).hexdigest()[:12]


def save_application_to_db(applicant_data, resume_path, cover_letter_path, job_id, skills_analysis, experience_level):
    # This function would be implemented to save to your database
    # For this example, we'll return a dummy application ID
    application_id = str(uuid.uuid4())

    logger.info(f"Saving application {application_id} to database")
    logger.info(f"Resume path: {resume_path}")
    logger.info(f"Cover letter path: {cover_letter_path}")

    return application_id


def submit_application(applicant_data, resume_file, cover_letter_file=None, job_id=None):
    try:
        applicant_id = generate_applicant_id(applicant_data)
        upload_folder = "static/uploads/applications"

        resume_analysis = analyze_cs_resume(
            resume_file,
            job_id=job_id,
            applicant_id=applicant_id,
            upload_folder=upload_folder
        )

        cover_letter_path = None
        if cover_letter_file:
            try:
                _, cover_letter_path = extract_text_from_resume(
                    cover_letter_file,
                    save_to_disk=True,
                    upload_folder=upload_folder,
                    applicant_id=applicant_id,
                    file_type="cover_letter"
                )
            except Exception as e:
                logger.error(f"Error processing cover letter: {str(e)}")

        application_id = save_application_to_db(
            applicant_data,
            resume_path=resume_analysis.get("resume_path"),
            cover_letter_path=cover_letter_path,
            job_id=job_id,
            skills_analysis=resume_analysis.get("skills_analysis"),
            experience_level=resume_analysis.get("experience_level")
        )

        return {
            "success": resume_analysis.get("success", False),
            "message": "Your application has been received" if resume_analysis.get("success",
                                                                                   False) else "Application submitted with limited resume analysis",
            "application_id": application_id,
            "analysis": {
                "skills_analysis": resume_analysis.get("skills_analysis"),
                "job_match": resume_analysis.get("job_match"),
                "experience_level": resume_analysis.get("experience_level")
            },
            "proceed_to_assessment": resume_analysis.get("proceed_to_assessment", True)
        }

    except Exception as e:
        logger.error(f"Error submitting application: {str(e)}")
        return {
            "success": False,
            "error": f"Error submitting application: {str(e)}",
            "proceed_to_assessment": True
        }


# Create a Blueprint for the routes
api_bp = Blueprint('api', __name__)


@api_bp.route('/public/jobs/<job_id>/apply-with-screening', methods=['POST'])
def apply_with_screening(job_id):
    """
    Endpoint to submit an application with resume screening
    """
    try:
        # Check if files are in the request
        if 'resume' not in request.files:
            return jsonify({
                'success': False,
                'error': "We couldn't process your resume. Please make sure it's in a valid format (PDF or Word)."
            }), 400

        # Get the resume file
        resume_file = request.files['resume']

        # Check if a filename was provided
        if resume_file.filename == '':
            return jsonify({
                'success': False,
                'error': "No resume file selected"
            }), 400

        # Get cover letter if provided
        cover_letter_file = None
        if 'coverLetter' in request.files:
            cover_letter = request.files['coverLetter']
            if cover_letter.filename != '':
                cover_letter_file = cover_letter

        # Extract applicant data from form
        applicant_data = {
            'firstName': request.form.get('firstName', ''),
            'lastName': request.form.get('lastName', ''),
            'gender': request.form.get('gender', ''),
            'email': request.form.get('email', ''),
            'phone': request.form.get('phone', '')
        }

        # Validate required fields
        if not applicant_data['firstName'] or not applicant_data['lastName'] or not applicant_data['email']:
            return jsonify({
                'success': False,
                'error': "Please fill in all required fields"
            }), 400

        # Process the application
        result = submit_application(
            applicant_data,
            resume_file,
            cover_letter_file,
            job_id
        )

        # Customize the response message based on the result
        if result.get('success', False):
            result[
                'message'] = f"We've successfully analyzed your resume and found {result.get('analysis', {}).get('skills_analysis', {}).get('match_count', 0)} matching skills."
        else:
            if 'error' in result:
                # If there's a specific error, use that
                result['message'] = result['error']
            else:
                # Default message
                result['message'] = "We've received your application but couldn't fully analyze your resume."

        # Always provide the application ID if available
        if 'application_id' in result:
            result['application_id'] = result['application_id']

        # Return the result
        status_code = 200 if result.get('success', False) else 422
        return jsonify(result), status_code

    except Exception as e:
        logger.error(f"Error in application submission: {str(e)}")
        return jsonify({
            'success': False,
            'error': "We encountered an error processing your application. Please try again.",
            'proceed_to_assessment': True  # Let them proceed anyway
        }), 500


@api_bp.route('/admin/applications/<application_id>', methods=['GET'])
def get_application_details(application_id):
    """
    Admin endpoint to get application details including file paths
    """
    try:
        # This would be implemented to fetch from your database
        # For demonstration, we'll return a mock response
        return jsonify({
            'success': True,
            'application': {
                'id': application_id,
                'applicant': {
                    'firstName': 'John',
                    'lastName': 'Doe',
                    'email': 'john.doe@example.com',
                    'phone': '+1234567890'
                },
                'job_id': 'job123',
                'resume_path': f"static/uploads/applications/{application_id}_resume_filename.pdf",
                'cover_letter_path': f"static/uploads/applications/{application_id}_cover_letter_filename.pdf",
                'experience_level': 'mid',
                'skills_analysis': {
                    'matched_skills': ['python', 'javascript', 'react'],
                    'match_count': 3
                },
                'status': 'pending',
                'submission_date': '2023-06-01T12:00:00Z'
            }
        }), 200

    except Exception as e:
        logger.error(f"Error fetching application details: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Error fetching application details: {str(e)}"
        }), 500


@api_bp.route('/admin/applications/<application_id>/resume', methods=['GET'])
def download_resume(application_id):
    """
    Admin endpoint to download an applicant's resume
    """
    try:
        # In a real implementation, you would:
        # 1. Query database for resume_path
        # 2. Check if file exists
        # 3. Return file as attachment

        # Example implementation:
        # application = get_application_from_db(application_id)
        # resume_path = application.resume_path
        # if os.path.exists(resume_path):
        #     return send_file(resume_path, as_attachment=True)
        # else:
        #     return jsonify({'error': 'Resume file not found'}), 404

        return jsonify({'message': 'Resume download endpoint'}), 200

    except Exception as e:
        logger.error(f"Error downloading resume: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Error downloading resume: {str(e)}"
        }), 500


@api_bp.route('/admin/applications/<application_id>/cover-letter', methods=['GET'])
def download_cover_letter(application_id):
    """
    Admin endpoint to download an applicant's cover letter
    """
    try:
        # Similar implementation to download_resume
        # Example implementation:
        # application = get_application_from_db(application_id)
        # cover_letter_path = application.cover_letter_path
        # if cover_letter_path and os.path.exists(cover_letter_path):
        #     return send_file(cover_letter_path, as_attachment=True)
        # else:
        #     return jsonify({'error': 'Cover letter file not found'}), 404

        return jsonify({'message': 'Cover letter download endpoint'}), 200

    except Exception as e:
        logger.error(f"Error downloading cover letter: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Error downloading cover letter: {str(e)}"
        }), 500


# Function to register the blueprint with your Flask app
def register_api_routes(app):
    app.register_blueprint(api_bp, url_prefix='/api')