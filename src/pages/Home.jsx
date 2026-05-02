import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { parseFrontmatter } from '../utils/frontmatter';

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      // Import all markdown files as raw text
      const markdownFiles = import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default' });
      const loadedNotes = [];

      for (const path in markdownFiles) {
        const fileContent = await markdownFiles[path]();
        const parsed = parseFrontmatter(fileContent);
        const slug = path.split('/').pop().replace('.md', '');
        
        loadedNotes.push({
          slug,
          title: parsed.attributes.title || slug,
          date: parsed.attributes.date || '',
        });
      }

      // Sort by date descending
      loadedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotes(loadedNotes);
    };

    loadNotes();
  }, []);

  return (
    <>
      <Header />
      
      <section>
        <h2 className="section-title">Thoughts</h2>
        <ul className="notes-list">
          {notes.map(note => (
            <li key={note.slug} className="note-item">
              <Link to={`/notes/${note.slug}`} className="note-title">
                {note.title}
              </Link>
              <span className="note-date">{note.date}</span>
            </li>
          ))}
          {notes.length === 0 && <li className="note-item">No notes yet. Start writing!</li>}
        </ul>
      </section>
    </>
  );
}
