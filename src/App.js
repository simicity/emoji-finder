import React from 'react';
import { useEffect, useState } from 'react';
import API_KEY from './config';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchGroup, setSearchGroup] = useState({
    groups: [
      {id: "all", name: "All"},
      {id: "smileys_emotion", name: "Faces"},
      {id: "people_body", name: "People"},
      {id: "component", name: "Component"},
      {id: "animals_nature", name: "Animal & Nature"},
      {id: "food_drink", name: "Food & Drink"},
      {id: "travel_places", name: "Travel"},
      {id: "activities", name: "Activities"},
      {id: "objects", name: "Objects"},
      {id: "symbols", name: "Symbols"},
      {id: "flags", name: "Flags"},
    ],
    selected: "all"
  });
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.api-ninjas.com/v1/emoji?${searchTerm.length > 0 ? "name=" + searchTerm : ""}${searchTerm.length > 0 && searchGroup.selected !== "all" ? "&" : ""}${searchGroup.selected !== "all" ? "group=" + searchGroup.selected : ""}`,
          {
            headers: {
              'X-Api-Key': API_KEY
            }
          }
        );
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    }
    if (searchTerm.length > 0 || searchGroup.selected !== "all") {
      fetchData();
    }
  }, [searchTerm, searchGroup.selected])

  return (
    <div className="mx-5 my-4">
      <h1 className="d-flex justify-content-center m-4">Emoji Finder 👩🏻‍💻</h1>
      <div className="d-flex justify-content-center mb-5">
        <form style={{ width: "350px" }}>
          <input
            className="d-flex justify-content-center form-control"
            type="text"
            value={searchTerm}
            placeholder="Search by keywords"
            onChange={event => setSearchTerm(event.target.value)}
          />
        </form>
        <select 
          className="form-select mx-3"
          style={{ width: "200px" }}
          value={searchGroup.selected}
          onChange={(event) => {
            event.persist();
            setSearchGroup((prev) => ({
              ...prev,
              selected: event.target.value
            }));
          }}
        >
          {searchGroup.groups.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      {error && 
        <div className="d-flex justify-content-center">{error.message}</div>
      }
      {isLoading
      ? <div className="d-flex justify-content-center">Loading...</div>
      : (
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {searchResults.map(result => (
              <div key={result.id} className="col">
                <div className="card">
                  <div className="d-flex justify-content-center card-body">
                    {result.name} {result.character}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default App;
