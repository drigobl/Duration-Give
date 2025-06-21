import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DocumentationLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DocumentationSidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside className="docs-sidebar">
      <div className="sidebar-content">
        <nav>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Legal & Governance</h3>
            <ul className="sidebar-list">
              <li>
                <Link 
                  to="/governance" 
                  className={`sidebar-sublink ${isActive('/governance') ? 'active' : ''}`}
                >
                  Protocol Governance
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal" 
                  className={`sidebar-sublink ${isActive('/legal') ? 'active' : ''}`}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className={`sidebar-sublink ${isActive('/privacy') ? 'active' : ''}`}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Platform</h3>
            <ul className="sidebar-list">
              <li>
                <Link to="/" className="sidebar-sublink">
                  Return to App
                </Link>
              </li>
              <li>
                <a 
                  href="https://giveprotocol.github.io/Duration-Give/" 
                  className="sidebar-sublink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({
  children,
  title,
  description
}) => {
  return (
    <div className="docs-wrapper">
      <DocumentationSidebar />
      <main className="doc-main">
        <div className="doc-container">
          <header className="doc-header">
            <h1 className="doc-title">{title}</h1>
            {description && (
              <p className="doc-description">{description}</p>
            )}
          </header>
          <div className="doc-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentationLayout;