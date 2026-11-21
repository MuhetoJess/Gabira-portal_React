import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadDonations, loadAllUsers, formatRWF } from "../services/dataService";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({ total: 0, donors: 0, charities: 0 });

  useEffect(() => {
    Promise.all([loadDonations(), loadAllUsers()])
      .then(([donations, users]) => {
        const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        setStats({
          total,
          donors: users.donors.length,
          charities: users.charities.length
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const tabs = [
    { id: "all", label: "Featured" },
    { id: "disaster", label: "Disaster Response" },
    { id: "child", label: "Child Protection" },
    { id: "water", label: "Environment" },
    { id: "education", label: "Education" },
    { id: "health", label: "Health" }
  ];

  return (
    <main>
      <section className="hero-grid" aria-label="Featured causes">
        <Link
          to="/register"
          className="hero-tile hero-tile--featured hero-tile--flood"
          style={{ backgroundImage: "url('/images/rwanda_flood_relief.jpg')" }}
        >
          <span className="hero-tile__eyebrow">Rwanda</span>
          <span className="hero-tile__title">Rwanda Flood Relief Fund</span>
        </Link>
        <div className="hero-grid__side">
          <Link
            to="/register"
            className="hero-tile hero-tile--child"
            style={{ backgroundImage: "url('/images/Rwandan_children.png')" }}
          >
            <span className="tile-eyebrow">Kigali</span>
            <span className="tile-title">Hope for Children Rwanda &mdash; School Meals</span>
          </Link>
          <Link
            to="/register"
            className="hero-tile hero-tile--water"
            style={{ backgroundImage: "url('/images/Rwanda_clean_water.jpg')" }}
          >
            <span className="tile-eyebrow">Nyagatare</span>
            <span className="tile-title">Clean Water Initiative &mdash; Borehole Wells</span>
          </Link>
          <Link
            to="/register"
            className="hero-tile hero-tile--edu"
            style={{ backgroundImage: "url('/images/Rwanda_girls_in_STEM.jpg')" }}
          >
            <span className="tile-eyebrow">Huye</span>
            <span className="tile-title">Girls in STEM Scholarship Fund</span>
          </Link>
          <Link
            to="/register"
            className="hero-tile hero-tile--health"
            style={{ backgroundImage: "url('/images/Rwanda_community.jpg')" }}
          >
            <span className="tile-eyebrow">Musanze</span>
            <span className="tile-title">Community Health Outreach</span>
          </Link>
        </div>
      </section>

      <nav className="cause-tabs" aria-label="Explore causes">
        <span className="cause-tabs__label">Explore causes</span>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cause-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "-1.6rem 0 2.5rem" }}>
        Gabira connects generous donors with verified local charities across Rwanda. Create an
        account, track every pledge you make, and see the real difference your giving creates
        &mdash; all from one simple dashboard.
      </p>

      <section aria-labelledby="impact-heading">
        <h2 className="section-title" id="impact-heading">Our Impact So Far</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{formatRWF(stats.total)}</div>
            <div className="stat-label">Total Donated</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.donors}+</div>
            <div className="stat-label">Registered Donors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.charities}</div>
            <div className="stat-label">Partner Charities</div>
          </div>
        </div>
        <p className="hint">Figures are calculated live from our records each time this page loads.</p>
      </section>

      <section aria-labelledby="programs-heading">
        <h2 className="section-title" id="programs-heading">Ways You Can Give</h2>
        <div className="programs">
          <article>
            <h3>One-Time Donation</h3>
            <p>Support a cause you care about with a single pledge. Every gift is tracked in your donor dashboard.</p>
          </article>
          <article>
            <h3>Monthly Giving</h3>
            <p>Set up a recurring pledge and provide charities with the steady support they need to plan ahead.</p>
          </article>
          <article>
            <h3>Special Requests</h3>
            <p>Want your donation directed to a specific project? Leave a note with your pledge.</p>
          </article>
        </div>
      </section>
    </main>
  );
}