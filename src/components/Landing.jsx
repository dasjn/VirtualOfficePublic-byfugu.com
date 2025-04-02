import { useEffect, useState } from "react";
import logo from "../assets/ONFICCE_logo.svg";
import flightsData from "../assets/json/Flights_To_LPA.json";
import audioSrc from "../assets/frogAudio.mp3";
import PropTypes from "prop-types";
import { useCursorHover } from "@/hooks/useCursorHover";

Landing.propTypes = {
  setEnterExperience: PropTypes.func.isRequired,
  setCursorHover: PropTypes.func.isRequired,
};

export default function Landing({ setEnterExperience, setCursorHover }) {
  const [inputText, setInputText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Cambiado a null

  const { handlePointerOver, handlePointerOut } =
    useCursorHover(setCursorHover);

  const handleSearch = (e) => {
    const query = e.target.value;
    setInputText(query);

    if (query.length > 0) {
      const results = flightsData.filter(
        (flight) => flight.country.toLowerCase().startsWith(query.toLowerCase())

        // || flight.iso_code.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelect = (flight) => {
    setSelectedLocation(flight); // Establece el objeto del vuelo seleccionado
    setInputText(flight.country); // Establece el nombre del país en el input
    setFilteredResults([]); // Limpia los resultados
  };

  const clearSelection = () => {
    setSelectedLocation(null); // Resetea la selección
    setInputText(""); // Limpia el input
  };

  const audio = new Audio(audioSrc);

  const handleAccess = () => {
    // audio.play();
    setEnterExperience(true);
  };

  return (
    <div className="relative flex flex-col items-center text-center justify-between w-screen h-screen py-24 px-16 text-white z-50">
      <section className="flex flex-col items-center">
        <img src={logo} className="w-96 animate-move-up py-12" alt="logo" />

        <p className="opacity-0 p-4 font-semibold text-4xl animate-move-up animate-delay-300">
          Where are you coming from?
        </p>
        <p className="opacity-0 p-4 font-semibold text-2xl animate-move-up animate-delay-500">
          Select your country to find out how long it would take to visit us...
        </p>

        <div
          className={`gradient-border-mask animate-move-up animate-delay-700 opacity-0 w-96 flex items-center ${
            selectedLocation ? "cursor-pointer" : ""
          }`}
          onClick={selectedLocation ? clearSelection : undefined}
        >
          {selectedLocation ? (
            <div className="flex flex-row items-center gap-3 px-2">
              <img
                src={selectedLocation.flag_url.toLowerCase()}
                className="w-5 h-5 object-cover rounded-full"
                alt={`${selectedLocation.country} flag`}
              />
              <p className="py-2 pr-8 outline-none focus:outline-none bg-transparent text-[#E3E3E3] placeholder:text-[#E3E3E3]">
                {selectedLocation.country} {/* Accede a la propiedad country */}
              </p>
            </div>
          ) : (
            <>
              <span className="self-baseline material-symbols-outlined text-[#5C5C5C] p-2">
                search
              </span>
              <input
                type="text"
                placeholder="Type your country"
                className="py-2 pr-8 outline-none focus:outline-none bg-transparent text-[#E3E3E3] placeholder:text-[#E3E3E3]"
                value={inputText} // Muestra el texto actual
                onChange={handleSearch}
              />
            </>
          )}
        </div>
        {filteredResults.length > 0 && (
          <div className=" font-semibold mt-2 bg-[#1f1f1f] bg-opacity-60 rounded-3xl w-96 cursor-pointer">
            {filteredResults.slice(0, 4).map((flight, index) => (
              <div
                key={index}
                className={`p-6 flex flex-row gap-3 items-center ${
                  index !== filteredResults.slice(0, 4).length - 1
                    ? "border-b border-gray-600"
                    : ""
                }`}
                onClick={() => handleSelect(flight)} // Selecciona el país
              >
                <img
                  src={flight.flag_url.toLowerCase()}
                  className="w-5 h-5 object-cover rounded-full"
                  alt={`${flight.country} flag`}
                />
                <p>{flight.country}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedLocation ? (
        <p className="animate-move-up text-2xl">
          <span>You could fly for </span>
          <span className="font-semibold">
            {selectedLocation.estimated_flight_time.hours} hours and{" "}
            {selectedLocation.estimated_flight_time.minutes} min
          </span>
          <span> to visit us from {selectedLocation.country}...</span>
        </p>
      ) : null}
      <section className="flex flex-col gap-4 font-semibold animate-move-up animate-delay-1000 opacity-0">
        <p className="text-2xl">
          or access our virtual office in just 1 second!
        </p>
        <div className="inline-flex items-center justify-center">
          {" "}
          <button
            className="bg-[#2364B3] py-3 px-10 rounded-full"
            onClick={handleAccess}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            Access the ONFICCE
          </button>
        </div>
      </section>
    </div>
  );
}
