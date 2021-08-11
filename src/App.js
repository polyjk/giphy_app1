import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";
import Section from "./Section";

let itemIDCounter = 0;
let sectionIDCounter = 0;

function App() {
  const [textValue, setTextValue] = useState("");
  const [results, setResults] = useState([]);
  const [collection, setCollection] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const API_KEY = process.env.REACT_APP_API_KEY;

  //UseEffect hook for delayed search after typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (textValue !== "") {
        console.log("Input value length != 0");

        //Encode query parameters
        const encodedQueryParam = encodeURIComponent(textValue);

        axios
          .get(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodedQueryParam}&limit=25&offset=0&rating=g&lang=en`
          )
          .then((response) => {
            console.log("promise fufilled");
            console.log(response);

            createGifsList(response);
            setShowAll(false);
          })
          .catch((error) => {
            alert(`Error: ${error}.`);
          });
      }
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [textValue]); // eslint-disable-line react-hooks/exhaustive-deps

  //useEffect hook will request 3 trending gifs on initial render
  useEffect(() => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=3&rating=g`
      )
      .then((response) => {
        console.log("promise fufilled");
        console.log(response);

        createGifsList(response);
        setResults([]);
      })
      .catch((error) => {
        alert(`Error: ${error}.`);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createGifsList = (res) => {
    //Map through response data for just the mp4 url.
    const arrURL = res.data.data.map((row) => {
      return row.images.fixed_height.mp4;
    });

    //Create an array of Gif Item Components
    const arrGifItems = arrURL.map((row) => {
      itemIDCounter++;
      return <Item key={itemIDCounter} url={row}></Item>;
    });

    //Create Section Component
    sectionIDCounter++;
    const queryTextValue = textValue;
    const createSection = (
      <Section
        key={sectionIDCounter}
        headerText={queryTextValue === "" ? "Trending" : queryTextValue}
        itemArr={arrGifItems}
      ></Section>
    );

    //Update states: result, collection and reset state: text
    setResults(createSection);

    //Do not add to collection if this query is found.
    const existCheck = collection.find(
      (row) => row.props.headerText === queryTextValue
    );
    if (existCheck) {
      console.log("Query already added to collection.");
      return;
    }

    //Concat to collection and reset input text value
    setCollection(collection.concat(createSection));
    setTextValue("");
  };

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();

    if (textValue.length === 0) {
      alert("The input field is empty!");
      return;
    } else {
      console.log("Input value length != 0");

      //Encode query parameters
      const encodedQueryParam = encodeURIComponent(textValue);

      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodedQueryParam}&limit=25&offset=0&rating=g&lang=en`
        )
        .then((response) => {
          console.log("promise fufilled");
          console.log(response);

          createGifsList(response);
          setShowAll(false);
        })
        .catch((error) => {
          alert(`Error: ${error}.`);
        });
    }
  };

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

      <h2 className="DisplayTitleHeader">
        {showAll ? "Collection" : `Query Results`}
      </h2>

      <div>{showAll ? collection : results}</div>
    </div>
  );
}

export default App;
