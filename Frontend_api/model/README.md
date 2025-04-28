# Mall Customer Segmentation API

This is a Flask API for the Mall Customer Segmentation model.

## Setup

1. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

2. Run the API:
   \`\`\`
   python api.py
   \`\`\`

The API will be available at http://localhost:5000

## API Endpoints

- `POST /api/upload` - Upload customer data (CSV file)
- `POST /api/run-model` - Run the K-means clustering model
- `GET /api/segmentation` - Get the segmentation results
- `GET /api/export-csv` - Export the segmentation results as CSV
- `GET /api/export-plot` - Export a plot of the segmentation results
- `GET /api/optimal-k` - Find the optimal number of clusters

## Sample Data

If no data is uploaded, the API will use a sample dataset.
