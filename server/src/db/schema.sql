CREATE TABLE IF NOT EXISTS collaborators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT,
    profession TEXT NOT NULL,
    bio TEXT,
    what_makes_special TEXT,
    notable_achievements TEXT,
    profile_image_url TEXT,

    instagram_handle TEXT,
    instagram_followers INTEGER DEFAULT 0,
    tiktok_handle TEXT,
    tiktok_followers INTEGER DEFAULT 0,
    youtube_handle TEXT,
    youtube_followers INTEGER DEFAULT 0,
    twitter_handle TEXT,
    twitter_followers INTEGER DEFAULT 0,

    email TEXT,
    phone TEXT,
    manager_name TEXT,
    manager_email TEXT,
    manager_phone TEXT,

    contact_status TEXT NOT NULL DEFAULT 'not_contacted',
    contact_method TEXT,
    project_phase TEXT NOT NULL DEFAULT 'research',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to TEXT,

    relevance_score REAL DEFAULT 0,
    total_followers INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collaborator_id INTEGER NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    method TEXT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'outbound',
    note TEXT NOT NULL,
    created_by TEXT,
    follow_up_date DATE,
    follow_up_done INTEGER DEFAULT 0,
    FOREIGN KEY (collaborator_id) REFERENCES collaborators(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    results TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collab_country ON collaborators(country);
CREATE INDEX IF NOT EXISTS idx_collab_profession ON collaborators(profession);
CREATE INDEX IF NOT EXISTS idx_collab_status ON collaborators(contact_status);
CREATE INDEX IF NOT EXISTS idx_collab_phase ON collaborators(project_phase);
CREATE INDEX IF NOT EXISTS idx_collab_priority ON collaborators(priority);
CREATE INDEX IF NOT EXISTS idx_collab_relevance ON collaborators(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_contact_log_collab ON contact_log(collaborator_id);
CREATE INDEX IF NOT EXISTS idx_contact_log_followup ON contact_log(follow_up_date) WHERE follow_up_done = 0;
