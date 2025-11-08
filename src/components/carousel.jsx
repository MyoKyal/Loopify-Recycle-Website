import React from "react";

export default function Carousel() {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      <div className="carousel-inner mt-1">
        {/* Slide 1 */}
        <div className="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1013"
            className="d-block w-100"
            alt="E-Waste"
            onError={e => (e.currentTarget.src = "https://placehold.co/1920x1080/CCCCCC/000000?text=E-Waste+Recycling")}
          />
          <div className="carousel-caption d-block fs-5">
            <h5>Recycle your e-waste responsibly.</h5>
            <p>We ensure zero landfill waste for all electronics returned.</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <img
            src="https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?cs=srgb&dl=pexels-mali-802221.jpg&fm=jpg"
            className="d-block w-100"
            alt="Clothing"
            onError={e => (e.currentTarget.src = "https://placehold.co/1920x1080/CCCCCC/000000?text=Clothing+Donation")}
          />
          <div className="carousel-caption d-block fs-5">
            <h5>A sustainable future for fashion.</h5>
            <p>Donate or recycle old clothing for store credit.</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870"
            className="d-block w-100"
            alt="Packaging"
            onError={e => (e.currentTarget.src = "https://placehold.co/1920x1080/CCCCCC/000000?text=Packaging+Returns")}
          />
          <div className="carousel-caption d-block fs-5">
            <h5>Packaging that never goes to waste.</h5>
            <p>Return branded packaging and earn cash rewards.</p>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}