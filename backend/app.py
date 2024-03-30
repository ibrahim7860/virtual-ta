from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your model outside of your request handling function for efficiency
generator = pipeline('text-generation', model='EleutherAI/gpt-neo-125m')

@app.route('/generate', methods=['POST'])
def generate_text():
    # Get prompt from the request data; expect JSON with a 'prompt' field
    data = request.get_json()
    prompt = data.get('prompt', '')

    # Use your model to generate a response
    res = generator(prompt, max_length=50, do_sample=True, temperature=0.9)
    generated_text = res[0]['generated_text']

    # Send the generated text back as a JSON response
    return jsonify({'generated_text': generated_text})

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in a production environment
