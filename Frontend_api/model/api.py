from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
import tempfile
import io
import matplotlib.pyplot as plt
from mall_segmentation import MallCustomerSegmentation
import base64
from werkzeug.utils import secure_filename



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Global variables
current_model = None
current_data_file = None

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Mall Customer Segmentation API!"})


@app.route('/api/upload', methods=['POST'])
def upload_data():
    global current_data_file
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('data', filename)
        file.save(file_path)
        current_data_file = file_path
        
        # Validate the file
        try:
            df = pd.read_csv(file_path)
            required_columns = ['Annual Income (k$)', 'Spending Score (1-100)']
            
            # Check if the required columns exist or if there are columns with similar names
            income_col = next((col for col in df.columns if 'income' in col.lower()), None)
            spending_col = next((col for col in df.columns if 'spend' in col.lower()), None)
            
            if (not all(col in df.columns for col in required_columns) and 
                (income_col is None or spending_col is None)):
                return jsonify({
                    "warning": "File is missing recommended columns. Expected 'Annual Income (k$)' and 'Spending Score (1-100)'.",
                    "columns": df.columns.tolist(),
                    "success": True
                }), 200
                
            return jsonify({
                "success": True,
                "message": "File uploaded successfully",
                "rows": len(df),
                "columns": df.columns.tolist()
            })
            
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 400
            
    return jsonify({"error": "Unknown error"}), 400

@app.route('/api/run-model', methods=['POST'])
def run_model():
    global current_model, current_data_file
    
    try:
        # Get parameters from request
        data = request.json
        n_clusters = data.get('clusters', 5)
        max_iterations = data.get('maxIterations', 300)
        algorithm = data.get('algorithm', 'auto')
        random_state = data.get('randomState', 42)
        normalize = data.get('normalize', True)
        features = data.get('features', None)
        
        # If no data file has been uploaded, use the sample data
        if current_data_file is None:
            current_data_file = 'data/mall_customers.csv'
            
            # If sample data doesn't exist, create it
            if not os.path.exists(current_data_file):
                create_sample_data(current_data_file)
        
        # Initialize and run the model
        model = MallCustomerSegmentation(
            n_clusters=n_clusters,
            random_state=random_state,
            max_iter=max_iterations,
            algorithm=algorithm,
            normalize=normalize
        )
        
        model.load_data(current_data_file)
        model.fit(features=features)
        current_model = model
        
        # Get results
        results = model.get_results()
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": f"Error running model: {str(e)}"}), 500

@app.route('/api/segmentation', methods=['GET'])
def get_segmentation():
    global current_model
    
    if current_model is None:
        return jsonify({"error": "No model has been run yet"}), 400
        
    try:
        results = current_model.get_results()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"Error getting segmentation results: {str(e)}"}), 500

@app.route('/api/export-csv', methods=['GET'])
def export_csv():
    global current_model
    
    if current_model is None:
        return jsonify({"error": "No model has been run yet"}), 400
        
    try:
        # Get the dataframe with cluster assignments
        df = current_model.df
        
        # Create a CSV string
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        
        # Create a response with the CSV file
        response = app.response_class(
            csv_buffer.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=customer_segments.csv'}
        )
        
        return response
        
    except Exception as e:
        return jsonify({"error": f"Error exporting CSV: {str(e)}"}), 500

@app.route('/api/export-plot', methods=['GET'])
def export_plot():
    global current_model
    
    if current_model is None:
        return jsonify({"error": "No model has been run yet"}), 400
        
    try:
        # Create a plot
        plt.figure(figsize=(10, 8))
        
        # Get the dataframe with cluster assignments
        df = current_model.df
        
        # Determine column names
        if 'Annual Income (k$)' in df.columns:
            income_col = 'Annual Income (k$)'
        else:
            income_col = next((col for col in df.columns if 'income' in col.lower()), None)
            
        if 'Spending Score (1-100)' in df.columns:
            spending_col = 'Spending Score (1-100)'
        else:
            spending_col = next((col for col in df.columns if 'spend' in col.lower()), None)
        
        # Plot each cluster
        for i in range(current_model.n_clusters):
            cluster_data = df[df['Cluster'] == i]
            plt.scatter(
                cluster_data[income_col],
                cluster_data[spending_col],
                s=100,
                label=f'Cluster {i+1}'
            )
            
        # Plot centroids
        centroids = current_model.model.cluster_centers_
        if current_model.normalize:
            centroids = current_model.scaler.inverse_transform(centroids)
            
        plt.scatter(
            centroids[:, 0],
            centroids[:, 1],
            s=300,
            c='black',
            marker='*',
            label='Centroids'
        )
        
        plt.title('Customer Segments', fontsize=16)
        plt.xlabel(income_col, fontsize=14)
        plt.ylabel(spending_col, fontsize=14)
        plt.legend()
        plt.grid(True, linestyle='--', alpha=0.7)
        
        # Save plot to a bytes buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
        buf.seek(0)
        
        # Create a response with the image
        return send_file(
            buf,
            mimetype='image/png',
            as_attachment=True,
            download_name='customer_segments.png'
        )
        
    except Exception as e:
        return jsonify({"error": f"Error exporting plot: {str(e)}"}), 500

