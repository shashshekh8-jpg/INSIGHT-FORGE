import networkx as nx
import pandas as pd
from app.core.database import get_db

def detect_toxic_corridors():
    """Identifies systemic risk corridors using Edge Betweenness Centrality"""
    df = get_db().execute("SELECT * FROM transactions").df()
    fraud_df = df[df['fraud_flag'] == 1].copy()
    
    # Mathematical correction: volume as affinity metric
    fraud_df['inverse_volume'] = 1.0 / fraud_df['amount_inr']
    
    G = nx.from_pandas_edgelist(
        fraud_df,
        source='sender_state',
        target='receiver_bank',
        edge_attr='inverse_volume',
        create_using=nx.DiGraph()
    )
    
    centrality = nx.edge_betweenness_centrality(G, weight='inverse_volume')
    sorted_corridors = sorted(centrality.items(), key=lambda item: item[1], reverse=True)
    top_corridor = sorted_corridors[0] if sorted_corridors else None
    
    return {
        "top_corridor": [top_corridor[0][0], top_corridor[0][1]] if top_corridor else ["Unknown", "Unknown"],
        "summary": f"Systemic risk corridor detected between {top_corridor[0][0]} and {top_corridor[0][1]}." if top_corridor else "No corridors detected."
    }
