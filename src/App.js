import { useState } from 'react';

export default function BookLibrary() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [closeBtnHovered, setCloseBtnHovered] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [readingStatus, setReadingStatus] = useState({});
  const [downloadCount, setDownloadCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filterView, setFilterView] = useState('all');

  const allBooks = [
    {
      id: 1,
      title: 'Mastering Life Skills',
      category: 'Life Skills',
      author: 'Dr. Sarah Johnson',
      pages: 245,
      description: 'A comprehensive guide to essential life skills including communication, time management, financial literacy, and emotional intelligence. Perfect for young adults starting their journey.',
      file: 'books/book1.pdf'
    },
    {
      id: 2,
      title: 'Growth Mindset Stories',
      category: 'Personal Growth',
      author: 'Michael Chen',
      pages: 189,
      description: 'Inspiring real-life stories of individuals who transformed their lives through perseverance, learning, and a growth mindset. Learn from their challenges and triumphs.',
      file: 'books/book2.pdf'
    },
    {
      id: 3,
      title: 'Career Development Blueprint',
      category: 'Career',
      author: 'Amanda Williams',
      pages: 312,
      description: 'Strategic approaches to career planning, networking, personal branding, and professional development. Includes practical exercises and actionable steps.',
      file: 'books/book3.pdf'
    },
    {
      id: 4,
      title: 'Financial Freedom Guide',
      category: 'Life Skills',
      author: 'Robert Martinez',
      pages: 278,
      description: 'Learn the fundamentals of personal finance, budgeting, investing, and building wealth. Written in clear, accessible language for beginners.',
      file: 'books/book4.pdf'
    },
    {
      id: 5,
      title: 'The Art of Communication',
      category: 'Personal Growth',
      author: 'Emily Thompson',
      pages: 198,
      description: 'Master the art of effective communication in both personal and professional settings. Includes body language, active listening, and conflict resolution.',
      file: 'books/book5.pdf'
    },
    {
      id: 6,
      title: 'Leadership Essentials',
      category: 'Career',
      author: 'James Anderson',
      pages: 265,
      description: 'Develop your leadership potential with proven strategies for team management, decision-making, and inspiring others to achieve their best.',
      file: 'books/book6.pdf'
    }
  ];

  const categories = ['All', ...new Set(allBooks.map(book => book.category))];

  const toggleFavorite = (bookId) => {
    setFavorites(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const setBookStatus = (bookId, status) => {
    setReadingStatus(prev => ({
      ...prev,
      [bookId]: prev[bookId] === status ? null : status
    }));
    
    if (status === 'completed' && readingStatus[bookId] !== 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleDownload = () => {
    setDownloadCount(prev => prev + 1);
  };

  const getFilteredBooks = () => {
    let filtered = allBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filterView === 'favorites') {
      filtered = filtered.filter(book => favorites.includes(book.id));
    } else if (filterView === 'wantToRead') {
      filtered = filtered.filter(book => readingStatus[book.id] === 'wantToRead');
    } else if (filterView === 'reading') {
      filtered = filtered.filter(book => readingStatus[book.id] === 'reading');
    } else if (filterView === 'completed') {
      filtered = filtered.filter(book => readingStatus[book.id] === 'completed');
    }

    return filtered;
  };

  const filteredBooks = getFilteredBooks();

  const stats = {
    total: allBooks.length,
    downloads: downloadCount,
    favorites: favorites.length,
    wantToRead: Object.values(readingStatus).filter(s => s === 'wantToRead').length,
    reading: Object.values(readingStatus).filter(s => s === 'reading').length,
    completed: Object.values(readingStatus).filter(s => s === 'completed').length
  };

  const getStatusBadge = (bookId) => {
    const status = readingStatus[bookId];
    if (!status) return null;
    
    const statusInfo = {
      wantToRead: { text: '📚 Want to Read', color: '#9ac5f4' },
      reading: { text: '📖 Reading', color: '#ffa94d' },
      completed: { text: '✓ Completed', color: '#69db7c' }
    };
    
    return statusInfo[status];
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: '#fff9ed', color: '#503c17', margin: 0, minHeight: '100vh', padding: 0 }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                left: `${Math.random() * 100}%`,
                background: ['#f7c948', '#c08d52', '#69db7c', '#ffa94d', '#9ac5f4'][Math.floor(Math.random() * 5)],
                animation: `confettiFall 3s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <div style={{ background: '#f7c948', textAlign: 'center', color: '#503c17', fontWeight: 'bold', padding: '10px 0', fontSize: '1.05em', letterSpacing: '0.04em', boxShadow: '0 1px 8px rgba(0,0,0,.04)', animation: 'slideDown 0.5s ease-out' }}>
        Home of readers
      </div>
      
      <div style={{ background: 'linear-gradient(90deg, #fff9ed 70%, #ecd9b2 100%)', textAlign: 'center', padding: '38px 0 26px 0', color: '#614a22', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div 
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#f7c948',
            boxShadow: '0 1px 6px rgba(0,0,0,.09)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            animation: 'fadeIn 0.8s ease-out',
            transform: logoHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
            boxShadow: logoHovered ? '0 4px 12px rgba(247, 201, 72, 0.4)' : '0 1px 6px rgba(0,0,0,.09)'
          }}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img 
            src="/Book Project.jpg" 
            alt="Life-course Learning Community" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h1 style={{ margin: '6px 0', fontSize: '2em', fontWeight: 'bold', color: '#503c17', textShadow: '1px 1px 4px #ecd9b2', animation: 'fadeIn 1s ease-out' }}>
          Life-course Learning Library
        </h1>
        <p style={{ fontSize: '1.08em', color: '#614a22', margin: 0, animation: 'fadeIn 1.2s ease-out' }}>
          Skills, books, and lifelong connections. Download resources below!
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', animation: 'fadeInUp 0.5s ease-out' }}>
        <div style={{ background: '#fff', border: '2px solid #ecd9b2', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(247, 201, 72, 0.1)' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#c08d52', margin: '5px 0' }}>{stats.total}</div>
          <div style={{ fontSize: '0.95em', color: '#614a22', fontWeight: '500' }}>📚 Total Books</div>
        </div>
        <div style={{ background: '#fff', border: '2px solid #ecd9b2', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(247, 201, 72, 0.1)' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#c08d52', margin: '5px 0' }}>{stats.downloads}</div>
          <div style={{ fontSize: '0.95em', color: '#614a22', fontWeight: '500' }}>⬇️ Downloads</div>
        </div>
        <div style={{ background: '#fff', border: '2px solid #ecd9b2', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(247, 201, 72, 0.1)' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#c08d52', margin: '5px 0' }}>{stats.favorites}</div>
          <div style={{ fontSize: '0.95em', color: '#614a22', fontWeight: '500' }}>❤️ Favorites</div>
        </div>
        <div style={{ background: '#fff', border: '2px solid #ecd9b2', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(247, 201, 72, 0.1)' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#c08d52', margin: '5px 0' }}>{stats.reading}</div>
          <div style={{ fontSize: '0.95em', color: '#614a22', fontWeight: '500' }}>📖 Reading</div>
        </div>
        <div style={{ background: '#fff', border: '2px solid #ecd9b2', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(247, 201, 72, 0.1)' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#c08d52', margin: '5px 0' }}>{stats.completed}</div>
          <div style={{ fontSize: '0.95em', color: '#614a22', fontWeight: '500' }}>✓ Completed</div>
        </div>
      </div>

      <section style={{ maxWidth: '900px', margin: '28px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: '1.33em', background: '#f7c948', color: '#503c17', display: 'inline-block', padding: '5px 18px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,.05)', marginBottom: '22px', animation: 'slideRight 0.6s ease-out' }}>
          📚 Available Books
        </h2>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', animation: 'fadeInUp 0.6s ease-out' }}>
          <input
            type="text"
            placeholder="🔍 Search books, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1', minWidth: '250px', padding: '12px 20px', fontSize: '1em', border: '2px solid #ecd9b2', borderRadius: '10px', background: '#fff', color: '#503c17', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '12px 20px', fontSize: '1em', border: '2px solid #ecd9b2', borderRadius: '10px', background: '#fff', color: '#503c17', cursor: 'pointer', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', fontWeight: '500' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? '📂 All Categories' : `📁 ${cat}`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', 'favorites', 'wantToRead', 'reading', 'completed'].map(view => {
            const labels = {
              all: `📚 All Books`,
              favorites: `❤️ Favorites (${stats.favorites})`,
              wantToRead: `📚 Want to Read (${stats.wantToRead})`,
              reading: `📖 Reading (${stats.reading})`,
              completed: `✓ Completed (${stats.completed})`
            };
            return (
              <button
                key={view}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #ecd9b2',
                  borderRadius: '8px',
                  background: filterView === view ? '#f7c948' : '#fff',
                  borderColor: filterView === view ? '#f7c948' : '#ecd9b2',
                  color: filterView === view ? '#503c17' : '#614a22',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.95em',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setFilterView(view)}
              >
                {labels[view]}
              </button>
            );
          })}
        </div>

        {filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a3874d', fontSize: '1.1em' }}>
            📭 No books found matching your criteria. Try different filters!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {filteredBooks.map((book, index) => {
              const statusBadge = getStatusBadge(book.id);
              const isHovered = hoveredCard === book.id;
              return (
                <div 
                  key={book.id} 
                  style={{
                    background: '#fff',
                    border: '1.5px solid' + (isHovered ? ' #f7c948' : ' #ecd9b2'),
                    borderRadius: '15px',
                    boxShadow: isHovered ? '0 8px 24px rgba(247, 201, 72, 0.25), 0 4px 16px rgba(0,0,0,0.08)' : '0 2px 14px rgba(247, 201, 72, 0.09), 0 1px 6px rgba(0,0,0,0.04)',
                    padding: '22px 18px 20px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 0.1}s`,
                    position: 'relative',
                    transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)'
                  }}
                  onMouseEnter={() => setHoveredCard(book.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <button
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.5em',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      zIndex: 10,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(book.id);
                    }}
                  >
                    {favorites.includes(book.id) ? '❤️' : '🤍'}
                  </button>
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#f7c948', color: '#503c17', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8em', fontWeight: '600' }}>
                    {book.category}
                  </div>
                  {statusBadge && (
                    <div style={{
                      position: 'absolute',
                      top: '45px',
                      left: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75em',
                      fontWeight: '600',
                      background: statusBadge.color,
                      color: '#fff'
                    }}>
                      {statusBadge.text}
                    </div>
                  )}
                  <div style={{
                    fontWeight: 600,
                    fontSize: '1.18em',
                    marginBottom: '8px',
                    marginTop: '35px',
                    color: isHovered ? '#f7c948' : '#614a22',
                    transition: 'color 0.2s ease'
                  }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: '0.95em', color: '#a3874d', marginBottom: '8px', opacity: 0.79 }}>
                    ✍️ {book.author} • 📄 {book.pages} pages
                  </div>
                  <div style={{ fontSize: '0.92em', color: '#614a22', marginBottom: '15px', lineHeight: '1.5', flex: 1 }}>
                    {book.description.substring(0, 100)}...
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {['wantToRead', 'reading', 'completed'].map(status => {
                      const labels = { wantToRead: '📚 Want', reading: '📖 Reading', completed: '✓ Done' };
                      const isActive = readingStatus[book.id] === status;
                      return (
                        <button
                          key={status}
                          style={{
                            flex: 1,
                            minWidth: '80px',
                            padding: '6px 10px',
                            fontSize: '0.8em',
                            border: '1.5px solid' + (isActive ? ' #c08d52' : ' #ecd9b2'),
                            borderRadius: '6px',
                            background: isActive ? '#c08d52' : '#fff',
                            color: isActive ? '#fff' : '#614a22',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookStatus(book.id, status);
                          }}
                        >
                          {labels[status]}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <button
                      style={{
                        flex: 1,
                        background: hoveredBtn === `preview-${book.id}` ? '#c08d52' : '#fff',
                        color: hoveredBtn === `preview-${book.id}` ? '#fff' : '#c08d52',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        border: '2px solid #c08d52',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        transform: hoveredBtn === `preview-${book.id}` ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredBtn(`preview-${book.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      onClick={() => setSelectedBook(book)}
                    >
                      👁️ Preview
                    </button>
                    <a 
                      href={book.file} 
                      style={{
                        flex: 1,
                        background: hoveredBtn === `download-${book.id}` ? 'linear-gradient(135deg, #c08d52 0%, #a67643 100%)' : 'linear-gradient(135deg, #d4a574 0%, #c08d52 100%)',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.95em',
                        boxShadow: hoveredBtn === `download-${book.id}` ? '0 5px 15px rgba(192, 141, 82, 0.5)' : '0 3px 8px rgba(192, 141, 82, 0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'inline-block',
                        textAlign: 'center',
                        transform: hoveredBtn === `download-${book.id}` ? 'scale(1.05)' : 'scale(1)',
                        letterSpacing: hoveredBtn === `download-${book.id}` ? '0.02em' : 'normal'
                      }}
                      onMouseEnter={() => setHoveredBtn(`download-${book.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      download
                      onClick={handleDownload}
                    >
                      ⬇️ Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedBook && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(80, 60, 23, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', animation: 'fadeIn 0.3s ease-out' }} onClick={() => setSelectedBook(null)}>
          <div style={{ background: '#fff9ed', borderRadius: '20px', padding: '35px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', animation: 'scaleIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <button 
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: closeBtnHovered ? '#c08d52' : '#f7c948',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                fontSize: '1.3em',
                cursor: 'pointer',
                color: closeBtnHovered ? '#fff' : '#503c17',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: closeBtnHovered ? 'rotate(90deg)' : 'rotate(0deg)'
              }}
              onClick={() => setSelectedBook(null)}
              onMouseEnter={() => setCloseBtnHovered(true)}
              onMouseLeave={() => setCloseBtnHovered(false)}
            >
              ×
            </button>
            <div style={{ background: '#f7c948', color: '#503c17', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8em', fontWeight: '600', display: 'inline-block', marginBottom: '15px' }}>
              {selectedBook.category}
            </div>
            <h2 style={{ color: '#503c17', marginTop: '10px', fontSize: '1.8em' }}>
              {selectedBook.title}
            </h2>
            <p style={{ color: '#a3874d', fontSize: '1.05em', marginBottom: '20px' }}>
              ✍️ By {selectedBook.author} • 📄 {selectedBook.pages} pages
            </p>
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px',
              lineHeight: '1.7',
              color: '#614a22',
              border: '1.5px solid #ecd9b2'
            }}>
              <h3 style={{ color: '#503c17', marginTop: 0 }}>📖 About This Book</h3>
              <p>{selectedBook.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a 
                href={selectedBook.file}
                download
                onClick={handleDownload}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #d4a574 0%, #c08d52 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.05em',
                  boxShadow: '0 3px 8px rgba(192, 141, 82, 0.3)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                ⬇️ Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}