import React from 'react';

// --- Main App Component ---
// This component uses Bootstrap classes and injects responsive CSS
// to ensure the carousel images properly fill the screen,
// but with a smaller height on mobile devices.
function App() {
  const customStyles = `
    /* Global styles for body/html: Essential for full-height layouts */
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    /* Target the carousel container */
    #carouselExampleIndicators {
      /* DEFAULT (DESKTOP): Full height of viewport minus the navbar. */
      height: calc(100vh - 66px); 
      background-color: #f0f0f0b2; 
    }
    
    /* --- MOBILE RESPONSIVENESS FIX for Carousel Height --- */
    /* On screens 900px wide or less (to cover tablets and phones) */
    @media (max-width: 900px) {
        #carouselExampleIndicators {
            /* Reduce the height significantly for mobile phones to prevent overflow */
            height: 50vh; 
        }

        /* --- RESPONSIVE CAPTION FIX --- */
        /* Reduce font size for captions on smaller screens */
        .carousel-caption h5 {
            font-size: 1.25rem !important; /* Smaller heading */
        }
        .carousel-caption p {
            font-size: 0.8rem !important; /* Smaller paragraph text */
            /* Add background to improve readability on busy mobile screens */
            background-color: rgba(0, 0, 0, 0.5); 
            padding: 5px;
            border-radius: 4px;
        }
        
    }
    
    /* Ensure inner carousel elements take up the full calculated height */
    #carouselExampleIndicators .carousel-inner {
      height: 100%;
    }

    #carouselExampleIndicators .carousel-item {
      height: 100%;
    }

    /* CRITICAL RESPONSIVE FIX: Make the image scale correctly */
    #carouselExampleIndicators .carousel-item img {
      height: 100%; /* Take 100% of the calculated container height */
      width: 100%;  /* Take 100% of the screen width */
      /* object-fit: cover is key for RESPONSIVENESS: it scales the image to cover 
         the element while preserving its aspect ratio, cropping if necessary. */
      object-fit: cover;
    }
  `;

  return (
    <>
      {/* Inject custom CSS directly into the document */}
      <style>{customStyles}</style>

      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            {/* Using a placeholder image URL for the logo */}
            <img
              src="src/assets/logo.jpg"
              alt="Logo"
              className="me-3"
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
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Leaderboard
                </a>
              </li>
            </ul>

            <div className="d-flex">
              <button
                className="btn btn-outline-primary mx-auto px-4"
                type="button"
              >
                Login
              </button>
            </div>
          </div>
<<<<<<< HEAD
        )}
      </div>
    </nav>
  );
}
=======
        </div>
      </nav>

      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner mt-1">
          {/* Slides with large placeholder images */}
          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1013"
              className="d-block"
              alt="Slide 1"
              onError={(e) =>
                (e.target.src = `https://placehold.co/1920x1080/CCCCCC/000000?text=Image+Failed`)
              }
            />
            {/* FIXED: Removed d-none d-md-block to show caption on all screens */}
            <div className="carousel-caption d-block fs-5"> 
              <h5>First slide label</h5>
              <p>
                Some representative placeholder content for the first slide.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?cs=srgb&dl=pexels-mali-802221.jpg&fm=jpg"
              className="d-block"
              alt="Slide 2"
              onError={(e) =>
                (e.target.src = `https://placehold.co/1920x1080/CCCCCC/000000?text=Image+Failed`)
              }
            />
             {/* FIXED: Removed d-none d-md-block to show caption on all screens */}
             <div className="carousel-caption d-block fs-5">
              <h5>Second slide label</h5>
              <p>
                Some representative placeholder content for the first slide.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
              className="d-block"
              alt="Slide 3"
              onError={(e) =>
                (e.target.src = `https://placehold.co/1920x1080/CCCCCC/000000?text=Image+Failed`)
              }
            />
             {/* FIXED: Removed d-none d-md-block to show caption on all screens */}
             <div className="carousel-caption d-block fs-5">
              <h5>Third slide label</h5>
              <p>
                Some representative placeholder content for the first slide.
              </p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}

export default App;
>>>>>>> origin/yoon_firebase
