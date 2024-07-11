import streamlit as st
import pandas as pd
from kafka import KafkaConsumer
import json
import time

st.set_page_config(layout='wide')  # Définir la disposition de la page sur 'wide'
st.title('Velib Stalking')

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
  
consumer = create_consumer()

data = []
for i in range(100): 
    message = next(consumer)
    data.append(message.value)
    
city_dropdown_placeholder = st.empty()

cities = extract_cities(data)
st.write(cities)
st.write(message)