@app.route('/api/optimal-k', methods=['GET'])
def find_optimal_k():
    global current_data_file
    
    try:
        # If no data file has been uploaded, use the sample data
        if current_data_file is None:
            current_data_file = 'data/mall_customers.csv'
            
            # If sample data doesn't exist, create it
            if not os.path.exists(current_data_file):
                create_sample_data(current_data_file)
                
        # Load the data
        model = MallCustomerSegmentation()
        model.load_data(current_data_file)
        X = model.preprocess_data()
        
        # Calculate inertia and silhouette scores for different k values
        k_values = range(2, 11)
        inertia_values = []
        silhouette_values = []
        
        for k in k_values:
            kmeans = MallCustomerSegmentation(n_clusters=k)
            kmeans.load_data(current_data_file)
            kmeans.fit()
            
            inertia_values.append(kmeans.model.inertia_)
            
            # Calculate silhouette score if there's more than one cluster
            if k > 1:
                silhouette_values.append(
                    float(silhouette_score(X, kmeans.df['Cluster']))
                )
            else:
                silhouette_values.append(0)
                
        # Find the optimal k using the elbow method
        # Calculate the rate of change in inertia
        inertia_changes = [inertia_values[i-1] - inertia_values[i] for i in range(1, len(inertia_values))]
        normalized_changes = [change / inertia_values[0] for change in inertia_changes]
        
        # Find the point where the rate of change starts to decrease significantly
        elbow_point = 2  # Default to 2
        for i in range(1, len(normalized_changes)):
            if normalized_changes[i] < 0.5 * normalized_changes[i-1]:
                elbow_point = i + 2  # +2 because we start from k=2 and i is 0-indexed
                break
                
        # Find the k with the highest silhouette score
        silhouette_point = k_values[silhouette_values.index(max(silhouette_values))]
        
        # Return the results
        return jsonify({
            "k_values": list(k_values),
            "inertia_values": [float(x) for x in inertia_values],
            "silhouette_values": silhouette_values,
            "optimal_k_elbow": elbow_point,
            "optimal_k_silhouette": silhouette_point,
            "recommended_k": silhouette_point  # Prefer silhouette method
        })
        
    except Exception as e:
        return jsonify({"error": f"Error finding optimal k: {str(e)}"}), 500

def create_sample_data(file_path):
    """Create sample mall customer data if none exists"""
    # Sample data
    data = {
        'CustomerID': range(1, 201),
        'Gender': np.random.choice(['Male', 'Female'], size=200),
        'Age': np.random.randint(18, 70, size=200),
        'Annual Income (k$)': np.random.randint(15, 140, size=200),
        'Spending Score (1-100)': np.random.randint(1, 100, size=200)
    }
    
    df = pd.DataFrame(data)
    
    # Create some patterns in the data to make clustering more meaningful
    # High income, high spending
    df.loc[0:39, 'Annual Income (k$)'] = np.random.randint(80, 140, size=40)
    df.loc[0:39, 'Spending Score (1-100)'] = np.random.randint(70, 100, size=40)
    
    # High income, low spending
    df.loc[40:79, 'Annual Income (k$)'] = np.random.randint(80, 140, size=40)
    df.loc[40:79, 'Spending Score (1-100)'] = np.random.randint(1, 30, size=40)
    
    # Low income, high spending
    df.loc[80:119, 'Annual Income (k$)'] = np.random.randint(15, 40, size=40)
    df.loc[80:119, 'Spending Score (1-100)'] = np.random.randint(70, 100, size=40)
    
    # Low income, low spending
    df.loc[120:159, 'Annual Income (k$)'] = np.random.randint(15, 40, size=40)
    df.loc[120:159, 'Spending Score (1-100)'] = np.random.randint(1, 30, size=40)
    
    # Average income, average spending
    df.loc[160:199, 'Annual Income (k$)'] = np.random.randint(40, 80, size=40)
    df.loc[160:199, 'Spending Score (1-100)'] = np.random.randint(30, 70, size=40)
    
    # Save to CSV
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    
    return df

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
