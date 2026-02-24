import { EXTERNAL_LINKS } from "@features/explorer/data";
import { FileData } from "../types";
import { iconDict } from "./icon";

export const computer: FileData = {
  computer_file_system_overview: {
    id: "computer_file_system_overview",
    name: "System Overview.txt",
    kind: "file",
    parentId: "computer",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `HG Desktop Environment

Purpose:
- Keep quick access to personal docs and active projects.
- Make the desktop feel like a real working machine, not a demo.

Main areas:
- Workspace: current focus and stack notes
- Projects: short snapshots of shipping projects
- Shortcuts: links to About, Articles, Guestbook, Contact, and socials`,
  },
  computer_file_start_here: {
    id: "computer_file_start_here",
    name: "Start Here.txt",
    kind: "file",
    parentId: "computer",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Quick start:
1) Open Workspace to see current priorities.
2) Open Projects to check what is being built.
3) Use Shortcuts for public pages and contact channels.`,
  },
  computer_f_workspace: {
    id: "computer_f_workspace",
    name: "Workspace",
    kind: "folder",
    parentId: "computer",
    children: [
      "computer_file_now",
      "computer_file_focus",
      "computer_file_stack",
    ],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  computer_file_now: {
    id: "computer_file_now",
    name: "Now.txt",
    kind: "file",
    parentId: "computer_f_workspace",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Current focus:
- Improve article reading flow
- Add lightweight comments per article
- Keep overall UI responsive on small screens`,
  },
  computer_file_focus: {
    id: "computer_file_focus",
    name: "Focus List.txt",
    kind: "file",
    parentId: "computer_f_workspace",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `This week:
- Tighten feedback UX (guestbook/contact/comments)
- Reduce dead-end links and empty folders
- Clean up copy and labels for consistency`,
  },
  computer_file_stack: {
    id: "computer_file_stack",
    name: "Tech Stack.txt",
    kind: "file",
    parentId: "computer_f_workspace",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Runtime:
- Next.js App Router
- React + TypeScript
- Zustand
- Firestore (feedback APIs)
- Notion API (article content)`,
  },
  computer_f_projects: {
    id: "computer_f_projects",
    name: "Projects",
    kind: "folder",
    parentId: "computer",
    children: [
      "computer_file_project_blog",
      "computer_file_project_feedback",
      "computer_file_project_portfolio",
    ],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  computer_file_project_blog: {
    id: "computer_file_project_blog",
    name: "Project Blog OS.txt",
    kind: "file",
    parentId: "computer_f_projects",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Windows 98 inspired personal blog.
Goal:
- Nostalgic shell + modern content workflow
- Notion powered writing with desktop metaphor`,
  },
  computer_file_project_feedback: {
    id: "computer_file_project_feedback",
    name: "Project Feedback.txt",
    kind: "file",
    parentId: "computer_f_projects",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Feedback modules:
- Guestbook: public notes
- Contact: private messages
- Comments: per-article discussion with hide/delete by password`,
  },
  computer_file_project_portfolio: {
    id: "computer_file_project_portfolio",
    name: "Project Portfolio.txt",
    kind: "file",
    parentId: "computer_f_projects",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Portfolio direction:
- Fewer filler pages
- More implementation detail
- Clear before/after decisions for each feature`,
  },
  computer_f_shortcuts: {
    id: "computer_f_shortcuts",
    name: "Shortcuts",
    kind: "folder",
    parentId: "computer",
    children: [
      "computer_shortcut_articles",
      "computer_shortcut_about",
      "computer_shortcut_guestbook",
      "computer_shortcut_contact",
      "computer_shortcut_github",
      "computer_shortcut_linkedin",
    ],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  computer_shortcut_articles: {
    id: "computer_shortcut_articles",
    name: "Latest Article.notion",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "2f5145eb576b806db310ffae54659a96",
  },
  computer_shortcut_about: {
    id: "computer_shortcut_about",
    name: "About Me.notion",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "88d3fb4a1ab64838a9d755b69d7cb80e",
  },
  computer_shortcut_guestbook: {
    id: "computer_shortcut_guestbook",
    name: "Guestbook.txt",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.guestbook,
    type: "file",
    app: "guestbook",
    payload: "Open guestbook window.",
  },
  computer_shortcut_contact: {
    id: "computer_shortcut_contact",
    name: "Contact.msg",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.contact,
    type: "file",
    app: "contact",
    payload: "Open contact window.",
  },
  computer_shortcut_github: {
    id: "computer_shortcut_github",
    name: "GitHub.url",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.github,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.github,
    },
  },
  computer_shortcut_linkedin: {
    id: "computer_shortcut_linkedin",
    name: "LinkedIn.url",
    kind: "file",
    parentId: "computer_f_shortcuts",
    iconUrl: iconDict.linkedIn,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.linkedIn,
    },
  },
};
