FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema (opcional)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instala bibliotecas adicionais
RUN pip install discord.py python-dotenv

# Copia código da aplicação
COPY . .

# Expõe porta (opcional)
EXPOSE 8000

# Comando para rodar uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]