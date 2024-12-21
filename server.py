from flask import Flask, send_from_directory
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    logger.debug('Serving index.html')
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    logger.debug(f'Serving file: {path}')
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))  # デフォルトポートを3000に変更
    logger.info(f'Starting server on port {port}')
    app.run(host='0.0.0.0', port=port, debug=True)