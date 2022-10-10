import "./App.css";
import SentimentalText from "./SentimentalText";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ul
          style={{
            listStyle: "none",
            padding: 5,
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            maxHeight: "25vh",
          }}
        >
          <li>
            <SentimentalText text="This is a great product" />
          </li>
          <li>
            <SentimentalText text="Does not work as i've expected" />
          </li>
          <li>
            <SentimentalText text="A very evil person" />
          </li>
          <li>
            <SentimentalText text="I would recommend it to a friend" />
          </li>
          <li>
            <SentimentalText text="Very noisy and low quality" />
          </li>
          <li>
            <SentimentalText text="Always lying to his mates" />
          </li>
        </ul>
      </header>
    </div>
  );
}

export default App;
