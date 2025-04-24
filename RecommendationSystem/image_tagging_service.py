from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import ViTFeatureExtractor, ViTForImageClassification
from PIL import Image
import torch
import io  # For handling image bytes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load pre-trained model
model_name = "google/vit-base-patch16-224"
feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)
model = ViTForImageClassification.from_pretrained(model_name)

@app.route('/predict-category', methods=['POST'])
def predict_category():
    try:
        # Check if file exists and is an image
        if 'file' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        
        image = request.files['file']
        
        # Verify file is an image
        if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Invalid file type. Only images are allowed"}), 400
        
        # Read image directly from bytes to avoid PIL issues
        img_bytes = image.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        # Verify image opened successfully
        if img is None:
            return jsonify({"error": "Could not process image"}), 400
            
        # Preprocess image and predict
        inputs = feature_extractor(images=img, return_tensors="pt")
        with torch.no_grad():  # Disable gradient calculation for inference
            outputs = model(**inputs)
        
        # Get top 3 predictions
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        top3 = torch.topk(probs, 3)
        
        predictions = [
            {
                "label": model.config.id2label[idx.item()],
                "score": prob.item()
            } for prob, idx in zip(top3.values[0], top3.indices[0])
        ]
        
        # Return structured response
        return jsonify({
            "predictions": predictions,
            "primary_category": predictions[0]["label"]
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred during image processing"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)