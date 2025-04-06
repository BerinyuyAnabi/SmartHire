from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='dist/static', template_folder='dist')

# Route to serve the index.html
@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

# Route to serve assets (images, JS, etc.) from dist/assets
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('dist/assets', filename)

# Route to serve static files (images, CSS, etc.)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('dist/static', filename)

if __name__ == '__main__':
    app.run(debug=True)
