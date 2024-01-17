import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import './App.css';
import { FaBed, FaDollarSign, FaCalendarAlt } from 'react-icons/fa'; // Importa los iconos necesarios


const MenuItem = ({ id, name, description, price, onReservation, reservations, capacity, isModalOpen, openModal, image }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleReserveClick = () => {
    openModal(id);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleReservationFormSubmit = async () => {
    // Validación del formulario
    const errors = {};
    if (!formData.name) {
      errors.name = 'Por favor, ingresa tu nombre.';
    }
    if (!formData.email) {
      errors.email = 'Por favor, ingresa tu correo electrónico.';
    }

    if (Object.keys(errors).length > 0) {
      // Muestra mensajes de error
      return;
    }

    const currentDate = new Date();
    if (selectedDate < currentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No puedes reservar para fechas pasadas.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    date: selectedDate.toISOString().split('T')[0],
  }),
});


      if (response.ok) {
        // Actualizar el estado fuera del bloque if
        onReservation({ id, name, description, price, date: selectedDate, formData });
        setFormData({ name: '', email: '' });

        Swal.fire({
          icon: 'success',
          title: '¡Reserva realizada!',
          text: `Has reservado ${name} para el ${selectedDate.toDateString()}.`,
        });
      } else {
        console.error('Error al enviar la reserva al servidor:', response.statusText);
        // Muestra un mensaje de error específico para ciertos códigos de estado
        if (response.status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Hubo un error en el servidor al procesar la reserva.',
          });
        } else {
          // Muestra un mensaje de error genérico para otros códigos de estado
          Swal.fire({
            icon: 'error',
            title: 'Error al procesar la reserva',
            text: 'Hubo un problema al procesar la reserva. Por favor, inténtalo de nuevo.',
          });
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de red:', error);
      // Muestra un mensaje de error específico para ciertos tipos de error
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'Hubo un problema al enviar la reserva. Verifica tu conexión a Internet.',
      });
    }
  };

  
  return (
    
    <div
    className={`menu-item ${isHovered ? 'hovered' : ''} ${isImageClicked ? 'image-clicked' : ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => setIsImageClicked(!isImageClicked)}
  >      
  <div className="menu-item-content">
        <img src={image} alt={name} className={`menu-item-image ${isImageClicked ? 'transparent' : ''}`} />
        <div className={`menu-item-overlay ${isHovered ? 'hovered' : ''}`}>
          <h2>{name}</h2>
          <p>{description}</p>
          <p>{`Precio: COP $${price.toFixed(2)}`}</p>
        </div>
      </div>
      <div className="menu-item-details">
        <div className="details-overlay" onClick={() => openModal(id)}>
          <p>{`Reservadas: ${reservations.length}/${capacity}`}</p>
          <button className='ButtonReservas' onClick={handleReserveClick}>Reserva ya</button>
        </div>
      </div>
      {isModalOpen === id && (
  <div className="modal">
    <div className="modal-content">
    <img className='imagenReserva'
        src="https://cdn-icons-png.flaticon.com/512/2907/2907150.png"
        alt="Bienvenida"
      />      <span className="close" onClick={() => openModal(null)}>&times;</span>
      <form onSubmit={(e) => { e.preventDefault(); handleReservationFormSubmit(); }}>
        <div className="form-group">
          <label htmlFor={`name-${id}`} className='name'>Nombre Completo:</label>
          <input
            type="text"
            id={`name-${id}`}
            name={`name-${id}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`email-${id}`} className='email'>Correo electrónico:</label>
          <input
            type="email"
            id={`email-${id}`}
            name={`email-${id}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className='date'></label>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>

        <button type="submit" className="btn btn-primary">Hacer reserva</button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

function App() {
  const [menuReservations, setMenuReservations] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);

  const openModal = (itemId) => {
    setModalOpen(itemId);
  };

  const handleMouseOverScrollDown = () => {
    // Lógica para desplazarte hacia abajo al pasar el mouse por el elemento con id 'scrollButton'
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };
  const handleReservation = (reservation) => {
    if (menuReservations.length >= reservation.capacity) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Lo siento! Se ha alcanzado la capacidad máxima de reservas para este hotel.',
      });
      return;
    }

    setMenuReservations([...menuReservations, reservation]);
    setModalOpen(null);
  };

  const menuItems = [
    {
      id: 1,
      name: 'Hotel Ayenda Quimbaya',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price: 61.016,
      capacity: 5,
      image: 'https://lh3.googleusercontent.com/p/AF1QipPw0XLxyesdNtsmzCSwZf0unHDlAZfRli97bkk6=w287-h192-n-k-rw-no-v1',
    },
    {
      id: 2,
      name: 'Hotel Mocawa Plaza',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price: 251.232,
      capacity: 8,
      image: 'https://lh3.googleusercontent.com/p/AF1QipNxZJjJ4mIGQwPqysw61a43m2uuX_b6iFdC53Wm=w287-h192-n-k-rw-no-v1',
    },
    {
      id: 3,
      name: 'Hotel El Bosque Armenia',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price: 80.000,
      capacity: 8,
      image: 'https://lh3.googleusercontent.com/gps-proxy/AMy85WLUvKcwCOZJ4ZX1mQrPD-KZ4Nuz6D5tP4tX4WepUDtWt30OZlF74z6e021Y9y_zMYZ1_v1dg1H4nkLPiCrD0evDFabkDwOW0ZzT-2mQsNymUCOjC3E0eB7fOJz0lcu6t-MxF5YTek6USRjRvUE66PbgTG2Ime06WJRIBFn7nXZ3wtqGfARLcXPr=w287-h192-n-k-rw-no-v1',
    },
    {
      id: 4,
      name: 'Hotel Yurupary Armenia',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price: 83.300,
      capacity: 8,
      image: 'https://lh3.googleusercontent.com/p/AF1QipP4tDagm6KR1rGoEsWcZuAZK2aUligAHe9ts8Fe=w287-h192-n-k-rw-no-v1',
    },
    {
      id: 5,
      name: 'Hotel Conforte',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price:  121.327,
      capacity: 8,
      image: 'https://lh3.googleusercontent.com/gps-proxy/AMy85WKM491jgAY2QAbh3jZ8HndtqkURDFbS9VWQUJJ3IkIQ3iL3vfIChUoXmSFCLI4IMGdMA3dQLUTAqQFzX6K7ocWqanmvNX3u-4N-93fXEnNZZXtGujb7DYjW2vmjbCCRgkvDs7XWqOOG3ng94bkoqDVZBRpGlmf0hwFRTzEs8PZuC2MBGtEYdHy_1Q=w287-h192-n-k-rw-no-v1',
    },
    {
      id: 6,
      name: 'Hotel Armenia Vista',
      description: 'Disfruta de la experiencia única en el Hotel Quindío Paradise, ubicado en el corazón de Armenia, Quindío.',
      price: 12.99,
      capacity: 8,
      image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/38025237.jpg?k=5c5145fd43b5389d6f71e094af9a60cd1ee0af3206621958e0a9eb2573d30d5d&o=&hp=1',
    },
  ];

  return (
    <div>
      <h1><p className='Titulo'>RESERVAS LA LOCURA</p></h1>
      <div id="scrollButton" onMouseMove={handleMouseOverScrollDown}>⬇️
        <div className="arrow-down"></div>
      </div>
      <div className="menu">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            {...item}
            onReservation={handleReservation}
            reservations={menuReservations.filter((reservation) => reservation.id === item.id)}
            isModalOpen={modalOpen}
            openModal={openModal}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
