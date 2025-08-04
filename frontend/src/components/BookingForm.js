import React, { useState } from 'react';
import { bookingsAPI } from '../services/api';

function BookingForm({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    booking_date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        ...formData,
        service_id: service.id,
        booking_date: new Date(formData.booking_date).toISOString()
      };
      
      await bookingsAPI.create(bookingData);
      alert('Запись успешно создана!');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError('Ошибка при создании записи');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form">
        <h2>Запись на услугу: {service.name}</h2>
        <p>Стоимость: {service.price} ₽</p>
        <p>Длительность: {service.duration} минут</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ваше имя*</label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Телефон*</label>
            <input
              type="tel"
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              required
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="client_email"
              value={formData.client_email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Дата и время*</label>
            <input
              type="datetime-local"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div className="form-group">
            <label>Примечания</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Отправка...' : 'Записаться'}
            </button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
