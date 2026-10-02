# Responsive Internship Board

A beginner-friendly responsive internship listing platform built using HTML, CSS, JavaScript, Node.js, Express.js and SQLite.

The platform allows users to browse internships, search by keywords, filter by domain and navigate through internship listings using pagination.

---

## Live Demo

### Frontend

[Live Internship Board](https://internship-board-1.onrender.com)

### Backend API

[Live REST API](https://internship-board-kgql.onrender.com)

### GitHub Repository

[GitHub Repository](https://github.com/mullapatinagalaxmi-2005/internship-board)

---

## Features

### Frontend

- Responsive design
- Desktop, tablet and mobile layouts
- Internship cards
- Search functionality
- Domain filtering
- Clear filters
- Pagination
- Empty state
- Error state
- Accessible form labels
- Keyboard-friendly controls
- Semantic HTML
- Dynamic internship rendering using JavaScript

### Backend

- Node.js
- Express.js
- REST API
- SQLite database
- CRUD operations
- Input validation
- Search
- Domain filtering
- Pagination
- CORS support
- Individual internship lookup
- Error handling

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- SQLite
- CORS

### Development Tools

- Visual Studio Code
- GitHub
- npm

### Deployment

- Render Static Site
- Render Web Service

---

## REST API

The backend provides a RESTful API for managing internship records.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/internships` | Get internships with pagination |
| GET | `/api/internships/:id` | Get a single internship |
| POST | `/api/internships` | Create a new internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |

---

## API Features

### Pagination

Example:

```text
GET /api/internships?page=1&limit=6
