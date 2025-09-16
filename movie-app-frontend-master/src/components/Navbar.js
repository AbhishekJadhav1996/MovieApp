import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand">🎬 MovieApp</span>
        <a href="#trending" className="nav-link">Trending</a>
        <a href="#top-rated" className="nav-link">Top Rated</a>
        <a href="#new" className="nav-link">New</a>
      </div>
      <div className="nav-right">
        <input className="nav-search" placeholder="Search movies..." />
      </div>
    </nav>
  );
};

export default Navbar;


