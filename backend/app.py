from flask import Flask, request, jsonify
# Load model directly
from transformers import AutoModel, AutoTokenizer
from flask_cors import CORS
import torch

app = Flask(__name__)
CORS(app)

# Check if CUDA is available and set the device accordingly
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

tokenizer = AutoTokenizer.from_pretrained("THUDM/codegeex2-6b", trust_remote_code=True)
model = AutoModel.from_pretrained("THUDM/codegeex2-6b", trust_remote_code=True).to(device)
model = model.eval()

@app.route('/generate', methods=['POST'])
def generate_text():
    # Get prompt from the request data; expect JSON with a 'prompt' field
    data = request.get_json()
    prompt = data.get('prompt', '')
    inputs = tokenizer.encode(prompt, return_tensors="pt").to(model.device)

    # Use your model to generate a response
    outputs = model.generate(inputs, max_length=256, top_k=1)
    generated_text = tokenizer.decode(outputs[0])

    # Send the generated text back as a JSON response
    return jsonify({'generated_text': generated_text})

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in a production environment
