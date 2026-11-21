import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadDonations, formatRWF } from "../services/dataService";

export default function CharityDashboard() {
  const { session } = useAuth();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    loadDonations().then((all) => {
      const received = all
        .filter((d) => d.charityId === session.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(received);
    });
  }, [session.id]);

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const donorCount = new Set(donations.map((d) => d.donorId)).size;
  const pendingCount = donations.filter((d) => d.status.toLowerCase() === "pending").length;

  const byDonor = {};
  donations.forEach((d) => {
    if (!byDonor[d.donorId]) byDonor[d.donorId] = { name: d.donorName, total: 0, count: 0 };
    byDonor[d.donorId].total += Number(d.amount);
    byDonor[d.donorId].count += 1;
  });
  const topDonors = Object.values(byDonor).sort((a, b) => b.total - a.total);

  return (
    <main>
      <div className="dash-header">
        <div>
          <h2>Welcome back, <span>{session?.name}</span></h2>
          <p>Here's a summary of donations received through Gabira.</p>
        </div>
      </div>

      <section className="stats-grid" aria-label="Charity summary">
        <div className="stat-card">
          <div className="stat-value">{formatRWF(total)}</div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{donorCount}</div>
          <div className="stat-label">Unique Donors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending Pledges</div>
        </div>
      </section>

      <div className="dash-grid">
        <div>
          <h2 className="section-title">Donations Received</h2>
          <div className="table-wrap">
            {donations.length === 0 ? (
              <p className="empty-state">No donations recorded yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody id="charityDonationsBody">
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.date}</td>
                      <td>{d.donorName}</td>
                      <td>{formatRWF(d.amount)}</td>
                      <td>
                        <span className={`badge ${d.status.toLowerCase() === "completed" ? "completed" : "pending"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td>{d.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <h2 className="section-title">Top Donors</h2>
          <div className="table-wrap">
            <ul id="charityDonorList" style={{ padding: "1.2rem 1.4rem" }}>
              {topDonors.length === 0 ? (
                <li className="empty-state">No donors yet.</li>
              ) : (
                topDonors.map((d, index) => (
                  <li key={index}>
                    <strong>{d.name}</strong> &mdash; {formatRWF(d.total)} across {d.count} gift{d.count > 1 ? "s" : ""}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}