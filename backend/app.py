import pathlib
import jsonpickle
import textwrap
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def to_markdown(text):
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

genai.configure(api_key="")
model = genai.GenerativeModel('gemini-pro')

@app.route('/generate', methods=['POST'])
def generate_text():
    # Get prompt from the request data; expect JSON with a 'prompt' field
    data = request.get_json()
    prompt = data.get('prompt', '')

    # Use your model to generate a response
    response = model.generate_content(prompt)

    # Send the generated text back as a JSON response
    return jsonpickle.encode(to_markdown(response.text))

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in a production environment
