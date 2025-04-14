
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
