"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Home() {
  const [value, setValue] = useState("");
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const getAllCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${value}`
        );
        setCharacters(response.data.results);
        setError(null);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    getAllCharacters();
  }, [value]);

  const handleCheckboxChange = (character, isChecked) => {
    if (isChecked) {
      setSelectedCharacters((prev) => [...prev, character]);
    } else {
      setSelectedCharacters((prev) =>
        prev.filter((selected) => selected.id !== character.id)
      );
    }
  };

  const handleRemoveCharacter = (id) => {
    setSelectedCharacters((prev) =>
      prev.filter((character) => character.id !== id)
    );
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const index = characters.findIndex(
        (character) =>
          character.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      if (index !== -1) {
        const nextIndex = index === characters.length - 1 ? 0 : index + 1;
        inputRef.current.blur();
        setSelectedCharacters([characters[nextIndex]]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const index = characters.findIndex(
        (character) =>
          character.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      if (index !== -1) {
        const prevIndex = index === 0 ? characters.length - 1 : index - 1;
        inputRef.current.blur();
        setSelectedCharacters([characters[prevIndex]]);
      }
    } else if (e.key === "Tab" && selectedCharacters.length > 0) {
      e.preventDefault();
      setValue(selectedCharacters[0].name);
      setSelectedCharacters([]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (characters.length > 0) {
        setValue(characters[0].name);
        setSelectedCharacters([characters[0]]);
      }
    }
  };

  return (
    <main>
      <div className="container">
        {selectedCharacters.map((character) => (
          <div key={character.id} className="selected_character_container">
            {character.name}
            <button
              onClick={() => handleRemoveCharacter(character.id)}
              className="removeCharacterButton"
            >
              x
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          className="input"
          placeholder="Search characters..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="itemBox characterItemContainer">
        {characters.map((character) => {
          const boldedName = character.name
            .split(new RegExp(`(${value})`, "gi"))
            .map((part, index) => {
              const isMatch = part.toLowerCase() === value.toLowerCase();
              return isMatch ? (
                <span key={index} className="searchedText">
                  {part}
                </span>
              ) : (
                part
              );
            });
          return (
            <div key={character.id} className="item-container">
              <input
                className="checkBox"
                type="checkbox"
                checked={selectedCharacters.some(
                  (selected) => selected.id === character.id
                )}
                onChange={(e) =>
                  handleCheckboxChange(character, e.target.checked)
                }
              />
              <img className="img" src={character.image} alt={character.name} />
              <div className="info">
                <p className="title">{boldedName}</p>
                <p className="subTitle">{character.episode.length} Episodes</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
