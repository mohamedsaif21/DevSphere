'use client';

import React from 'react';

interface SidebarProps {
  filename: string;
}

export default function Sidebar({ filename }: SidebarProps) {
  return (
    <aside className="ds-sidebar">
      <div className="ds-section-label">Explorer</div>

      <div className="ds-file-item ds-file-active">
        <span className="material-symbols-outlined ds-file-icon">description</span>
        <span>{filename}</span>
      </div>

      <div className="ds-divider" />

      <div className="ds-section-label">Active Users</div>
      <div className="ds-avatars-row">
        <div className="ds-collab-av ds-av1">A</div>
        <div className="ds-collab-av ds-av2">B</div>
        <div className="ds-collab-av ds-av3">+2</div>
      </div>

      <div className="ds-sidebar-footer">
        <div className="ds-collab-card">
          <div className="ds-collab-label">Collaboration</div>
          <button className="ds-collab-btn">Coming Soon</button>
        </div>
      </div>
    </aside>
  );
}
