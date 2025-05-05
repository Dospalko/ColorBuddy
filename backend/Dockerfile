# Použi oficiálny Python image
FROM python:3.10-slim

# Nastav pracovný adresár v kontajneri
WORKDIR /app

# Skopíruj súbor so závislosťami
COPY requirements.txt .

# Nainštaluj závislosti
RUN pip install --no-cache-dir -r requirements.txt

# Skopíruj zvyšok kódu aplikácie
COPY ./app /app/app

# Port, na ktorom pobeží FastAPI aplikácia
EXPOSE 8000

# Príkaz na spustenie aplikácie pomocou Uvicorn
# --host 0.0.0.0 je dôležité, aby bol server dostupný zvonka kontajnera
# --reload pre development (automaticky reštartne server pri zmene kódu)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]