import React, { useState } from 'react';
import ServiceList from './components/ServiceList';
import BookingForm from './components/BookingForm';
import './App.css';

function App() {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleCloseForm = () => {
    setSelectedService(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Профессиональный массаж</h1>
        <p>Забота о вашем здоровье и комфорте</p>
      </header>
      
      <main>
        <ServiceList onSelectService={handleServiceSelect} />
      </main>
      
      {selectedService && (
        <BookingForm
          service={selectedService}
          onClose={handleCloseForm}
          onSuccess={() => {
            // Можно добавить обновление списка записей
          }}
        />
      )}
      
      <footer>
        <p>&copy; 2025 Массажный салон. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;