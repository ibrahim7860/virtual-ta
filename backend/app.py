from flask import Flask, jsonify, request
from flask_cors import CORS
import textwrap
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

app = Flask(__name__)
CORS(app)

genai.configure(api_key="")
model = genai.GenerativeModel('gemini-pro')

@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt', '')

    # Use your model to generate a response
    response = model.generate_content(prompt, safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    })

    # Ensure response is plain text, not markdown or other format
    plain_text_response = textwrap.indent(response.text, '> ', predicate=lambda _: True).replace('•', '  *')

    # Send the generated plain text back as a JSON response
    return jsonify(text=plain_text_response)

if __name__ == '__main__':
    app.run(debug=True)
