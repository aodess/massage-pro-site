from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Service schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration: int

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None
    is_active: Optional[bool] = None

class Service(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Client schemas
class ClientBase(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    client_id: int
    service_id: int
    booking_date: datetime
    notes: Optional[str] = None

class BookingCreate(BaseModel):
    service_id: int
    booking_date: datetime
    notes: Optional[str] = None
    # Client data
    client_name: str
    client_phone: str
    client_email: Optional[EmailStr] = None

class BookingUpdate(BaseModel):
    booking_date: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class Booking(BookingBase):
    id: int
    status: str
    created_at: datetime
    client: Client
    service: Service
    
    class Config:
        from_attributes = True

# Admin schemas
class AdminCreate(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str