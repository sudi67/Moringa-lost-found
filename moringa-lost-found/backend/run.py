from app import create_app
from flask_cors import CORS
import os

app = create_app()
CORS(app)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
