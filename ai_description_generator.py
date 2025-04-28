from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# loadi AI model lena
generator = pipeline(
    "text-generation", 
    model="distilgpt2",
    device=-1  # utilisation taa cpu
)

@app.route("/generate-description", methods=["POST"])
def generate_description():
    try:
        keywords = request.json.get("keywords", "").strip()
        
        if not keywords:
            return jsonify({"error": "Keywords cannot be empty"}), 400
        
        # structure taa prompt
        prompt = f"""Create a one-sentence fashion brand description with these details:
        - Style: {keywords}
        - Focus: Quality materials and unique designs
        - Tone: Professional and appealing
        - Avoid: Locations, dates, unrelated metaphors
        
        Description: A"""
        
        # ngeneriw text
        response = generator(
            prompt,
            max_new_tokens=40,  # badalt max_length puisque feha machekel
            num_return_sequences=1,
            temperature=0.65,    # hedhi randomness na9soha w nzidoha kima nhebou
            repetition_penalty=1.8,
            do_sample=True,
            top_k=40,
            top_p=0.9
        )
        
        # format taa l'output
        full_text = response[0]["generated_text"]
        description = "A" + full_text.split("Description: A")[-1]  # text yji baad lprompt
        description = description.split(".")[0] + "."  # awel phrase kemla
        description = description.replace("\n", " ").strip()  # na7iw lines zeydin
        
        return jsonify({"description": description})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)