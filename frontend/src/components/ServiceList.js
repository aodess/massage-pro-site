import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';

function ServiceList({ onSelectService }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (err) {
      setError('Ошибка загрузки услуг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="service-list">
      <h2>Наши услуги</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p className="price">{service.price} ₽</p>
            <p className="duration">{service.duration} минут</p>
            {onSelectService && (
              <button onClick={() => onSelectService(service)}>
                Записаться
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceList;