
import flights from './Flights.json';
import { db } from './FireBase'; 
import { collection, addDoc } from "firebase/firestore";


export const calculatePrice = (flightId, seatNumber) => {
  const selectedFlight = flights.find(flight => flight.id === flightId);
  if (!selectedFlight) return 0;

  const selectedSeat = selectedFlight.seats.find(seat => seat.number === seatNumber);
  if (!selectedSeat || selectedSeat.reserved) return 0; 

  console.log(calculatePrice)
  return selectedSeat.price;
};

export const addCustomer = async (kullanıcıADI) => {
  try {
    const docRef = await addDoc(collection(db, "müşteri"), {
      kullanıcıADI: kullanıcıADI,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
