import React, { useEffect, useState } from "react";
import "./styles.css";

const url = "https://pokeapi.co/api/v2/pokemon";

export default function App() {
  const [openedCard, setOpenedCard] = useState([]);
  const [matched, setMatched] = useState([]);
  const [pokemons, setPokemons] = useState([]);

  const pairOfPokemons = [...pokemons, ...pokemons];

  useEffect(() => {
    fetch(`${url}?limit=151`)
      .then((response) => response.json())
      .then((data) => {
        // Shuffle and slice the array to get 4 random Pokemon
        const shuffled = data.results.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        // Fetch details for each selected Pokemon
        Promise.all(selected.map((pokemon) => fetch(pokemon.url).then((response) => response.json())))
          .then((details) => {
            setPokemons(details);
          })
      });
  }, []);

  function flipCard(index) {
    setOpenedCard((opened) => [...opened, index]);
  }

  useEffect(() => {
    if (openedCard < 2) return;

    const firstMatched = pairOfPokemons[openedCard[0]];
    const secondMatched = pairOfPokemons[openedCard[1]];

    if (secondMatched && firstMatched.id === secondMatched.id) {
      setMatched([...matched, firstMatched.id]);
    }

    if (openedCard.length === 2) setTimeout(() => setOpenedCard([]), 1000);
  }, [openedCard]);

  return (
    <div className="App">
      <div className="cards">
        {pairOfPokemons.map((pokemon, index) => {
          let isFlipped = false;

          if (openedCard.includes(index)) isFlipped = true;
          if (matched.includes(pokemon.id)) isFlipped = true;
          return (
            <div
              className={`pokemon-card ${isFlipped ? "flipped" : ""} `}
              key={index}
              onClick={() => flipCard(index)}
            >
              <div className="inner">
                <div className="front">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width="100"
                  />
                </div>
                <div className="back"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
