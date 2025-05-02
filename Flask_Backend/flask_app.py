
from flask import Flask, request, jsonify, send_from_directory, session, redirect, url_for, render_template
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import logging
import base64
import os
import re
import json
from datetime import datetime, timedelta
from database import get_db_connection

# CV IMPORTS
from question_bank import get_assessment_questions
import json
from datetime import datetime
from cv_analyzer import register_api_routes, analyze_cs_resume
from pathlib import Path


# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist/static',
            template_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist')

register_api_routes(app)


# Set a fixed secret key or use environment variable (important for session persistence)
app.secret_key = os.getenv('SECRET_KEY', 'your-default-development-secret-key')

# Session configuration
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=24)  # Session lasts for 24 hours
)

# Configure logging
logging.basicConfig(level=logging.DEBUG)


# ========================================
# CREATING THE UPLAOD FOLDER
# ========================================

# Define base paths for file storage
# Use absolute paths to ensure consistency regardless of working directory
BASE_DIR = '/home/smarthiringorg/SmartHire/Flask_Backend'  # Your application base directory
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
RESUME_DIR = os.path.join(UPLOAD_DIR, 'resumes')
COVER_LETTER_DIR = os.path.join(UPLOAD_DIR, 'cover_letters')

# Ensure directories exist
Path(UPLOAD_DIR).mkdir(exist_ok=True)
Path(RESUME_DIR).mkdir(exist_ok=True)
Path(COVER_LETTER_DIR).mkdir(exist_ok=True)

# Make sure directories are writable
os.chmod(UPLOAD_DIR, 0o755)
os.chmod(RESUME_DIR, 0o755)
os.chmod(COVER_LETTER_DIR, 0o755)

# Configure logging for file operations
logging.getLogger('file_operations').setLevel(logging.INFO)

# Helper function to save uploaded files
def save_uploaded_file(file, directory, applicant_id, job_id, file_type):
    """
    Save an uploaded file to the specified directory with standardized naming
    
    Args:
        file: The uploaded file object
        directory: Directory to save the file to
        applicant_id: ID of the applicant
        job_id: ID of the job
        file_type: Type of file (resume or cover_letter)
        
    Returns:
        Path to the saved file
    """
    if not file:
        return None
        
    # Create a standardized filename
    original_filename = file.filename
    extension = os.path.splitext(original_filename)[1].lower()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    new_filename = f"{applicant_id}_{job_id}_{file_type}_{timestamp}{extension}"
    
    # Full path for saving
    file_path = os.path.join(directory, new_filename)
    
    # Save the file
    file.save(file_path)
    logging.getLogger('file_operations').info(f"Saved {file_type} to {file_path}")
    
    return file_path


# =============================================================================
# AUTHENTICATION FUNCTIONS
# =============================================================================
def hash_password(password: str, salt: bytes) -> str:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode())).decode()


def verify_password(stored_password: str, password: str, salt: bytes) -> bool:
    hashed_attempt = hash_password(password, salt)
    app.logger.debug(f"Stored hashed password: {stored_password}")
    app.logger.debug(f"Hashed password attempt: {hashed_attempt}")
    return stored_password == hashed_attempt


# =============================================================================
# AUTHENTICATION MIDDLEWARE
# =============================================================================
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)

    decorated_function.__name__ = f.__name__
    return decorated_function


def admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session or not session.get('is_admin', False):
            return jsonify({"error": "Admin privileges required"}), 403
        return f(*args, **kwargs)

    decorated_function.__name__ = f.__name__
    return decorated_function


