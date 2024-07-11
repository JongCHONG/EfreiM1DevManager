import streamlit as st
import pandas as pd
from kafka import KafkaConsumer
import json
import time

st.set_page_config(layout='wide')  # Définir la disposition de la page sur 'wide'

def create_consumer():
    consumer = KafkaConsumer(
        'velib-stations',
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='latest',  
        enable_auto_commit=True,
        group_id='velib-monitor-stations',
        value_deserializer=lambda x: json.loads(x.decode('utf-8')),
        api_version=(0, 10, 1))  
    return consumer

# Fonction pour extraire les noms des villes (contract_name) des données
def extract_cities(data):
    cities = set()
    for message in data:
        cities.add(message['contract_name'])
    return sorted(list(cities))

# Fonction pour filtrer les données en fonction de la ville sélectionnée
def filter_data_by_city(data, selected_city):
    filtered_data = [message for message in data if message['contract_name'] == selected_city]
    return filtered_data

st.title('Velib Stalking')

consumer = create_consumer()

# Créer un placeholder pour le tableau de données
data_placeholder = st.empty()

# Créer un placeholder pour la carte
map_placeholder = st.empty()

# Créer un placeholder pour le dropdown menu des villes
city_dropdown_placeholder = st.empty()

count = 0  # Initialiser le compteur pour les clés uniques

try:
    # while True:  
        data = []
        for i in range(100): 
            message = next(consumer)
            data.append(message.value)
        
        # Extraire les noms des villes (contract_name)
        cities = extract_cities(data)

        # Afficher le dropdown menu des villes avec une clé unique
        selected_city = city_dropdown_placeholder.selectbox("Sélectionner une ville", cities, key=str(count))

        # Filtrer les données en fonction de la ville sélectionnée
        filtered_data = filter_data_by_city(data, selected_city)
        filtered_df = pd.DataFrame(filtered_data)

        # Afficher le tableau de données filtrées
        data_placeholder.dataframe(filtered_df)

        # Extraire les valeurs 'lat' et 'lng' des données filtrées
        filtered_df['latitude'] = filtered_df['position'].apply(lambda x: x['lat'])
        filtered_df['longitude'] = filtered_df['position'].apply(lambda x: x['lng'])

        # Créer un DataFrame avec les colonnes "latitude" et "longitude" des données filtrées
        map_df = filtered_df[['latitude', 'longitude']].dropna()

        # Afficher les positions sur une carte
        map_placeholder.map(map_df)

        count += 1  # Incrémenter le compteur
        
        # time.sleep(90) 

finally:
    consumer.close()
