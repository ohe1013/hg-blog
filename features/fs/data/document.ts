import { EXTERNAL_LINKS } from "@features/explorer/data";
import { FileData } from "../types";
import { iconDict } from "./icon";

export const document: FileData = {
  document_file_readme: {
    id: "document_file_readme",
    name: "Readme.txt",
    kind: "file",
    parentId: "document",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Document folder guide

This area contains:
- Public interaction files (guestbook/contact)
- Resume and profile notes
- Writing templates and operating checklists
- Useful external links`,
  },
  document_file_guestbook: {
    id: "document_file_guestbook",
    name: "Guestbook.txt",
    kind: "file",
    parentId: "document",
    iconUrl: iconDict.guestbook,
    type: "file",
    app: "guestbook",
    payload: "Open this file to sign the guestbook.",
  },
  document_file_contact: {
    id: "document_file_contact",
    name: "Contact.msg",
    kind: "file",
    parentId: "document",
    iconUrl: iconDict.contact,
    type: "file",
    app: "contact",
    payload: "Open this file to send a private message.",
  },
  document_file_resume: {
    id: "document_file_resume",
    name: "Resume Snapshot.txt",
    kind: "file",
    parentId: "document",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Role:
- Frontend focused software engineer

Interests:
- Product UX with strong implementation detail
- Content platforms and tooling
- Practical architecture for small teams`,
  },
  document_f_planning: {
    id: "document_f_planning",
    name: "Planning",
    kind: "folder",
    parentId: "document",
    children: [
      "document_file_roadmap",
      "document_file_article_backlog",
      "document_file_release_checklist",
    ],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  document_file_roadmap: {
    id: "document_file_roadmap",
    name: "Roadmap 2026.txt",
    kind: "file",
    parentId: "document_f_planning",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Roadmap:
- Q1: stabilize comments and feedback flows
- Q2: improve article discovery and archive UX
- Q3: better authoring and release process`,
  },
  document_file_article_backlog: {
    id: "document_file_article_backlog",
    name: "Article Backlog.txt",
    kind: "file",
    parentId: "document_f_planning",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Backlog:
- Caching and invalidation patterns in Next.js
- When to split Zustand stores
- Designing robust form APIs with anti-spam guards`,
  },
  document_file_release_checklist: {
    id: "document_file_release_checklist",
    name: "Release Checklist.txt",
    kind: "file",
    parentId: "document_f_planning",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Before release:
- Run lint and type check
- Verify desktop and mobile layouts
- Check key windows: article, guestbook, contact, comments
- Confirm links and metadata`,
  },
  document_f_templates: {
    id: "document_f_templates",
    name: "Templates",
    kind: "folder",
    parentId: "document",
    children: ["document_file_post_template", "document_file_retro_template"],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  document_file_post_template: {
    id: "document_file_post_template",
    name: "Post Template.md",
    kind: "file",
    parentId: "document_f_templates",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `# Title

## Problem

## Approach

## Trade-offs

## Result`,
  },
  document_file_retro_template: {
    id: "document_file_retro_template",
    name: "Retro Template.md",
    kind: "file",
    parentId: "document_f_templates",
    iconUrl: iconDict.notepad,
    type: "file",
    app: "notepad",
    payload: `Sprint retro

What went well:
- 

What did not:
- 

Next actions:
- `,
  },
  document_f_links: {
    id: "document_f_links",
    name: "Links",
    kind: "folder",
    parentId: "document",
    children: [
      "document_link_latest_article",
      "document_link_about",
      "document_link_github",
      "document_link_linkedin",
    ],
    iconUrl: iconDict.folder,
    type: "folder",
  },
  document_link_latest_article: {
    id: "document_link_latest_article",
    name: "Latest Article.notion",
    kind: "file",
    parentId: "document_f_links",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "2f5145eb576b806db310ffae54659a96",
  },
  document_link_about: {
    id: "document_link_about",
    name: "About Me.notion",
    kind: "file",
    parentId: "document_f_links",
    iconUrl: iconDict.notion,
    type: "notion",
    app: "article-viewer",
    pageId: "88d3fb4a1ab64838a9d755b69d7cb80e",
  },
  document_link_github: {
    id: "document_link_github",
    name: "GitHub.url",
    kind: "file",
    parentId: "document_f_links",
    iconUrl: iconDict.github,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.github,
    },
  },
  document_link_linkedin: {
    id: "document_link_linkedin",
    name: "LinkedIn.url",
    kind: "file",
    parentId: "document_f_links",
    iconUrl: iconDict.linkedIn,
    type: "external-link",
    app: "external-link-confirm",
    payload: {
      url: EXTERNAL_LINKS.linkedIn,
    },
  },
};
