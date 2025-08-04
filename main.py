from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Massage Pro API")

# Настройка CORS для работы с React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Massage API is running"}

@app.get("/api/test")
def test():
    return {"status": "ok", "message": "API работает!"}

@app.get("/api/services")
def get_services():
    # Пока вернем тестовые данные
    return [
        {
            "id": 1,
            "name": "Классический массаж",
            "description": "Расслабляющий массаж всего тела",
            "price": 3000,
            "duration": 60
        },
        {
            "id": 2,
            "name": "Спортивный массаж",
            "description": "Глубокая проработка мышц",
            "price": 4000,
            "duration": 90
        }
    ]