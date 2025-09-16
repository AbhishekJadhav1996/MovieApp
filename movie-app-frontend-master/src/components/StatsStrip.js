import React from "react";

const Stat = ({ value, label }) => (
  <div className="stat">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const StatsStrip = () => {
  return (
    <section className="stats-strip" aria-label="app stats">
      <Stat value={"10k+"} label="Movies" />
      <Stat value={"1k+"} label="Reviews" />
      <Stat value={"99.9%"} label="Uptime" />
    </section>
  );
};

export default StatsStrip;


