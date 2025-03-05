import './App.css';
import {useEffect, useState} from "react";
import Character from './components/Character.js';
import 'bootstrap/dist/css/bootstrap.min.css';


// credit: https://www.youtube.com/watch?v=je3FTTunyp4
// credit: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
// credit: chatgpt for debugging..

function App() {

  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState(["mario", "yoshi", "peach"]);
  const [characterName, setCharacterName] = useState('mario');
  const [lastValidCharacter, setLastValidCharacter] = useState('mario');
  const [amiiboURL, setURL] = useState("https://www.amiiboapi.com/api/amiibo/?name=mario");

  const [typeData, setTypeData] = useState([]);
  const [countData, setCountData] = useState([]);

  const getStatData = () => {
    let types = [];
    let counts = []
    for (let i in characters) {
      if (types.includes(characters[i].type)) {
        // types[characters[i].type] = types[characters[i].type] + 1
        counts[types.indexOf(characters[i].type)]++;
      } else {
        // types[characters[i].type] = 1
        types.push(characters[i].type)
        counts.push(1);
      }
    }

    setTypeData(types);
    setCountData(counts)
  }

  const handleSubmit = async (event, name) => {
    event.preventDefault(); //credit: chatgpt for debugging page refresh
    if (name.length === 0) {
      alert("Please enter a the name of a Nintendo character!");
      return;
    }

    const potentialURL = "https://www.amiiboapi.com/api/amiibo/?name=" + name;

    try {
      const response = await fetch(potentialURL);
      const data = await response.json()
      if (data.amiibo && data.amiibo.length > 0) { 
        setURL(potentialURL);
        setLastValidCharacter(name.toLowerCase());
        setCharacters(data.amiibo);
      } else {
        alert("Please enter a valid Nintendo character!");
      }
    } catch (error) {
      alert("Error fetching data: " + error);
      console.log(error);
    } finally {
      setCharacterName("");
      setTypeData([]);
      setCountData([]);
    }
  }

  const addFavorite = () => {
    if (favorites.includes(lastValidCharacter)) {
      alert("You have already favorited " + lastValidCharacter + "!")
    } else {
      setFavorites([...favorites, lastValidCharacter])
    }
  }

  useEffect(() => {
    fetch(amiiboURL)
      .then((response) => response.json())
      .then((data) => setCharacters(data.amiibo))
      .catch((error) => alert(error))
  }, [amiiboURL]);

  return (
    <div>
      {/* for icon buttons (credit below) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

      <h1 className="title">NINTENDO WIKI</h1>

      <div className='search'>
        <form onSubmit={(e) => {handleSubmit(e, characterName)}}>
          <input
            type="text"
            value={characterName}
            onChange={e => setCharacterName(e.target.value.toLowerCase())}
            placeholder="Search Nintendo Character"
            size="100"
          />
        </form>
        {/* credit: icon buttons https://www.w3schools.com/howto/howto_css_icon_buttons.asp */}
        <button onClick={(e) => {handleSubmit(e, characterName)}} type="submit" className="search_button"><i class="fa fa-search"></i></button>
        <button onClick={addFavorite} className="search_button"><i class="fa fa-plus"></i></button>
      </div>

      <div className="favorites">
        {favorites.map((favorite) => (
          <div>
            <button onClick={(e) => {handleSubmit(e, favorite)}} className='favorite_button'> {favorite.toUpperCase()} </button>
          </div>
        ))}
      </div>

      <hr/>

      <div className='character_stats'>
        <h2 className='character_title'>{lastValidCharacter.toUpperCase()}</h2>
        <button className='stats_button' onClick={getStatData}><i class="fa fa-info"></i></button> <br/>
      </div>

      <div className="character_info">
        {typeData.map((type, index) => (
          <div>
            <h4 className="stats_text">{type}(s): {countData[index]}</h4>
          </div>
        ))}
      </div>
      
      <div className="characters">
        {characters.map((character) => (
          <div>
            <Character name={character.name} image={character.image} amiiboSeries={character.amiiboSeries} gameSeries={character.gameSeries} type={character.type}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
