import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";
let idCounter = 0;

function App() {
  const [textValue, setTextValue] = useState("");
  const [results, setResults] = useState([]);
  const [collection, setCollection] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const createGifsList = (response) => {
    const gifArr = response.data.data.map((row) => {
      return row.images.fixed_height.mp4;
    });

    setResults(
      gifArr.map((row) => {
        idCounter++;
        return <Item key={idCounter} url={row}></Item>;
      })
    );

    console.log(1);

    setTimeout(() => {
      console.log(2);
      setCollection(collection.concat(results));
    }, 0);
  };

  useEffect(() => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=3&rating=g`
      )
      .then((response) => {
        setResults([]);
        console.log("promise fufilled");
        console.log(response);

        createGifsList(response);
      })
      .catch((error) => {
        alert(`Error: ${error}.`);
      });
  }, []);

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();

    if (textValue.length === 0) {
      alert("The input field is empty!");
      setTextValue("Type a value here!");
      return;
    } else {
      console.log("Input value length != 0");
      const encodedQueryParam = encodeURIComponent(textValue);

      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodedQueryParam}&limit=25&offset=0&rating=g&lang=en`
        )
        .then((response) => {
          setResults([]);
          console.log("promise fufilled");
          console.log(response);

          createGifsList(response);
        })
        .catch((error) => {
          alert(`Error: ${error}.`);
        });

      setTextValue("");
    }
  };

  const gifsToShow = showAll ? collection : results;

  return (
    <div className="App">
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Query Results" : "Show Entire Collection"}
      </button>
      <h1>Giphy App</h1>
      <form onSubmit={handleInputSubmit}>
        <input value={textValue} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      <div className="GifsList">{gifsToShow}</div>
    </div>
  );
}

export default App;
