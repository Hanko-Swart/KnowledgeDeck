export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const noteTemplates: NoteTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with a clean slate',
    content: '',
  },
  {
    id: 'research',
    name: 'Research Template',
    description: 'Template for research notes with structured sections',
    content: `<h1>Research Notes</h1>

<h2>Overview</h2>
<p>Brief description of the research topic...</p>

<h2>Key Points</h2>
<ul>
  <li>Point 1...</li>
  <li>Point 2...</li>
  <li>Point 3...</li>
</ul>

<h2>Research Questions</h2>
<ul class="task-list">
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Question 1...</label>
  </li>
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Question 2...</label>
  </li>
</ul>

<h2>Methodology</h2>
<p>Describe the research approach...</p>

<h2>Findings</h2>
<p>Document key findings...</p>

<h2>References</h2>
<ul>
  <li>Reference 1...</li>
  <li>Reference 2...</li>
</ul>`,
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Template for meeting minutes and action items',
    content: `<h1>Meeting Notes</h1>

<h2>Meeting Details</h2>
<ul>
  <li><strong>Date:</strong> [Date]</li>
  <li><strong>Time:</strong> [Time]</li>
  <li><strong>Location:</strong> [Location/Platform]</li>
  <li><strong>Attendees:</strong> [Names]</li>
</ul>

<h2>Agenda</h2>
<ol>
  <li>Topic 1...</li>
  <li>Topic 2...</li>
  <li>Topic 3...</li>
</ol>

<h2>Discussion Points</h2>
<ul>
  <li>Point 1...</li>
  <li>Point 2...</li>
</ul>

<h2>Action Items</h2>
<ul class="task-list">
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Task 1 - [Assignee] - [Due Date]</label>
  </li>
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Task 2 - [Assignee] - [Due Date]</label>
  </li>
</ul>

<h2>Next Steps</h2>
<p>Outline next steps and follow-up items...</p>`,
  },
  {
    id: 'project',
    name: 'Project Planning',
    description: 'Template for project planning and tracking',
    content: `<h1>Project Plan</h1>

<h2>Project Overview</h2>
<p>Brief description of the project...</p>

<h2>Objectives</h2>
<ul>
  <li>Objective 1...</li>
  <li>Objective 2...</li>
  <li>Objective 3...</li>
</ul>

<h2>Timeline</h2>
<ul class="task-list">
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Phase 1 - [Start Date] to [End Date]</label>
  </li>
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Phase 2 - [Start Date] to [End Date]</label>
  </li>
  <li class="task-list-item" data-type="taskItem">
    <label><input type="checkbox"> Phase 3 - [Start Date] to [End Date]</label>
  </li>
</ul>

<h2>Resources</h2>
<ul>
  <li>Resource 1...</li>
  <li>Resource 2...</li>
</ul>

<h2>Risks & Mitigation</h2>
<ul>
  <li><strong>Risk 1:</strong> Description... <br>Mitigation: ...</li>
  <li><strong>Risk 2:</strong> Description... <br>Mitigation: ...</li>
</ul>

<h2>Success Metrics</h2>
<ul>
  <li>Metric 1...</li>
  <li>Metric 2...</li>
</ul>`,
  },
]; 