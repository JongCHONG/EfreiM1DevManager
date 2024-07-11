import streamlit as st
import pandas as pd
from kafka import KafkaConsumer
import json
import time

st.set_page_config(layout='wide') 

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

st.title('Suivi des stations Vélib')

consumer = create_consumer()

villes = ['Toutes les villes', 'amiens', 'toulouse', 'lyon'] 
ville_choisie = st.selectbox('Choisissez votre ville', villes)

data_placeholder = st.empty()

map_placeholder = st.empty()

graph_placeholder = st.empty()

try:
  while True:  
    data = []
    for i in range(50): 
      message = next(consumer)
      data.append(message.value)
    df = pd.DataFrame(data)

    if ville_choisie == 'Toutes les villes':
        df_ville = df.copy() 
    else:
        df_ville = df[df['contract_name'] == ville_choisie].copy()

    data_placeholder.dataframe(df_ville)

    df_ville.loc[:, 'latitude'] = df_ville['position'].apply(lambda x: x['lat'])
    df_ville.loc[:, 'longitude'] = df_ville['position'].apply(lambda x: x['lng'])

    map_df = df_ville[['latitude', 'longitude']].dropna()

    map_placeholder.map(map_df)

    available_bikes = df_ville['available_bikes'].value_counts().sort_index()
    
    graph_placeholder.bar_chart(available_bikes)

    time.sleep(90) 
finally:
  consumer.close()