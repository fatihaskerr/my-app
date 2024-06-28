import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Table, Select, Button, Row, Col, Radio } from 'antd';
import { calculatePrice } from './utils';
import flightsData from './Flights.json';

const { Option } = Select;

const FlightSearchSchema = Yup.object().shape({
  departure: Yup.string().required('Bu alan zorunludur'),
  destination: Yup.string().required('Bu alan zorunludur'),
  departureTime: Yup.string().required('Bu alan zorunludur'),
  date: Yup.string().required('Bu alan zorunludur'),
});

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [tripType, setTripType] = useState('one-way'); 
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);

  useEffect(() => {
    setFlights(flightsData);
  }, []);

  const handleSearch = (values) => {
    const { departure, destination, departureTime, date } = values;
    let results = flights.filter(
      (flight) =>
        flight.departure === departure &&
        flight.destination === destination &&
        flight.departureTime === departureTime &&
        flight.date === date
    );

    setSearchResults(results);
    setSelectedFlight(null);
  };

  const uniqueDepartures = [...new Set(flights.map((flight) => flight.departure))];
  const uniqueDestinations = [...new Set(flights.map((flight) => flight.destination))];

  useEffect(() => {
    if (selectedDeparture && selectedDestination) {
      const filteredFlights = flights.filter(
        (flight) =>
          flight.departure === selectedDeparture && flight.destination === selectedDestination
      );

      const times = [...new Set(filteredFlights.map((flight) => flight.departureTime))];
      const dates = [...new Set(filteredFlights.map((flight) => flight.date))];

      setFilteredTimes(times);
      setFilteredDates(dates);
    } else {
      setFilteredTimes([]);
      setFilteredDates([]);
    }
  }, [selectedDeparture, selectedDestination, flights]);

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
    setTotalPrice(calculatePrice(selectedFlight.id, seat));
  };

  const handleSeatReservation = () => {
    if (selectedFlight && selectedSeat) {
      const updatedFlights = flights.map((flight) => {
        if (flight.id === selectedFlight.id) {
          const updatedSeats = flight.seats.map((seat) => {
            if (seat.number === selectedSeat) {
              return { ...seat, reserved: true };
            }
            return seat;
          });
          return { ...flight, seats: updatedSeats };
        }
        return flight;
      });

      setFlights(updatedFlights);

      navigate('/payment', {
        state: {
          selectedFlightId: selectedFlight.id,
          selectedSeatNumber: selectedSeat,
          totalPrice: tripType === 'round-trip' ? totalPrice * 2 : totalPrice,
          tripType: tripType
        }
      });
    }
  };

  const columns = [
    {
      title: 'Kalkış',
      dataIndex: 'departure',
      key: 'departure',
    },
    {
      title: 'Varış',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Kalkış Saati',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `${text} TL`,
    },
  ];

  return (
    <div className="homepage-container" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Hoşgeldiniz - uçurucum.com</h1>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Formik
            initialValues={{ departure: '', destination: '', departureTime: '', date: '' }}
            validationSchema={FlightSearchSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSearch(values);
              setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px' }} htmlFor="departure">Kalkış</label>
                  <Field
                    as={Select}
                    name="departure"
                    onChange={(e) => {
                      setFieldValue('departure', e);
                      setSelectedDeparture(e);
                      setSelectedDestination(''); 
                      setFieldValue('destination', '');
                    }}
                    value={values.departure}
                    style={{ width: '100%' }}
                  >
                    <Option value="" disabled hidden>Kalkış Seçiniz</Option>
                    {uniqueDepartures.map((departure, index) => (
                      <Option key={index} value={departure}>{departure}</Option>
                    ))}
                  </Field>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px' }} htmlFor="destination">Varış</label>
                  <Field
                    as={Select}
                    name="destination"
                    onChange={(e) => {
                      setFieldValue('destination', e);
                      setSelectedDestination(e);
                    }}
                    disabled={!selectedDeparture}
                    value={values.destination}
                    style={{ width: '100%' }}
                  >
                    <Option value="" disabled hidden>Varış Seçiniz</Option>
                    {uniqueDestinations.map((destination, index) => (
                      <Option key={index} value={destination}>{destination}</Option>
                    ))}
                  </Field>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px' }} htmlFor="departureTime">Kalkış Saati</label>
                  <Field
                    as={Select}
                    name="departureTime"
                    disabled={filteredTimes.length === 0}
                    value={values.departureTime}
                    onChange={(e) => setFieldValue('departureTime', e)}
                    style={{ width: '100%' }}
                  >
                    <Option value="" disabled hidden>Kalkış Saati Seçiniz</Option>
                    {filteredTimes.map((time, index) => (
                      <Option key={index} value={time}>{time}</Option>
                    ))}
                  </Field>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px' }} htmlFor="date">Tarih</label>
                  <Field
                    as={Select}
                    name="date"
                    disabled={filteredDates.length === 0}
                    value={values.date}
                    onChange={(e) => setFieldValue('date', e)}
                    style={{ width: '100%' }}
                  >
                    <Option value="" disabled hidden>Tarih Seçiniz</Option>
                    {filteredDates.map((date, index) => (
                      <Option key={index} value={date}>{date}</Option>
                    ))}
                  </Field>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px' }} htmlFor="tripType">Gidiş-Dönüş veya Tek Yönlü</label>
                  <Radio.Group onChange={(e) => setTripType(e.target.value)} value={tripType}>
                    <Radio value="one-way">Tek Yönlü</Radio>
                    <Radio value="round-trip">Gidiş-Dönüş</Radio>
                  </Radio.Group>
                </div>
                <Button type="primary" htmlType="submit" disabled={isSubmitting} style={{ marginTop: '16px', width: '100%' }}>
                  Ara
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>

      <div className="results-container" style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center' }}>Arama Sonuçları</h2>
        <Table
          dataSource={searchResults}
          columns={columns}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              setSelectedFlight(record);
            },
          })}
          rowClassName={(record) => (selectedFlight && record.id === selectedFlight.id ? 'selected-row' : '')}
        />
      </div>

      {selectedFlight && (
        <div className="seat-selection-container" style={{ marginTop: '40px' }}>
          <h3 style={{ textAlign: 'center' }}>Koltuk Seçimi</h3>
          <div className="seat-selection" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {selectedFlight.seats.map((seat) => (
              <Button
                key={seat.number}
                type={seat.reserved ? 'default' : seat.number === selectedSeat ? 'primary' : 'default'}
                onClick={() => handleSeatSelection(seat.number)}
                disabled={seat.reserved}
                style={{
                  margin: '5px',
                  backgroundColor: seat.reserved ? 'red' : seat.number === selectedSeat ? 'blue' : 'gray',
                  color: 'white',
                }}
              >
                {seat.number}
              </Button>
            ))}
          </div>
          {selectedSeat && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button type="primary" onClick={handleSeatReservation}>
                Rezervasyonu Tamamla
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
