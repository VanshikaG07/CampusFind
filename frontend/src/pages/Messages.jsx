import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquareIcon, ArrowLeftIcon, UserIcon } from '../components/common/Icons';
import { mockUsers } from '../data/users';
import './Messages.css';

export default function Messages() {
  const { id } = useParams();

  // Simulated conversations list with campus peers
  const peerList = mockUsers.slice(1, 5);
  const activePeer = id ? mockUsers.find((u) => u.id === Number(id)) || peerList[0] : null;

  return (
    <div className="messages-page container fade-in">
      <div className="messages-layout-card">
        {/* Left Sidebar: Conversations */}
        <aside className="conversations-sidebar">
          <div className="conv-header">
            <h2 className="conv-title">Campus Messages</h2>
            <span className="conv-badge">Peer Connect</span>
          </div>

          <div className="conv-list">
            {peerList.map((peer) => {
              const isActive = activePeer?.id === peer.id;
              return (
                <Link
                  key={peer.id}
                  to={`/messages/${peer.id}`}
                  className={`conv-item ${isActive ? 'active' : ''}`}
                >
                  <div className="conv-avatar">
                    {peer.name[0]}
                  </div>
                  <div className="conv-meta">
                    <p className="conv-name">{peer.name}</p>
                    <p className="conv-preview">
                      {peer.department} • Handover coordination
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Right Area: Conversation view or placeholder */}
        <main className="messages-main-area">
          {activePeer ? (
            <div className="chat-placeholder-view">
              <div className="chat-view-header">
                <div className="chat-peer-info">
                  <div className="conv-avatar small">
                    {activePeer.name[0]}
                  </div>
                  <div>
                    <h3 className="chat-peer-name">{activePeer.name}</h3>
                    <p className="chat-peer-sub">
                      {activePeer.department} • {activePeer.college}
                    </p>
                  </div>
                </div>
                <Link to={`/profile/${activePeer.id}`} className="btn btn-secondary btn-sm">
                  View Student Profile
                </Link>
              </div>

              <div className="chat-body-empty">
                <div className="coming-soon-bubble">
                  <div className="bubble-icon">
                    <MessageSquareIcon size={28} />
                  </div>
                  <h4 className="bubble-title">Instant Campus Chat Coming Soon</h4>
                  <p className="bubble-text">
                    Direct real-time messaging with WebSocket support is being integrated with our FastAPI
                    backend. In the meantime, you can connect directly with {activePeer.name} via their
                    registered college email:
                  </p>
                  <div className="direct-email-pill">
                    <strong>{activePeer.email}</strong>
                  </div>
                  {activePeer.phone && (
                    <p className="phone-fallback">
                      Phone / WhatsApp: <strong>{activePeer.phone}</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="chat-composer-disabled">
                <input
                  type="text"
                  placeholder="Direct messaging will activate when backend WebSocket connects..."
                  disabled
                  className="chat-input-disabled"
                />
                <button type="button" className="btn btn-primary btn-sm" disabled>
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-empty-selection">
              <div className="empty-msg-icon">
                <MessageSquareIcon size={36} />
              </div>
              <h3 className="title-sm">Select a Conversation</h3>
              <p>Choose a student from the sidebar to view exchange details and direct contact info.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
