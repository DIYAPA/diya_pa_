import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotePage from './pages/NotePage';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes/:slug" element={<NotePage />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

export default App;
