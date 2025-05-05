from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
import psycopg2
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ❏ Configuration de la connexion PostgreSQL via env vars
DB_HOST     = os.getenv('PG_HOST', 'localhost')
DB_PORT     = os.getenv('PG_PORT', '5432')
DB_NAME     = os.getenv('PG_DATABASE', 'freezepay_db')
DB_USER     = os.getenv('PG_USER', 'ton_user')
DB_PASSWORD = os.getenv('PG_PASSWORD', 'ton_password')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST, port=DB_PORT,
        database=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )

@app.route('/suggest', methods=['GET'])
def suggest():
    """
    Génère des suggestions IA basées sur :
      1) Isolation Forest → Dépenses anormales
      2) Régression linéaire → Tendance mensuelle des dépenses
    Paramètre attendu : user_id (int)
    """
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({"error": "user_id requis"}), 400

    # 1. Récupération des transactions de l’utilisateur
    conn = get_db_connection()
    df = pd.read_sql(
        """
        SELECT amount, created_at
        FROM transactions
        WHERE user_id = %s
        ORDER BY created_at
        """,
        conn, params=(user_id,)
    )
    conn.close()

    if df.empty:
        return jsonify({"suggestions": [
            "Aucune transaction trouvée : commence à dépenser pour voir des suggestions !"
        ]})

    suggestions = []

    # 2. Isolation Forest pour détecter les transactions atypiques
    if len(df) >= 10:
        # On utilise seulement la colonne 'amount'
        iso = IsolationForest(contamination=0.05, random_state=42)
        df['anomaly'] = iso.fit_predict(df[['amount']])
        anomalies = df[df['anomaly'] == -1]
        for _, row in anomalies.iterrows():
            amt = row['amount']
            date = row['created_at'].strftime("%Y-%m-%d")
            suggestions.append(
                f"Dépense exceptionnelle de {amt:.2f} € le {date} : vérifie si c'était nécessaire."
            )
    else:
        suggestions.append(
            "Trop peu de données (moins de 10 transactions) pour détecter les anomalies."
        )

    # 3. Tendance mensuelle via régression linéaire
    # On agrège par mois
    df['month'] = df['created_at'].dt.to_period('M').dt.to_timestamp()
    monthly = df.groupby('month')['amount'].sum().reset_index()
    # Prépare x et y pour la régression
    X = np.arange(len(monthly)).reshape(-1, 1)   # mois 0,1,2...
    y = monthly['amount'].values
    if len(monthly) >= 3:
        lr = LinearRegression()
        lr.fit(X, y)
        slope = lr.coef_[0]
        if slope > 0:
            suggestions.append(
                f"Tendance : tes dépenses mensuelles augmentent en moyenne de {slope:.2f} € chaque mois. "
                "Envisage de réduire une catégorie de dépenses."
            )
        else:
            suggestions.append(
                f"Tendance : tes dépenses mensuelles diminuent en moyenne de {abs(slope):.2f} € chaque mois. "
                "Bravo pour ta gestion !"
            )
    else:
        suggestions.append(
            "Pas assez de mois de données (moins de 3) pour analyser la tendance."
        )

    # 4. Conseil générique sur l’épargne
    avg_month = monthly['amount'].mean()
    suggestions.append(
        f"Moyenne mensuelle de dépense : {avg_month:.2f} €. "
        "Pense à mettre 10% de ce montant de côté chaque mois pour épargner."
    )

    return jsonify({"suggestions": suggestions})

if __name__ == '__main__':
    # Charge .env si besoin
    from dotenv import load_dotenv
    load_dotenv()
    app.run(host='0.0.0.0', port=5001, debug=False)
