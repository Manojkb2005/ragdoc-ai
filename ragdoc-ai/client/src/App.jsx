function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "20px",
          }}
        >
          🚧 Under Maintenance
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            lineHeight: "1.8",
            color: "#ffffff",
          }}
        >
          I'm currently fixing the <strong>PDF upload</strong> feature.
          <br />
          The application will be back online soon.
        </p>

        <p
          style={{
            marginTop: "25px",
            fontSize: "1rem",
            color: "#d1d5db",
          }}
        >
          Thank you for your patience! 😊
        </p>
      </div>
    </div>
  );
}

export default App;