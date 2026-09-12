export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Professional' | 'Corporate' | 'Engineering' | 'Management' | 'General';
  icon: string; // Lucide icon name
  badgeColor: string;
  defaultTitle: string;
  previewSnippet: string;
  content: string; // Formatted HTML for TipTap
}

export const TEMPLATES: DocTemplate[] = [
  {
    id: 'resume',
    title: 'Modern Software Engineer Resume',
    description: 'Clean, ATS-friendly tech resume with experience, technical skills matrix, and education.',
    category: 'Professional',
    icon: 'Briefcase',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    defaultTitle: 'Alex Rivera — Senior Software Engineer Resume',
    previewSnippet: 'Senior Full-Stack Engineer with 6+ years designing distributed systems, CRDT real-time engines...',
    content: `
      <h1>Alex Rivera</h1>
      <p><strong>Senior Software Engineer</strong> &bull; San Francisco, CA &bull; alex.rivera@example.com &bull; github.com/arivera &bull; (555) 234-5678</p>
      
      <hr />

      <h2>Professional Summary</h2>
      <p>Passionate Systems & Full-Stack Engineer with 6+ years of experience engineering high-throughput real-time collaboration engines, distributed data synchronization (CRDTs), and cloud-native architectures. Track record of scaling systems to 2M+ daily active users with 99.99% availability.</p>

      <h2>Core Technical Skills</h2>
      <table>
        <tbody>
          <tr>
            <th>Domain</th>
            <th>Technologies & Frameworks</th>
          </tr>
          <tr>
            <td><strong>Languages</strong></td>
            <td>TypeScript, Rust, Go, Python, SQL, C++</td>
          </tr>
          <tr>
            <td><strong>Frontend</strong></td>
            <td>React 19, Next.js 16, TipTap, Tailwind CSS, WebSockets, WebRTC</td>
          </tr>
          <tr>
            <td><strong>Distributed Systems</strong></td>
            <td>CRDTs (Yjs, Automerge), Event Sourcing, Kafka, Redis Cluster</td>
          </tr>
          <tr>
            <td><strong>Infrastructure</strong></td>
            <td>Kubernetes, Docker, AWS (ECS, S3, RDS), Terraform, GitHub Actions</td>
          </tr>
        </tbody>
      </table>

      <h2>Work Experience</h2>
      
      <h3>Staff Software Engineer &bull; CloudSync Systems</h3>
      <p><em>June 2022 – Present | San Francisco, CA</em></p>
      <ul>
        <li>Architected and shipped a peer-to-peer CRDT collaborative canvas powering 120,000 concurrent multi-user editing sessions with sub-20ms synchronization latency.</li>
        <li>Spearheaded transition from operational transformation (OT) to state-based CRDTs, reducing server CPU utilization by 42% and eliminating centralized merge locks.</li>
        <li>Mentored team of 8 engineers across frontend performance, web memory management, and distributed consistency protocols.</li>
      </ul>

      <h3>Senior Frontend Infrastructure Engineer &bull; HyperScale Labs</h3>
      <p><em>August 2019 – May 2022 | Austin, TX</em></p>
      <ul>
        <li>Built rich text and table editing primitives using TipTap and ProseMirror, serving 850k active weekly enterprise documents.</li>
        <li>Optimized virtualized rendering pipelines, reducing Input Delay (INP) by 64% on low-spec client hardware.</li>
        <li>Collaborated with design and security teams to implement end-to-end encrypted document sharing.</li>
      </ul>

      <h2>Education</h2>
      <p><strong>B.S. in Computer Science</strong> &bull; University of California, Berkeley &bull; <em>2015 – 2019</em></p>
      <p>Honors: Dean's Honor List, Magna Cum Laude</p>
    `,
  },
  {
    id: 'leave-letter',
    title: 'Formal Leave Application',
    description: 'Standard corporate formal leave request with handover details, emergency contact, and approval block.',
    category: 'Corporate',
    icon: 'Mail',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultTitle: 'Leave Application — Formal Request',
    previewSnippet: 'Formal application requesting planned annual leave with project coverage delegation and contact availability...',
    content: `
      <h1>Formal Leave Application</h1>
      <p><strong>Date:</strong> October 14, 2026</p>
      <p><strong>To:</strong> Department Head / People Operations</p>
      <p><strong>From:</strong> Alex Rivera &bull; Senior Software Engineer (Engineering Team)</p>
      <p><strong>Subject:</strong> Application for Planned Annual Leave</p>

      <hr />

      <h2>Reason & Duration of Leave</h2>
      <p>Dear Management Team,</p>
      <p>I am writing to formally request approval for <strong>5 days</strong> of annual leave, commencing from <strong>Monday, November 2, 2026</strong>, to <strong>Friday, November 6, 2026</strong>. I will resume regular duties on Monday, November 9, 2026.</p>

      <h2>Schedule & Coverage Plan</h2>
      <table>
        <tbody>
          <tr>
            <th>Date Range</th>
            <th>Leave Type</th>
            <th>Covering Colleague</th>
            <th>Delegated Responsibility</th>
          </tr>
          <tr>
            <td>Nov 2 – Nov 3</td>
            <td>Annual Leave</td>
            <td>Sarah Jenkins (Tech Lead)</td>
            <td>Sprint Standups & Architecture Reviews</td>
          </tr>
          <tr>
            <td>Nov 4 – Nov 6</td>
            <td>Annual Leave</td>
            <td>Marcus Chen (Sr. Engineer)</td>
            <td>On-Call Escalations & PR Reviews</td>
          </tr>
        </tbody>
      </table>

      <h2>Handover & Availability</h2>
      <ul>
        <li>All current roadmap sprint tasks for Sprint 42 have been merged and thoroughly verified in staging.</li>
        <li>Full documentation and deployment runbooks for the CRDT relay cluster have been handed over to Sarah Jenkins.</li>
        <li>In the event of an urgent, mission-critical incident, I can be reached via phone at <strong>+1 (555) 234-5678</strong> or personal email.</li>
      </ul>

      <p>Thank you for considering and approving this leave request.</p>
      
      <p>Sincerely,</p>
      <p><strong>Alex Rivera</strong><br />Senior Software Engineer &bull; Converge Engineering Team</p>
    `,
  },
  {
    id: 'software-rfc',
    title: 'Software Architecture RFC',
    description: 'Comprehensive Request for Comments (RFC) design doc for technical proposals, data schemas, and trade-offs.',
    category: 'Engineering',
    icon: 'Cpu',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    defaultTitle: 'RFC-104: Real-Time CRDT State Synchronization Protocol',
    previewSnippet: 'Design document proposing a causal vector-clock CRDT state synchronization protocol for offline-first clients...',
    content: `
      <h1>RFC-104: Real-Time CRDT State Synchronization Protocol</h1>
      <p><strong>Author:</strong> Alex Rivera &bull; <strong>Status:</strong> Under Review &bull; <strong>Date:</strong> October 2026</p>
      
      <hr />

      <h2>1. Executive Summary & Problem Statement</h2>
      <p>Currently, our collaborative document editor relies on state polling and optimistic locking, which results in merge conflicts during concurrent edits and high server load. This RFC proposes adopting an operation-based Conflict-free Replicated Data Type (CRDT) sequence engine paired with WebSocket and WebRTC mesh relays.</p>

      <h2>2. Architecture & Data Flow</h2>
      <table>
        <tbody>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
            <th>Role</th>
          </tr>
          <tr>
            <td><strong>Client Engine</strong></td>
            <td>Yjs / Fractional Indexing</td>
            <td>Deterministic local character ordering and vector clocks</td>
          </tr>
          <tr>
            <td><strong>Transport</strong></td>
            <td>WebSockets (Fallback: WebRTC)</td>
            <td>Sub-50ms delta broadcasting across room peers</td>
          </tr>
          <tr>
            <td><strong>Storage</strong></td>
            <td>SQLite / Postgres + S3 Snapshots</td>
            <td>Append-only operation log and compressed periodic checkpoints</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Technical Guarantees</h2>
      <ul>
        <li><strong>Strong Eventual Consistency:</strong> All connected peers converge to the identical state once all operations are applied, regardless of network order.</li>
        <li><strong>Offline-First Resilience:</strong> Clients can write disconnected indefinitely; delta compaction resolves cleanly upon reconnect.</li>
        <li><strong>Zero Data Loss:</strong> Causal dependency tracking prevents conflicting overwrites.</li>
      </ul>

      <h2>4. Security & Access Control</h2>
      <blockquote>"Zero-trust collaboration: Document delta payloads must be signed by the author's public key before relay distribution."</blockquote>
      <p>Room relay servers operate in blind-forwarding mode, verifying tenant authentication tokens without decrypting document contents.</p>

      <h2>5. Action Items & Timeline</h2>
      <ul>
        <li>[ ] Benchmark memory footprint for 500-page documents with 10k edits.</li>
        <li>[ ] Prototype WebSocket ephemeral presence channel for remote cursors.</li>
        <li>[ ] Conduct security audit on delta decompression routines.</li>
      </ul>
    `,
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes & Action Items',
    description: 'High-impact team sync notes with attendee roll, agenda discussion items, and an assigned action tracker.',
    category: 'Management',
    icon: 'Users',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    defaultTitle: 'Weekly Engineering Sync & Roadmap Review',
    previewSnippet: 'Meeting minutes capturing roadmap alignment, sprint retrospective decisions, and assigned action item table...',
    content: `
      <h1>Weekly Engineering Sync & Roadmap Review</h1>
      <p><strong>Date:</strong> October 12, 2026 &bull; <strong>Time:</strong> 10:00 AM – 10:45 AM PST &bull; <strong>Location:</strong> Google Meet / Converge Room #4</p>
      <p><strong>Attendees:</strong> Alex Rivera, Sarah Jenkins, Marcus Chen, Elena Rostova, David Kim</p>

      <hr />

      <h2>Agenda Topics</h2>
      <ol>
        <li>Q4 Sprint 42 Velocity and Release Candidates</li>
        <li>CRDT Collaborative Editor Latency Benchmarks</li>
        <li>Customer Feedback on Table Insertion & Outline Navigation</li>
        <li>Open Discussion & Infrastructure Blockers</li>
      </ol>

      <h2>Key Decisions</h2>
      <ul>
        <li><strong>Decision 1:</strong> Proceed with launching the interactive template gallery in the upcoming v1.2 release.</li>
        <li><strong>Decision 2:</strong> Standardize on vector clock state sync to support offline drafts before syncing with cloud databases.</li>
        <li><strong>Decision 3:</strong> Transition all enterprise client exports to direct client-side PDF and Markdown rendering.</li>
      </ul>

      <h2>Action Items Tracker</h2>
      <table>
        <tbody>
          <tr>
            <th>Status</th>
            <th>Task Description</th>
            <th>Owner</th>
            <th>Deadline</th>
          </tr>
          <tr>
            <td><strong>IN PROGRESS</strong></td>
            <td>Finalize Table styling and interactive 6x6 grid selector</td>
            <td>Alex Rivera</td>
            <td>Oct 15</td>
          </tr>
          <tr>
            <td><strong>TODO</strong></td>
            <td>Configure WebSocket server heartbeat and reconnection backoff</td>
            <td>Marcus Chen</td>
            <td>Oct 18</td>
          </tr>
          <tr>
            <td><strong>DONE</strong></td>
            <td>Update landing page with live dual-peer simulation demo</td>
            <td>Sarah Jenkins</td>
            <td>Oct 11</td>
          </tr>
        </tbody>
      </table>

      <h2>Notes & Discussion Highlights</h2>
      <blockquote>"Our primary competitive advantage is zero-latency local typing. The editor should never wait for network roundtrips to acknowledge keystrokes."</blockquote>
      <p>Next sync scheduled for Monday, October 19, 2026 at 10:00 AM PST.</p>
    `,
  },
  {
    id: 'weekly-report',
    title: 'Weekly Project Status Report',
    description: 'Executive project health report with milestone traffic lights, risks, blockers, and next week priorities.',
    category: 'Management',
    icon: 'TrendingUp',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultTitle: 'Weekly Project Status Report — Sprint 42',
    previewSnippet: 'Executive update summarizing progress on real-time sync, milestones health matrix, and team deliverables...',
    content: `
      <h1>Weekly Project Status Report — Sprint 42</h1>
      <p><strong>Project:</strong> Converge Real-Time Workspace &bull; <strong>Prepared by:</strong> Alex Rivera &bull; <strong>Period:</strong> Oct 5 – Oct 11, 2026</p>

      <hr />

      <h2>Executive Summary</h2>
      <p>Sprint 42 completed on schedule with 94% of planned story points delivered. The core editor canvas has reached production quality with full support for tables, collaborative cursors, and template generation. No critical security or stability regressions were reported.</p>

      <h2>Milestone Health Matrix</h2>
      <table>
        <tbody>
          <tr>
            <th>Milestone</th>
            <th>Health</th>
            <th>Target Completion</th>
            <th>Progress Notes</th>
          </tr>
          <tr>
            <td><strong>TipTap Table Extensions</strong></td>
            <td><span style="color: #10b981; font-weight: bold;">ON TRACK</span></td>
            <td>Oct 12</td>
            <td>6x6 interactive matrix grid implemented with guaranteed CSS borders.</td>
          </tr>
          <tr>
            <td><strong>Document Templates</strong></td>
            <td><span style="color: #10b981; font-weight: bold;">ON TRACK</span></td>
            <td>Oct 14</td>
            <td>Added Resume, Leave Letter, RFC, Meeting Notes, and Weekly Reports.</td>
          </tr>
          <tr>
            <td><strong>WebRTC P2P Sync Relay</strong></td>
            <td><span style="color: #f59e0b; font-weight: bold;">AT RISK</span></td>
            <td>Oct 24</td>
            <td>NAT traversal requires TURN fallback configuration.</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Accomplishments</h2>
      <ul>
        <li>Implemented full document outline navigation with dynamic heading jump links.</li>
        <li>Added multi-format export module supporting PDF printing, Markdown, and styled HTML.</li>
        <li>Reduced document initial load size by 30% with Turbopack chunk optimization.</li>
      </ul>

      <h2>Risks & Blockers</h2>
      <ul>
        <li><strong>TURN Server Costs:</strong> Estimated $200/mo increase if WebRTC direct connections exceed 70% relay fallback. Evaluating Cloudflare Calls.</li>
      </ul>

      <h2>Priorities for Next Week</h2>
      <ol>
        <li>Wire up WebSocket connection for collaborative room broadcasting.</li>
        <li>Implement SQLite snapshotting on server-side document close.</li>
      </ol>
    `,
  },
  {
    id: 'blank',
    title: 'Blank Document',
    description: 'Start from scratch with a clean, distraction-free document canvas.',
    category: 'General',
    icon: 'File',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    defaultTitle: 'Untitled Document',
    previewSnippet: 'Clean blank page ready for your notes, thoughts, and collaborative documents...',
    content: `
      <h1>Untitled Document</h1>
      <p>Start typing your thoughts, or press <strong>'/'</strong> for quick commands and formatting...</p>
    `,
  },
];

export function getAllTemplates(): DocTemplate[] {
  return TEMPLATES;
}

export function getTemplateById(id: string): DocTemplate | undefined {
  return TEMPLATES.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

export function getTemplatesByCategory(category: string): DocTemplate[] {
  if (category === 'All') return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}
