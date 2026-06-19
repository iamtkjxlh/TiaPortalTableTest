import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="home-container">
      <h1>TIA Portal Demo</h1>
      <div className="nav-buttons">
        <Link to="/table-with-tree" className="nav-btn">
          Table With Tree
        </Link>
        <Link to="/table-without-tree" className="nav-btn">
          Table Without Tree
        </Link>
      </div>
    </div>
  )
}

export default App
