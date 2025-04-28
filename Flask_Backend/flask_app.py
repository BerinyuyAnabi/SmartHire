# =============================================================================
# IMPORTS AND CONFIGURATION
# =============================================================================
from flask import Flask, request, jsonify, send_from_directory, session, redirect, url_for, render_template
# from flask_cors import CORS
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from dotenv import load_dotenv
import mysql.connector
import logging
import base64
import os
import re
import json
from datetime import datetime

app = Flask(__name__, static_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist/static', template_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist')
app.secret_key = os.urandom(24)
# CORS(app, supports_credentials=True)  # Enable CORS for API calls with credentials

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# =============================================================================
# DATABASE CONNECTION
# =============================================================================
# Load environment variables
load_dotenv()

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

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

def super_admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session or not session.get('is_super_admin', False):
            return jsonify({"error": "Super admin privileges required"}), 403
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
        confirm_password = data.get('confirmPassword')
        
        # Validate inputs
        error = None
        if not username or len(username) < 3 or len(username) > 30:
            error = "Username must be between 3 and 30 characters."
        elif not email or not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            error = "Please enter a valid email address."
        elif not password or len(password) < 8:
            error = "Password must be at least 8 characters."
        elif password != confirm_password:
            error = "Passwords do not match."
        
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
            "SELECT id, email, password_hash, salt, is_super_admin FROM admin_users WHERE email = %s", 
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
            # Set session data
            session['admin_id'] = user['id']
            session['email'] = user['email']
            session['is_admin'] = True
            session['is_super_admin'] = bool(user.get('is_super_admin', False))
            
            cursor.close()
            conn.close()
            
            return jsonify({
                "id": user['id'],
                "email": user['email'],
                "is_admin": True,
                "is_super_admin": bool(user.get('is_super_admin', False))
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
    if 'admin_id' in session:
        return jsonify({
            "authenticated": True,
            "id": session['admin_id'],
            "email": session.get('email'),
            "is_admin": session.get('is_admin', False),
            "is_super_admin": session.get('is_super_admin', False)
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
        
        # Assuming there's a job_applicants table that links jobs and applicants
        # Or modify this query according to your actual database schema
        cursor.execute("""
            SELECT a.* FROM applicants a
            JOIN job_applicants ja ON a.id = ja.applicant_id
            WHERE ja.job_id = %s
            ORDER BY a.created_at DESC
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
@super_admin_required
def get_admin_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, email, created_at, is_super_admin
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
@super_admin_required
def get_admin_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, email, created_at, is_super_admin
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
@super_admin_required
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
        is_super_admin = data.get('is_super_admin', False)
        
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
            INSERT INTO admin_users (email, password_hash, salt, is_super_admin, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            email, 
            hashed_password, 
            base64.b64encode(salt).decode(), 
            is_super_admin,
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
@super_admin_required
def update_admin_user(user_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
        
        email = data.get('email')
        password = data.get('password')  # Optional
        is_super_admin = data.get('is_super_admin', False)
        
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
                SET email = %s, password_hash = %s, salt = %s, is_super_admin = %s
                WHERE id = %s
            """, (
                email, 
                hashed_password, 
                base64.b64encode(salt).decode(), 
                is_super_admin,
                user_id
            ))
        else:
            # Just update email and super admin status
            cursor.execute("""
                UPDATE admin_users
                SET email = %s, is_super_admin = %s
                WHERE id = %s
            """, (email, is_super_admin, user_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Admin user updated successfully"})
        
    except Exception as e:
        app.logger.error(f"Error updating admin user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin-users/<int:user_id>', methods=['DELETE'])
@super_admin_required
def delete_admin_user(user_id):
    try:
        # Make sure we're not deleting the current user
        if user_id == session.get('admin_id'):
            return jsonify({"error": "Cannot delete your own account"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if this is the last super admin
        cursor.execute("SELECT COUNT(*) FROM admin_users WHERE is_super_admin = 1")
        super_admin_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT is_super_admin FROM admin_users WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        
        if not result:
            cursor.close()
            conn.close()
            return jsonify({"error": "Admin user not found"}), 404
            
        is_super_admin = result[0]
        
        # Prevent deletion of the last super admin
        if is_super_admin and super_admin_count <= 1:
            cursor.close()
            conn.close()
            return jsonify({"error": "Cannot delete the last super admin account"}), 400
        
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

if __name__ == '__main__':
    app.run(debug=True)