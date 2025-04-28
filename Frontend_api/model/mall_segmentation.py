import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import silhouette_score
import os
import json
from typing import Dict, List, Any, Optional

class MallCustomerSegmentation:
    def __init__(self, n_clusters=5, random_state=42, max_iter=300, algorithm='auto', normalize=True):
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.max_iter = max_iter
        self.algorithm = algorithm
        self.normalize = normalize
        self.model = None
        self.scaler = StandardScaler() if normalize else None
        self.df = None
        self.features_used = []
        self.cluster_descriptions = {
            "high_income_high_spending": "Premium Shoppers: High income customers who spend generously",
            "high_income_low_spending": "Potential Shoppers: High income customers who are conservative spenders",
            "low_income_high_spending": "Careful Shoppers: Budget-conscious customers who still spend significantly",
            "low_income_low_spending": "Value Shoppers: Budget-conscious customers who spend minimally",
            "average_income_average_spending": "Standard Shoppers: Average income and spending habits"
        }
        
    def load_data(self, file_path: str) -> pd.DataFrame:
        """Load customer data from CSV file"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found: {file_path}")
        
        self.df = pd.read_csv(file_path)
        return self.df
    
    def preprocess_data(self, features: Optional[List[str]] = None) -> np.ndarray:
        """Preprocess data for clustering"""
        if self.df is None:
            raise ValueError("No data loaded. Call load_data() first.")
        
        # Default features if none specified
        if features is None:
            if 'Annual Income (k$)' in self.df.columns and 'Spending Score (1-100)' in self.df.columns:
                features = ['Annual Income (k$)', 'Spending Score (1-100)']
            elif 'annual_income' in self.df.columns and 'spending_score' in self.df.columns:
                features = ['annual_income', 'spending_score']
            else:
                # Try to infer features
                numeric_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()
                # Exclude ID columns
                features = [col for col in numeric_cols if not ('id' in col.lower() or 'customer' in col.lower())]
                
        self.features_used = features
        X = self.df[features].values
        
        # Normalize data if specified
        if self.normalize:
            X = self.scaler.fit_transform(X)
            
        return X
    
    def fit(self, X: Optional[np.ndarray] = None, features: Optional[List[str]] = None) -> np.ndarray:
        """Fit K-means model to the data"""
        if X is None:
            X = self.preprocess_data(features)
            
        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=self.random_state,
            max_iter=self.max_iter,
            algorithm=self.algorithm
        )
        
        self.df['Cluster'] = self.model.fit_predict(X)
        return self.model.labels_
    
    def get_cluster_description(self, cluster_df: pd.DataFrame) -> str:
        """Generate description for a cluster based on its characteristics"""
        # Determine income level
        if 'Annual Income (k$)' in self.df.columns:
            income_col = 'Annual Income (k$)'
        elif 'annual_income' in self.df.columns:
            income_col = 'annual_income'
        else:
            income_col = [col for col in self.df.columns if 'income' in col.lower()][0]
            
        # Determine spending level
        if 'Spending Score (1-100)' in self.df.columns:
            spending_col = 'Spending Score (1-100)'
        elif 'spending_score' in self.df.columns:
            spending_col = 'spending_score'
        else:
            spending_col = [col for col in self.df.columns if 'spend' in col.lower()][0]
        
        avg_income = cluster_df[income_col].mean()
        avg_spending = cluster_df[spending_col].mean()
        
        # Determine income level
        if avg_income < 40:
            income_level = "low"
        elif avg_income > 70:
            income_level = "high"
        else:
            income_level = "average"
            
        # Determine spending level
        if avg_spending < 40:
            spending_level = "low"
        elif avg_spending > 70:
            spending_level = "high"
        else:
            spending_level = "average"
            
        key = f"{income_level}_income_{spending_level}_spending"
        if key in self.cluster_descriptions:
            return self.cluster_descriptions[key]
        else:
            return f"{income_level.capitalize()} income, {spending_level} spending customers"
    
    def get_cluster_metrics(self) -> List[Dict[str, Any]]:
        """Calculate metrics for each cluster"""
        if self.df is None or 'Cluster' not in self.df.columns:
            raise ValueError("Model not fitted. Call fit() first.")
            
        metrics = []
        
        # Determine column names
        if 'Annual Income (k$)' in self.df.columns:
            income_col = 'Annual Income (k$)'
        elif 'annual_income' in self.df.columns:
            income_col = 'annual_income'
        else:
            income_col = [col for col in self.df.columns if 'income' in col.lower()][0]
            
        if 'Spending Score (1-100)' in self.df.columns:
            spending_col = 'Spending Score (1-100)'
        elif 'spending_score' in self.df.columns:
            spending_col = 'spending_score'
        else:
            spending_col = [col for col in self.df.columns if 'spend' in col.lower()][0]
            
        if 'Age' in self.df.columns:
            age_col = 'Age'
        elif 'age' in self.df.columns:
            age_col = 'age'
        else:
            age_col = None
            
        # Calculate silhouette score
        X = self.df[self.features_used].values
        if self.normalize:
            X = self.scaler.transform(X)
        silhouette_avg = silhouette_score(X, self.df['Cluster'])
        
        for i in range(self.n_clusters):
            cluster_df = self.df[self.df['Cluster'] == i]
            
            metric = {
                "size": len(cluster_df),
                "avgIncome": float(cluster_df[income_col].mean()),
                "avgSpending": float(cluster_df[spending_col].mean()),
                "density": float(len(cluster_df) / len(self.df)),
                "description": self.get_cluster_description(cluster_df),
                "silhouette": float(silhouette_avg),
                "variance": float(cluster_df[self.features_used].var().mean()),
            }
            
            if age_col:
                metric["avgAge"] = float(cluster_df[age_col].mean())
                
            # Gender distribution if available
            if 'Gender' in self.df.columns or 'gender' in self.df.columns:
                gender_col = 'Gender' if 'Gender' in self.df.columns else 'gender'
                gender_counts = cluster_df[gender_col].value_counts(normalize=True).to_dict()
                metric["genderDistribution"] = {k: float(v) for k, v in gender_counts.items()}
                
            metrics.append(metric)
            
        return metrics
    
    def get_results(self) -> Dict[str, Any]:
        """Get complete segmentation results in the format expected by the frontend"""
        if self.df is None or 'Cluster' not in self.df.columns:
            raise ValueError("Model not fitted. Call fit() first.")
            
        # Determine column names
        id_col = next((col for col in self.df.columns if 'id' in col.lower() or 'customer' in col.lower()), None)
        if not id_col:
            self.df['CustomerID'] = range(1, len(self.df) + 1)
            id_col = 'CustomerID'
            
        if 'Gender' in self.df.columns:
            gender_col = 'Gender'
        elif 'gender' in self.df.columns:
            gender_col = 'gender'
        else:
            gender_col = None
            
        if 'Age' in self.df.columns:
            age_col = 'Age'
        elif 'age' in self.df.columns:
            age_col = 'age'
        else:
            age_col = None
            
        if 'Annual Income (k$)' in self.df.columns:
            income_col = 'Annual Income (k$)'
        elif 'annual_income' in self.df.columns:
            income_col = 'annual_income'
        else:
            income_col = [col for col in self.df.columns if 'income' in col.lower()][0]
            
        if 'Spending Score (1-100)' in self.df.columns:
            spending_col = 'Spending Score (1-100)'
        elif 'spending_score' in self.df.columns:
            spending_col = 'spending_score'
        else:
            spending_col = [col for col in self.df.columns if 'spend' in col.lower()][0]
            
        # Prepare customer data
        customers = []
        for _, row in self.df.iterrows():
            customer = {
                "customerId": int(row[id_col]),
                "annualIncome": float(row[income_col]),
                "spendingScore": float(row[spending_col]),
                "cluster": int(row['Cluster'])
            }
            
            if gender_col:
                customer["gender"] = row[gender_col]
                
            if age_col:
                customer["age"] = int(row[age_col])
                
            customers.append(customer)
            
        # Prepare cluster data including centroids
        clusters = []
        
        # Add centroids
        for i, center in enumerate(self.model.cluster_centers_):
            # Convert back to original scale if normalized
            if self.normalize:
                center_original = self.scaler.inverse_transform([center])[0]
            else:
                center_original = center
                
            # For 2D visualization
            if len(center_original) >= 2:
                clusters.append({
                    "annualIncome": float(center_original[0]),
                    "spendingScore": float(center_original[1]),
                    "cluster": i,
                    "isCentroid": True
                })
                
                # For 3D visualization if age is available
                if age_col and len(center_original) >= 3:
                    clusters[-1]["age"] = float(center_original[2])
            
        # Add individual points
        for _, row in self.df.iterrows():
            point = {
                "annualIncome": float(row[income_col]),
                "spendingScore": float(row[spending_col]),
                "cluster": int(row['Cluster']),
                "isCentroid": False
            }
            
            if age_col:
                point["age"] = float(row[age_col])
                
            clusters.append(point)
            
        # Calculate metrics
        metrics = self.get_cluster_metrics()
        
        # Return complete results
        return {
            "customers": customers,
            "clusters": clusters,
            "metrics": metrics,
            "modelInfo": {
                "algorithm": self.algorithm,
                "k": self.n_clusters,
                "iterations": self.model.n_iter_,
                "features": self.features_used,
                "silhouetteScore": float(silhouette_score(X, self.df['Cluster'])) if len(np.unique(self.df['Cluster'])) > 1 else 0
            }
        }
    
    def save_model(self, file_path: str) -> None:
        """Save the trained model"""
        if self.model is None:
            raise ValueError("Model not trained. Call fit() first.")
            
        import joblib
        joblib.dump(self.model, file_path)
        
    def load_model(self, file_path: str) -> None:
        """Load a trained model"""
        import joblib
        self.model = joblib.load(file_path)
