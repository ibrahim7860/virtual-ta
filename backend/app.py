import jsonpickle
import textwrap
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from IPython.display import Markdown
from flask import Flask, request
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
    response = model.generate_content(prompt, safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    })

    # Send the generated text back as a JSON response
    return jsonpickle.encode(to_markdown(response.text))

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in a production environment