# =============================================================================
# AUTHENTICATION ROUTES
# =============================================================================
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        error = None
        if not username or len(username) < 3 or len(username) > 30:
            error = "Username must be between 3 and 30 characters."
        elif not email or not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            error = "Please enter a valid email address."
        elif not password or len(password) < 8:
            error = "Password must be at least 8 characters."

        if error:
            return jsonify({"error": error}), 400

        # Process valid form data
        salt = os.urandom(16)
        hashed_password = hash_password(password, salt)

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists
        cursor.execute("SELECT id FROM admin_users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Email already registered"}), 400

        # Insert new admin user
        cursor.execute(
            "INSERT INTO admin_users (email, password_hash, salt, created_at) VALUES (%s, %s, %s, %s)",
            (email, hashed_password, base64.b64encode(salt).decode(), datetime.now())
        )
        conn.commit()

        # Get the new user's ID
        new_user_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully", "id": new_user_id}), 201

    except Exception as e:
        app.logger.error(f"Error in signup: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Query for admin users
        cursor.execute(
            "SELECT id, email, password_hash, salt FROM admin_users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            return jsonify({"error": "Invalid login credentials"}), 401

        try:
            salt = base64.b64decode(user["salt"])
        except Exception as e:
            cursor.close()
            conn.close()
            app.logger.error(f"Error decoding salt: {str(e)}")
            return jsonify({"error": "Authentication error"}), 500

        if verify_password(user['password_hash'], password, salt):
            # Make the session permanent
            session.permanent = True

            # Set session data
            session['admin_id'] = user['id']
            session['email'] = user['email']
            session['is_admin'] = True

            cursor.close()
            conn.close()

            return jsonify({
                "id": user['id'],
                "email": user['email'],
                "is_admin": True
            })
        else:
            cursor.close()
            conn.close()
            return jsonify({"error": "Invalid login credentials"}), 401

    except Exception as e:
        app.logger.error(f"Error in login: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/logout', methods=['GET', 'POST'])
def logout():
    # Clear all session data
    session.clear()
    return jsonify({"message": "Logged out successfully"})


@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    app.logger.debug(f"Session content: {dict(session)}")
    if 'admin_id' in session:
        return jsonify({
            "authenticated": True,
            "id": session['admin_id'],
            "email": session.get('email'),
            "is_admin": session.get('is_admin', False)
        })
    else:
        return jsonify({"authenticated": False}), 401


# =============================================================================
# DASHBOARD API ROUTES
# =============================================================================
@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def get_dashboard_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get total jobs count
        cursor.execute("SELECT COUNT(*) as count FROM jobs")
        total_jobs = cursor.fetchone()['count']

        # Get total applicants count
        cursor.execute("SELECT COUNT(*) as count FROM applicants")
        total_applicants = cursor.fetchone()['count']

        # Get total assessments count
        cursor.execute("SELECT COUNT(*) as count FROM assessments")
        total_assessments = cursor.fetchone()['count']

        # Get applications by status
        cursor.execute("""
            SELECT status, COUNT(*) as count 
            FROM applicants 
            GROUP BY status
        """)
        status_counts = {
            "Applied": 0,
            "Shortlisted": 0,
            "Interview": 0,
            "Rejected": 0
        }
        for row in cursor.fetchall():
            status_counts[row['status']] = row['count']

        # Get recent jobs
        cursor.execute("""
            SELECT id, job_name, company_name, created_at
            FROM jobs
            ORDER BY created_at DESC
            LIMIT 5
        """)
        recent_jobs = cursor.fetchall()

        # Get recent applicants
        cursor.execute("""
            SELECT id, full_name, institution, status, created_at
            FROM applicants
            ORDER BY created_at DESC
            LIMIT 5
        """)
        recent_applicants = cursor.fetchall()

        # Get top jobs by applicants
        cursor.execute("""
            SELECT id, job_name, company_name, applicants_count
            FROM jobs
            ORDER BY applicants_count DESC
            LIMIT 5
        """)
        top_jobs = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "totalJobs": total_jobs,
            "totalApplicants": total_applicants,
            "totalAssessments": total_assessments,
            "applicationsByStatus": status_counts,
            "recentJobs": recent_jobs,
            "recentApplicants": recent_applicants,
            "topJobs": top_jobs
        })

    except Exception as e:
        app.logger.error(f"Error getting dashboard data: {str(e)}")
        return jsonify({"error": str(e)}), 500


# =============================================================================
# JOBS API ROUTES
# =============================================================================
@app.route('/api/jobs', methods=['GET'])
@admin_required
def get_jobs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM jobs
            ORDER BY created_at DESC
        """)

        jobs = cursor.fetchall()

        # Format datetime objects to string
        for job in jobs:
            if 'created_at' in job and job['created_at']:
                job['created_at'] = job['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(jobs)

    except Exception as e:
        app.logger.error(f"Error getting jobs: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/jobs/<int:job_id>', methods=['GET'])
@admin_required
def get_job(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get job details
        cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
        job = cursor.fetchone()

        if not job:
            cursor.close()
            conn.close()
            return jsonify({"error": "Job not found"}), 404

        # Format datetime
        if 'created_at' in job and job['created_at']:
            job['created_at'] = job['created_at'].isoformat()

        # Get responsibilities
        cursor.execute("SELECT * FROM responsibilities WHERE job_id = %s", (job_id,))
        job['responsibilities'] = cursor.fetchall()

        # Get qualifications
        cursor.execute("SELECT * FROM qualifications WHERE job_id = %s", (job_id,))
        job['qualifications'] = cursor.fetchall()

        # Get offers
        cursor.execute("SELECT * FROM offers WHERE job_id = %s", (job_id,))
        job['offers'] = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(job)

    except Exception as e:
        app.logger.error(f"Error getting job: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/jobs', methods=['POST'])
@admin_required
def create_job():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('job_name'):
            return jsonify({"error": "Job name is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert job
        cursor.execute("""
            INSERT INTO jobs (
                job_name, company_name, salary_range, type, remote_type, 
                location, description, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('job_name'),
            data.get('company_name', ''),
            data.get('salary_range', ''),
            data.get('type', 'Full-time'),
            data.get('remote_type', 'Onsite'),
            data.get('location', ''),
            data.get('description', ''),
            datetime.now()
        ))

        job_id = cursor.lastrowid

        # Insert responsibilities
        responsibilities = data.get('responsibilities', [])
        if responsibilities:
            responsibility_values = [(job_id, resp) for resp in responsibilities if resp]
            if responsibility_values:
                cursor.executemany(
                    "INSERT INTO responsibilities (job_id, responsibility_text) VALUES (%s, %s)",
                    responsibility_values
                )

        # Insert qualifications
        qualifications = data.get('qualifications', [])
        if qualifications:
            qualification_values = [(job_id, qual) for qual in qualifications if qual]
            if qualification_values:
                cursor.executemany(
                    "INSERT INTO qualifications (job_id, qualification_text) VALUES (%s, %s)",
                    qualification_values
                )

        # Insert offers
        offers = data.get('offers', [])
        if offers:
            offer_values = [(job_id, offer) for offer in offers if offer]
            if offer_values:
                cursor.executemany(
                    "INSERT INTO offers (job_id, offer_text) VALUES (%s, %s)",
                    offer_values
                )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"id": job_id, "message": "Job created successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error creating job: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
