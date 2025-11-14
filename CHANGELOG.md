# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- Add search & filter feature for messages: filter by name, email, and date range (`public/admin.html`, `public/js/admin.js`).
- Add "Terapkan Filter" and "Reset" buttons to apply or clear filters on the admin dashboard.
- Real-time filtering on input (keyup event on filter fields).
- Add admin message details modal with Reply and Copy email buttons (`public/admin.html`, `public/js/admin.js`).
- Add reply via `mailto:` functionality to quickly open the admin's mail client with subject and prefilled body.
- Add bulk actions: bulk delete and bulk export to CSV for selected messages.
- Add simple analytics counters (total messages and total visitors) on the admin dashboard.
- Add activity log stored in localStorage for admin actions (delete, export).

## [2025-11-14] - Unreleased

- Add search & filter feature for admin messages.

## [2025-11-11] - Unreleased

- Initial edits and improvements for admin dashboard and tooling.
