import "./App.css";
import { HeroLayout1, QuestionCardCollection } from "./ui-components";

function App() {
  return (
    <div className="App">
      <HeroLayout1 width={"100%"} />

      <QuestionCardCollection
        overrideItems={({ item }) => ({
          children: (
            <div style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.Text}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>✍ {item.Author}</p>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="ảnh minh hoạ"
                  style={{
                    marginTop: "0.5rem",
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          ),
        })}
      />
    </div>
  );
}

export default App;
