



from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist/static', template_folder='/home/smarthiringorg/SmartHire/Flask_Backend/dist')

# Route to serve the index.html
@app.route('/')
def index():
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

# Individual routes for React Router paths
@app.route('/job-posting')
def job_posting():
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

@app.route('/assessment')
def assessment():
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

# Route for dynamic applicant IDs
@app.route('/applicant/<path:id>')
def applicant_details(id):
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

# Route to serve assets (images, JS, etc.) from dist/assets
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist/assets', filename)

# Route to serve static files (images, CSS, etc.)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist/static', filename)

# Catch-all route for any other paths
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory('/home/smarthiringorg/SmartHire/Flask_Backend/dist', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)



from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import base64
import os
import mysql.connector
import logging


# Configure logging
logging.basicConfig(
    filename='form_debug.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',  # Ensure correct encoding
)

app = Flask(__name__)
app.secret_key = os.urandom(24)


# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_db_connection():
    return mysql.connector.connect(
        host='ashesihiring.mysql.pythonanywhere-services.com',
        user='ashesihiring',
        password='beginninghiring2002',
        database="ashesihiring$default"
    )


# Login and Sign up
# Password hashing using cryptography (PBKDF2)
def hash_password(password: str, salt: bytes) -> str:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode())).decode()


# Verify password with the stored hash
def verify_password(stored_password: str, password: str, salt: bytes) -> bool:
    # Log hashed attempts to ensure the verification works correctly
    hashed_attempt = hash_password(password, salt)
    app.logger.debug(f"Stored hashed password: {stored_password}")
    app.logger.debug(f"Hashed password attempt: {hashed_attempt}")
    return stored_password == hashed_attempt

@app.route('/faculty_signup', methods=['GET', 'POST'])
def faculty_signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Hash password
        salt = os.urandom(16)
        hashed_password = hash_password(password, salt)

        # Store faculty in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO faculty_users (username, email, password_hash, salt) VALUES (%s, %s, %s, %s)",
            (username, email, hashed_password, base64.b64encode(salt).decode())
        )
        conn.commit()
        conn.close()

        return redirect(url_for('faculty_login'))

    return render_template('faculty_signup.html')

@app.route('/faculty-login', methods=['GET', 'POST'])
def faculty_login():
    faculty_debug = None

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            cursor.execute("SELECT id, username, password_hash, salt FROM faculty_users WHERE email = %s", (email,))
            faculty = cursor.fetchone()

            if faculty:
                salt_encoded = faculty["salt"]

                # Decode the salt using standard Base64
                try:
                    salt = base64.b64decode(salt_encoded)
                except Exception:
                    return jsonify({
                        "error": "Invalid Base64 salt stored in database.",
                        "faculty": faculty
                    })

                # Debugging info
                faculty_debug = {
                    "id": faculty["id"],
                    "username": faculty["username"],
                    "stored_password": faculty["password_hash"],
                    "decoded_salt": salt_encoded,
                    "rehashed_password": hash_password(password, salt)
                }

                if verify_password(faculty['password_hash'], password, salt):
                    session['faculty_id'] = faculty['id']
                    session['faculty_name'] = faculty['username']
                    return redirect(url_for('faculty_dashboard'))
                else:
                    return render_template('faculty_login.html', login_error="Invalid login credentials",
                                           faculty_debug=faculty_debug)

            else:
                return render_template('faculty_login.html', login_error="Invalid login credentials")

        except Exception as e:
            return jsonify({"error": str(e)})

        finally:
            cursor.close()
            conn.close()

    return render_template('faculty_login.html')

#---------END OF PAGE ROUTES

@app.route('/logout')
def logout():
    # Clear the session data
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('role', None)
    session.pop('logged_in', None)

    # Redirect to the login page or homepage
    return redirect(url_for('login'))
# End of login and sign up
