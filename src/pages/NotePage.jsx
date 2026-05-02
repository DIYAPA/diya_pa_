import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseFrontmatter } from '../utils/frontmatter';

export default function NotePage() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const loadNote = async () => {
      const markdownFiles = import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default' });
      const targetPath = `../content/notes/${slug}.md`;
      
      if (markdownFiles[targetPath]) {
        const fileContent = await markdownFiles[targetPath]();
        const parsed = parseFrontmatter(fileContent);
        setNote({
          title: parsed.attributes.title || slug,
          date: parsed.attributes.date || '',
          content: parsed.body,
        });
      } else {
        setNote({ title: 'Note not found', date: '', content: 'The note you are looking for does not exist.' });
      }
    };

    loadNote();
  }, [slug]);

  if (!note) return <div>Loading...</div>;

  return (
    <article>
      <Link to="/" className="back-link">Home</Link>
      
      <header className="note-header">
        <h1>{note.title}</h1>
        {note.date && <div className="note-meta">{note.date}</div>}
      </header>
      
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {note.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