@admin_required
def update_job(job_id):
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('job_name'):
            return jsonify({"error": "Job name is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Update job
        cursor.execute("""
            UPDATE jobs SET
                job_name = %s, 
                company_name = %s, 
                salary_range = %s, 
                type = %s, 
                remote_type = %s, 
                location = %s, 
                description = %s
            WHERE id = %s
        """, (
            data.get('job_name'),
            data.get('company_name', ''),
            data.get('salary_range', ''),
            data.get('type', 'Full-time'),
            data.get('remote_type', 'Onsite'),
            data.get('location', ''),
            data.get('description', ''),
            job_id
        ))

        # Delete existing relationships
        cursor.execute("DELETE FROM responsibilities WHERE job_id = %s", (job_id,))
        cursor.execute("DELETE FROM qualifications WHERE job_id = %s", (job_id,))
        cursor.execute("DELETE FROM offers WHERE job_id = %s", (job_id,))

        # Insert responsibilities
        responsibilities = data.get('responsibilities', [])
        if responsibilities:
            responsibility_values = [(job_id, resp) for resp in responsibilities if resp]
            if responsibility_values:
                cursor.executemany(
                    "INSERT INTO responsibilities (job_id, responsibility_text) VALUES (%s, %s)",
                    responsibility_values
                )

        # Insert qualifications
        qualifications = data.get('qualifications', [])
        if qualifications:
            qualification_values = [(job_id, qual) for qual in qualifications if qual]
            if qualification_values:
                cursor.executemany(
                    "INSERT INTO qualifications (job_id, qualification_text) VALUES (%s, %s)",
                    qualification_values
                )

        # Insert offers
        offers = data.get('offers', [])
        if offers:
            offer_values = [(job_id, offer) for offer in offers if offer]
            if offer_values:
                cursor.executemany(
                    "INSERT INTO offers (job_id, offer_text) VALUES (%s, %s)",
                    offer_values
                )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Job updated successfully"})

    except Exception as e:
        app.logger.error(f"Error updating job: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
@admin_required
def delete_job(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # The foreign key constraints with ON DELETE CASCADE will handle related records
        cursor.execute("DELETE FROM jobs WHERE id = %s", (job_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Job deleted successfully"})

    except Exception as e:
        app.logger.error(f"Error deleting job: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/<int:job_id>/applicants', methods=['GET'])
@admin_required
def get_job_applicants(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fixed query - added the missing job_id parameter
        cursor.execute("""
            SELECT a.* FROM applicants a
            JOIN job_applicants ja ON a.id = ja.applicant_id
            WHERE ja.job_id = %s
            ORDER BY a.created_at DESC
        """, (job_id,))  # Added the job_id parameter here

        applicants = cursor.fetchall()

        # Format datetime objects
        for applicant in applicants:
            if 'created_at' in applicant and applicant['created_at']:
                applicant['created_at'] = applicant['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(applicants)

    except Exception as e:
        app.logger.error(f"Error getting job applicants: {str(e)}")
        return jsonify({"error": str(e)}), 500


# =============================================================================
# APPLICANTS API ROUTES
# =============================================================================
@app.route('/api/applicants', methods=['GET'])
@admin_required
def get_applicants():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM applicants
            ORDER BY created_at DESC
        """)

        applicants = cursor.fetchall()

        # Format datetime objects
        for applicant in applicants:
            if 'created_at' in applicant and applicant['created_at']:
                applicant['created_at'] = applicant['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(applicants)

    except Exception as e:
        app.logger.error(f"Error getting applicants: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/applicants/<int:applicant_id>', methods=['GET'])
@admin_required
def get_applicant(applicant_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get applicant details
        cursor.execute("SELECT * FROM applicants WHERE id = %s", (applicant_id,))
        applicant = cursor.fetchone()

        if not applicant:
            cursor.close()
            conn.close()
            return jsonify({"error": "Applicant not found"}), 404

        # Format datetime
        if 'created_at' in applicant and applicant['created_at']:
            applicant['created_at'] = applicant['created_at'].isoformat()

        # Get social links
        cursor.execute("SELECT * FROM social_links WHERE applicant_id = %s", (applicant_id,))
        applicant['social_links'] = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(applicant)

    except Exception as e:
        app.logger.error(f"Error getting applicant: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/applicants/<int:applicant_id>/status', methods=['PUT'])
@admin_required
def update_applicant_status(applicant_id):
    try:
        data = request.get_json()
        status = data.get('status')

        # Validate status
        valid_statuses = ['Applied', 'Shortlisted', 'Interview', 'Rejected']
        if not status or status not in valid_statuses:
            return jsonify({"error": "Invalid status"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE applicants SET status = %s WHERE id = %s", (status, applicant_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Applicant status updated successfully"})

    except Exception as e:
        app.logger.error(f"Error updating applicant status: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/applicants/<int:applicant_id>', methods=['DELETE'])
@admin_required
def delete_applicant(applicant_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # The foreign key constraints with ON DELETE CASCADE will handle related records
        cursor.execute("DELETE FROM applicants WHERE id = %s", (applicant_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Applicant deleted successfully"})

    except Exception as e:
        app.logger.error(f"Error deleting applicant: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/applicants/<int:applicant_id>/assessment-answers', methods=['GET'])
@admin_required
def get_applicant_assessment_answers(applicant_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT aa.*, a.question_text, a.question_type, a.options, a.correct_answer 
            FROM assessment_answers aa
            JOIN assessments a ON aa.assessment_id = a.id
            WHERE aa.applicant_id = %s
        """, (applicant_id,))

        answers = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(answers)

    except Exception as e:
        app.logger.error(f"Error getting applicant assessment answers: {str(e)}")
        return jsonify({"error": str(e)}), 500


# =============================================================================
# ASSESSMENTS API ROUTES
# =============================================================================
@app.route('/api/assessments', methods=['GET'])
@admin_required
def get_assessments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM assessments")

        assessments = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(assessments)

    except Exception as e:
        app.logger.error(f"Error getting assessments: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/assessments/<int:assessment_id>', methods=['GET'])
@admin_required
def get_assessment(assessment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM assessments WHERE id = %s", (assessment_id,))

        assessment = cursor.fetchone()

        if not assessment:
            cursor.close()
            conn.close()
            return jsonify({"error": "Assessment not found"}), 404

        cursor.close()
        conn.close()

        return jsonify(assessment)

    except Exception as e:
        app.logger.error(f"Error getting assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/assessments', methods=['POST'])
@admin_required
def create_assessment():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('question_text'):
            return jsonify({"error": "Question text is required"}), 400

        # Get data fields
        question_text = data.get('question_text')
        question_type = data.get('question_type', 'multiple-choice')
        options = data.get('options')
        correct_answer = data.get('correct_answer')

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO assessments (question_text, question_type, options, correct_answer)
            VALUES (%s, %s, %s, %s)
        """, (question_text, question_type, options, correct_answer))

        assessment_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"id": assessment_id, "message": "Assessment created successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error creating assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/assessments/<int:assessment_id>', methods=['PUT'])
@admin_required
def update_assessment(assessment_id):
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('question_text'):
            return jsonify({"error": "Question text is required"}), 400

        # Get data fields
        question_text = data.get('question_text')
        question_type = data.get('question_type', 'multiple-choice')
        options = data.get('options')
        correct_answer = data.get('correct_answer')

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE assessments 
            SET question_text = %s, question_type = %s, options = %s, correct_answer = %s
            WHERE id = %s
        """, (question_text, question_type, options, correct_answer, assessment_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Assessment updated successfully"})

    except Exception as e:
        app.logger.error(f"Error updating assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/assessments/<int:assessment_id>', methods=['DELETE'])
@admin_required
def delete_assessment(assessment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # The foreign key constraints with ON DELETE CASCADE will handle related records
        cursor.execute("DELETE FROM assessments WHERE id = %s", (assessment_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Assessment deleted successfully"})

    except Exception as e:
        app.logger.error(f"Error deleting assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/assessments/<int:assessment_id>/answers', methods=['GET'])
@admin_required
def get_assessment_answers(assessment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT aa.*, a.full_name as applicant_name
            FROM assessment_answers aa
            JOIN applicants a ON aa.applicant_id = a.id
            WHERE aa.assessment_id = %s
        """, (assessment_id,))

        answers = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(answers)

    except Exception as e:
        app.logger.error(f"Error getting assessment answers: {str(e)}")
        return jsonify({"error": str(e)}), 500


# =============================================================================
# ADMIN USERS API ROUTES
# =============================================================================
@app.route('/api/admin-users', methods=['GET'])
@admin_required
def get_admin_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, email, created_at
            FROM admin_users
            ORDER BY created_at DESC
        """)

        admins = cursor.fetchall()

        # Format datetime objects
        for admin in admins:
            if 'created_at' in admin and admin['created_at']:
                admin['created_at'] = admin['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(admins)

    except Exception as e:
        app.logger.error(f"Error getting admin users: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin-users/<int:user_id>', methods=['GET'])
@admin_required
def get_admin_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, email, created_at
            FROM admin_users
            WHERE id = %s
        """, (user_id,))

        admin = cursor.fetchone()

        if not admin:
            cursor.close()
            conn.close()
            return jsonify({"error": "Admin user not found"}), 404

        # Format datetime
        if 'created_at' in admin and admin['created_at']:
            admin['created_at'] = admin['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify(admin)

    except Exception as e:
        app.logger.error(f"Error getting admin user: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin-users', methods=['POST'])
@admin_required
def create_admin_user():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
        if not data.get('password'):
            return jsonify({"error": "Password is required"}), 400

        email = data.get('email')
        password = data.get('password')

        # Check if email already exists
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM admin_users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Email already registered"}), 400

        # Create new admin user
        salt = os.urandom(16)
        hashed_password = hash_password(password, salt)

        cursor.execute("""
            INSERT INTO admin_users (email, password_hash, salt, created_at)
            VALUES (%s, %s, %s, %s)
        """, (
            email,
            hashed_password,
            base64.b64encode(salt).decode(),
            datetime.now()
        ))

        admin_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"id": admin_id, "message": "Admin user created successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error creating admin user: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin-users/<int:user_id>', methods=['PUT'])
@admin_required
def update_admin_user(user_id):
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400

        email = data.get('email')
        password = data.get('password')  # Optional

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists for another user
        cursor.execute("SELECT id FROM admin_users WHERE email = %s AND id != %s", (email, user_id))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Email already registered to another user"}), 400

        # Update admin user
        if password:
            # If password is provided, update it too
            salt = os.urandom(16)
            hashed_password = hash_password(password, salt)

            cursor.execute("""
                UPDATE admin_users
                SET email = %s, password_hash = %s, salt = %s
                WHERE id = %s
            """, (
                email,
                hashed_password,
                base64.b64encode(salt).decode(),
                user_id
            ))
        else:
            # Just update email
            cursor.execute("""
                UPDATE admin_users
                SET email = %s
                WHERE id = %s
            """, (email, user_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Admin user updated successfully"})

    except Exception as e:
        app.logger.error(f"Error updating admin user: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin-users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_admin_user(user_id):
    try:
        # Make sure we're not deleting the current user
        if user_id == session.get('admin_id'):
            return jsonify({"error": "Cannot delete your own account"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Delete the admin user
        cursor.execute("DELETE FROM admin_users WHERE id = %s", (user_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Admin user deleted successfully"})

    except Exception as e:
        app.logger.error(f"Error deleting admin user: {str(e)}")
        return jsonify({"error": str(e)}), 500


# =============================================================================
# PAGE ROUTES
# =============================================================================

# Route to serve the index.html
@app.route('/')
def index():
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')


# Catch-all route to handle React Router paths
@app.route('/<path:path>')
def catch_all(path):
    # Check if the path is for a static asset
    if path.startswith('assets/') or path.startswith('static/'):
        return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', path)

    # Otherwise, serve the index.html for React Router to handle
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')


# =============================================================================
# PUBLIC API ROUTES FOR JOBS
# =============================================================================
@app.route('/api/public/jobs', methods=['GET'])
def get_public_jobs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM jobs
            ORDER BY created_at DESC
        """)

        jobs = cursor.fetchall()

        # Format datetime objects to string
        for job in jobs:
            if 'created_at' in job and job['created_at']:
                job['created_at'] = job['created_at'].isoformat()

            # Get the applicants count
            job['applicants_count'] = job.get('applicants_count', 0)

        cursor.close()
        conn.close()

        return jsonify(jobs)

    except Exception as e:
        app.logger.error(f"Error getting public jobs: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/public/jobs/<int:job_id>', methods=['GET'])
def get_public_job(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get job details
        cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
        job = cursor.fetchone()

        if not job:
            cursor.close()
            conn.close()
            return jsonify({"error": "Job not found"}), 404

        # Format datetime
        if 'created_at' in job and job['created_at']:
            job['created_at'] = job['created_at'].isoformat()

        # Get responsibilities
        cursor.execute("SELECT * FROM responsibilities WHERE job_id = %s", (job_id,))
        job['responsibilities'] = cursor.fetchall()

        # Get qualifications
        cursor.execute("SELECT * FROM qualifications WHERE job_id = %s", (job_id,))
        job['qualifications'] = cursor.fetchall()

        # Get offers
        cursor.execute("SELECT * FROM offers WHERE job_id = %s", (job_id,))
        job['offers'] = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(job)

    except Exception as e:
        app.logger.error(f"Error getting public job: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Route for applying to a job
@app.route('/api/public/jobs/<int:job_id>/apply', methods=['POST'])
def apply_for_job(job_id):
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('full_name'):
            return jsonify({"error": "Full name is required"}), 400
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400

        # Check if job exists
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM jobs WHERE id = %s", (job_id,))
        job = cursor.fetchone()

        if not job:
            cursor.close()
            conn.close()
            return jsonify({"error": "Job not found"}), 404

        # Create or get applicant
        cursor.execute(
            "SELECT id FROM applicants WHERE email = %s",
            (data.get('email'),)
        )
        existing_applicant = cursor.fetchone()

        if existing_applicant:
            applicant_id = existing_applicant['id']

            # Update applicant information
            cursor.execute("""
                UPDATE applicants SET
                    full_name = %s,
                    phone = %s,
                    institution = %s,
                    qualifications_summary = %s,
                    experience = %s,
                    about = %s,
                    location = %s,
                    keywords = %s,
                    tools = %s,
                    testimonials = %s
                WHERE id = %s
            """, (
                data.get('full_name'),
                data.get('phone', ''),
                data.get('institution', ''),
                data.get('qualifications_summary', ''),
                data.get('experience', ''),
                data.get('about', ''),
                data.get('location', ''),
                data.get('keywords', ''),
                data.get('tools', ''),
                data.get('testimonials', ''),
                applicant_id
            ))
        else:
            # Create new applicant
            cursor.execute("""
                INSERT INTO applicants (
                    full_name, email, phone, institution, 
                    qualifications_summary, experience, about, location,
                    keywords, tools, testimonials, status, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data.get('full_name'),
                data.get('email'),
                data.get('phone', ''),
                data.get('institution', ''),
                data.get('qualifications_summary', ''),
                data.get('experience', ''),
                data.get('about', ''),
                data.get('location', ''),
                data.get('keywords', ''),
                data.get('tools', ''),
                data.get('testimonials', ''),
                'Applied',  # Default status
                datetime.now()
            ))

            applicant_id = cursor.lastrowid

        # Check if already applied to this job
        cursor.execute(
            "SELECT id FROM job_applicants WHERE job_id = %s AND applicant_id = %s",
            (job_id, applicant_id)
        )

        if cursor.fetchone():
            # Already applied, just update the application date
            cursor.execute(
                "UPDATE job_applicants SET applied_at = %s WHERE job_id = %s AND applicant_id = %s",
                (datetime.now(), job_id, applicant_id)
            )
        else:
            # Create new application
            cursor.execute(
                "INSERT INTO job_applicants (job_id, applicant_id, applied_at) VALUES (%s, %s, %s)",
                (job_id, applicant_id, datetime.now())
            )

            # Increment the applicants_count in jobs table
            cursor.execute(
                "UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = %s",
                (job_id,)
            )

        # Save social links if provided
        if data.get('social_links'):
            # First clear existing links
            cursor.execute("DELETE FROM social_links WHERE applicant_id = %s", (applicant_id,))

            # Insert new links
            for link in data.get('social_links'):
                if link.get('platform') and link.get('url'):
                    cursor.execute(
                        "INSERT INTO social_links (applicant_id, platform, url) VALUES (%s, %s, %s)",
                        (applicant_id, link['platform'], link['url'])
                    )

        # Process assessment answers if provided
        if data.get('assessment_answers'):
            for answer in data.get('assessment_answers'):
                if answer.get('assessment_id') and answer.get('answer'):
                    # Check if already answered
                    cursor.execute(
                        "SELECT id FROM assessment_answers WHERE assessment_id = %s AND applicant_id = %s",
                        (answer['assessment_id'], applicant_id)
                    )

                    existing_answer = cursor.fetchone()

                    if existing_answer:
                        # Update existing answer
                        cursor.execute(
                            "UPDATE assessment_answers SET answer = %s, submitted_at = %s WHERE id = %s",
                            (answer['answer'], datetime.now(), existing_answer['id'])
                        )
                    else:
                        # Create new answer
                        cursor.execute(
                            "INSERT INTO assessment_answers (assessment_id, applicant_id, answer, submitted_at) VALUES (%s, %s, %s, %s)",
                            (answer['assessment_id'], applicant_id, answer['answer'], datetime.now())
                        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Application submitted successfully",
            "applicant_id": applicant_id
        }), 201

    except Exception as e:
        app.logger.error(f"Error applying for job: {str(e)}")
        return jsonify({"error": str(e)}), 500



"""
This code adds the missing route for CV screening functionality.
Add this to your Flask application to handle the resume screening requests 
from the React frontend.
"""
@app.route('/api/public/jobs/<int:job_id>/apply-with-screening', methods=['POST'])
def apply_with_screening(job_id):
    try:
        # Get form data
        full_name = request.form.get('full_name')
        first_name = request.form.get('firstName')
        last_name = request.form.get('lastName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        gender = request.form.get('gender', '')
        
        # If full_name wasn't provided but first and last name were
        if not full_name and first_name and last_name:
            full_name = f"{first_name} {last_name}"
        
        # Validate required fields
        if not full_name:
            return jsonify({"error": "Full name is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Check if job exists
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
        job = cursor.fetchone()
        
        if not job:
            cursor.close()
            conn.close()
            return jsonify({"error": "Job not found"}), 404
        
        # Handle CV/resume file upload
        resume_file = request.files.get('resume')
        cover_letter_file = request.files.get('coverLetter')
        
        if not resume_file:
            return jsonify({"error": "Resume/CV is required"}), 400
        
        # Create or get applicant
        cursor.execute(
            "SELECT id FROM applicants WHERE email = %s",
            (email,)
        )
        existing_applicant = cursor.fetchone()
        
        if existing_applicant:
            applicant_id = existing_applicant['id']
            
            # Update applicant information
            cursor.execute("""
                UPDATE applicants SET
                    full_name = %s,
                    phone = %s,
                    gender = %s,
                    updated_at = %s
                WHERE id = %s
            """, (
                full_name,
                phone,
                gender,
                datetime.now(),
                applicant_id
            ))
        else:
            # Create new applicant
            cursor.execute("""
                INSERT INTO applicants (
                    full_name, email, phone, gender, status, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                full_name,
                email,
                phone,
                gender,
                'Applied',  # Default status
                datetime.now()
            ))
            
            applicant_id = cursor.lastrowid
        
        # Save resume and cover letter to designated directories
        resume_path = save_uploaded_file(
            resume_file, 
            RESUME_DIR, 
            applicant_id, 
            job_id, 
            'resume'
        )
        
        cover_letter_path = None
        if cover_letter_file:
            cover_letter_path = save_uploaded_file(
                cover_letter_file, 
                COVER_LETTER_DIR, 
                applicant_id, 
                job_id, 
                'cover_letter'
            )
        
        # Store file paths in database
        try:
            # Check if we already have a files record for this applicant
            cursor.execute(
                "SELECT id FROM applicant_files WHERE applicant_id = %s AND job_id = %s",
                (applicant_id, job_id)
            )
            existing_files = cursor.fetchone()
            
            if existing_files:
                # Update existing record
                cursor.execute("""
                    UPDATE applicant_files 
                    SET resume_path = %s, cover_letter_path = %s, updated_at = %s
                    WHERE applicant_id = %s AND job_id = %s
                """, (
                    resume_path,
                    cover_letter_path,
                    datetime.now(),
                    applicant_id,
                    job_id
                ))
            else:
                # Insert new record
                cursor.execute("""
                    INSERT INTO applicant_files 
                    (applicant_id, job_id, resume_path, cover_letter_path, created_at)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    applicant_id,
                    job_id,
                    resume_path,
                    cover_letter_path,
                    datetime.now()
                ))
        except Exception as e:
            app.logger.error(f"Error storing file paths: {str(e)}")
            # Continue even if this fails
        
        # Process CV/resume for skill matching
        try:
            # Analyze the resume using analyze_cs_resume function
            analysis_result = analyze_cs_resume(
                resume_path, 
                job_id=job_id,
                applicant_id=applicant_id,
                upload_folder=RESUME_DIR  # Use the same folder for consistency
            )
            
            logger.info(f"Analysis result type: {type(analysis_result)}")
            logger.info(f"Analysis result keys: {analysis_result.keys() if isinstance(analysis_result, dict) else 'Not a dict'}")

            # Determine if the applicant meets the requirements
            skills_match = analysis_result.get('skills_analysis', {})
            match_percentage = skills_match.get('match_percentage', 0)
            
            # Decide if applicant passes the screening (adjust threshold as needed)
            success = match_percentage >= 60  # 60% match required to pass
            
            # Update applicant status based on screening
            cursor.execute(
                "UPDATE applicants SET status = %s WHERE id = %s",
                ('Shortlisted' if success else 'Applied', applicant_id)
            )
            
            # Associate applicant with job
            cursor.execute(
                "SELECT id FROM job_applicants WHERE job_id = %s AND applicant_id = %s",
                (job_id, applicant_id)
            )
            
            if cursor.fetchone():
                # Already applied, just update the application date
                cursor.execute(
                    "UPDATE job_applicants SET applied_at = %s WHERE job_id = %s AND applicant_id = %s",
                    (datetime.now(), job_id, applicant_id)
                )
            else:
                # Create new application
                cursor.execute(
                    "INSERT INTO job_applicants (job_id, applicant_id, applied_at) VALUES (%s, %s, %s)",
                    (job_id, applicant_id, datetime.now())
                )
                
                # Increment the applicants_count in jobs table
                cursor.execute(
                    "UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = %s",
                    (job_id,)
                )
            
            # If successful, create an assessment
            assessment_id = None
            if success or True:  # Always create assessment regardless of success
                # Get questions based on the matched skills
                matched_skills = skills_match.get('matched_skills', [])
                assessment_questions = get_assessment_questions(matched_skills, job_id)
                
                # Create an assessment session
                cursor.execute("""
                    INSERT INTO assessment_sessions (
                        applicant_id, job_id, created_at, status
                    ) VALUES (%s, %s, %s, %s)
                """, (
                    applicant_id,
                    job_id,
                    datetime.now(),
                    'pending'
                ))
                
                assessment_id = cursor.lastrowid
                
                # Store the questions for this assessment
                for question in assessment_questions:
                    cursor.execute("""
                        INSERT INTO assessment_questions (
                            session_id, question_text, question_type, options, correct_answer
                        ) VALUES (%s, %s, %s, %s, %s)
                    """, (
                        assessment_id,
                        question.get('question_text'),
                        question.get('question_type', 'multiple-choice'),
                        json.dumps(question.get('options', [])),
                        question.get('correct_answer', '')
                    ))
            
            conn.commit()
            
            # Prepare response with screening results
            response_data = {
                "success": True,  # Always return success to frontend
                "message": "Your skills match our requirements! Proceed to the technical assessment." if success else "Your resume has been received. Please proceed to the assessment.",
                "application_id": applicant_id,
                "assessment_id": assessment_id,
                "analysis": analysis_result
            }
            
            cursor.close()
            conn.close()
            
            return jsonify(response_data)
            
        except Exception as e:
            app.logger.error(f"Error analyzing resume: {str(e)}")
            conn.commit()  # Still commit any database changes made so far
            
            # Return a friendly success message despite the error
            return jsonify({
                "success": True,
                "message": "We've received your application! You'll proceed to assessment.",
                "error_details": f"We encountered an issue analyzing your resume, but your application was received.",
                "application_id": applicant_id,
                "proceed_to_assessment": True
            })
    
    except Exception as e:
        app.logger.error(f"Error in application with screening: {str(e)}")
        return jsonify({
            "success": True,  # Still show success to user
            "message": "Your application has been received",
            "error_details": "We encountered an issue processing your application, but it was received.",
            "proceed_to_assessment": True
        })

# Add these two routes to your Flask application

@app.route('/api/public/assessments/<int:assessment_id>', methods=['GET'])
def get_public_assessment(assessment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # First check if this is a session ID
        cursor.execute("""
            SELECT * FROM assessment_sessions 
            WHERE id = %s
        """, (assessment_id,))
        
        session = cursor.fetchone()
        
        if session:
            # Get questions for this assessment session
            cursor.execute("""
                SELECT id, question_text, question_type, options, correct_answer 
                FROM assessment_questions
                WHERE session_id = %s
            """, (assessment_id,))
            
            questions = cursor.fetchall()
            
            # Process options from JSON string to array
            for question in questions:
                if question['options'] and isinstance(question['options'], str):
                    try:
                        question['options'] = json.loads(question['options'])
                    except:
                        question['options'] = []
            
            cursor.close()
            conn.close()
            
            return jsonify({"questions": questions})
        else:
            # Try looking up in assessments table (for backward compatibility)
            cursor.execute("SELECT * FROM assessments WHERE id = %s", (assessment_id,))
            assessment = cursor.fetchone()
            
            if not assessment:
                cursor.close()
                conn.close()
                return jsonify({"error": "Assessment not found"}), 404
                
            # Convert to expected format
            questions = [{
                "id": assessment['id'],
                "question": assessment['question_text'],
                "type": assessment['question_type'],
                "options": json.loads(assessment['options']) if assessment['options'] and isinstance(assessment['options'], str) else []
            }]
            
            cursor.close()
            conn.close()
            
            return jsonify({"questions": questions})
            
    except Exception as e:
        app.logger.error(f"Error getting public assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/public/assessments/<int:assessment_id>/submit', methods=['POST'])
def submit_public_assessment(assessment_id):
    try:
        data = request.get_json()
        applicant_id = data.get('applicant_id')
        answers = data.get('answers', [])
        
        if not applicant_id:
            return jsonify({"error": "Applicant ID is required"}), 400
        
        if not answers:
            return jsonify({"error": "No answers provided"}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First determine if this is a session-based assessment
        cursor.execute("""
            SELECT id FROM assessment_sessions 
            WHERE id = %s
        """, (assessment_id,))
        
        session = cursor.fetchone()
        
        if session:
            # Update assessment session status
            cursor.execute("""
                UPDATE assessment_sessions 
                SET status = 'completed', completed_at = %s
                WHERE id = %s AND applicant_id = %s
            """, (datetime.now(), assessment_id, applicant_id))
            
            # Save each answer
            correct_count = 0
            total_questions = len(answers)
            
            for answer_data in answers:
                question_id = answer_data.get('question_id')
                answer = answer_data.get('answer')
                
                if not question_id or not answer:
                    continue
                    
                # Check if this is a correct answer
                cursor.execute("""
                    SELECT correct_answer, question_type 
                    FROM assessment_questions 
                    WHERE id = %s
                """, (question_id,))
                
                question = cursor.fetchone()
                
                is_correct = False
                if question:
                    if question[1] == 'multiple-choice':
                        is_correct = (question[0] == answer)
                    else:
                        # For text answers, mark as needing review
                        is_correct = None
                        
                # Save the answer
                cursor.execute("""
                    INSERT INTO assessment_answers 
                    (assessment_id, question_id, applicant_id, answer, is_correct, submitted_at) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    assessment_id, 
                    question_id, 
                    applicant_id, 
                    answer,
                    is_correct,
                    datetime.now()
                ))
                
                if is_correct:
                    correct_count += 1
            
            # Calculate score if possible
            score = 0
            if total_questions > 0:
                score = (correct_count / total_questions) * 100
                
            # Update applicant status based on score (optional)
            if score >= 70:  # Example passing threshold
                cursor.execute(
                    "UPDATE applicants SET status = 'Shortlisted' WHERE id = %s",
                    (applicant_id,)
                )
        else:
            # Handle submission for older assessment format
            for answer_data in answers:
                question_id = answer_data.get('question_id')
                answer = answer_data.get('answer')
                
                if not question_id or not answer:
                    continue
                
                # Look up in assessments table
                cursor.execute("""
                    SELECT id, correct_answer 
                    FROM assessments 
                    WHERE id = %s
                """, (question_id,))
                
                question = cursor.fetchone()
                
                if question:
                    is_correct = (question[1] == answer)
                    
                    # Save the answer
                    cursor.execute("""
                        INSERT INTO assessment_answers 
                        (assessment_id, question_id, applicant_id, answer, is_correct, submitted_at) 
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        assessment_id, 
                        question_id, 
                        applicant_id, 
                        answer,
                        is_correct,
                        datetime.now()
                    ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Assessment submitted successfully",
            "applicant_id": applicant_id,
            "assessment_id": assessment_id
        })
        
    except Exception as e:
        app.logger.error(f"Error submitting assessment: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)