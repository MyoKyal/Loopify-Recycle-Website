import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-md">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#/">
          <img
            src="https://placehold.co/50x45/1C5C3F/ffffff?text=L"
            alt="Loopify Logo"
            className="me-3 rounded"
            width="50"
            height="45"
          />
          <span className="fw-bold fs-3">Loopify</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto fs-5">
            <li className="nav-item"><a className="nav-link" href="#/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#/about">About</a></li>
            <li className="nav-item"><a className="nav-link" href="#/contact">Contact</a></li>
            <li className="nav-item"><a className="nav-link" href="#/leaderboard">Leaderboard</a></li>
          </ul>

          <button className="btn btn-outline-primary mx-auto px-4 rounded-xl transition hover:shadow-lg">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}