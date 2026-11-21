import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadDonations, loadAllUsers, saveExtraDonation, formatRWF } from "../services/dataService";

export default function DonorDashboard() {
  const { session } = useAuth();
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [form, setForm] = useState({ charityId: "", amount: "", frequency: "once", note: "" });
  const [msg, setMsg] = useState("");

  const refreshDonations = async () => {
    const all = await loadDonations();
    const my = all.filter((d) => d.donorId === session.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    setDonations(my);
  };

  useEffect(() => {
    refreshDonations();
    loadAllUsers().then((data) => setCharities(data.charities));
  }, [session.id]);

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const charitiesSupported = new Set(donations.map((d) => d.charityId)).size;

  const handlePledge = (e) => {
    e.preventDefault();
    const selectedCharity = charities.find((c) => c.id === form.charityId);
    const newDonation = {
      id: "extra-" + Date.now(),
      donorId: session.id,
      donorName: session.name,
      charityId: form.charityId,
      charityName: selectedCharity ? selectedCharity.name : "Unknown",
      amount: Number(form.amount),
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
      note: form.note
        ? form.note + (form.frequency === "monthly" ? " (monthly pledge)" : "")
        : form.frequency === "monthly" ? "Monthly pledge" : ""
    };

    saveExtraDonation(newDonation);
    refreshDonations();
    setMsg(`Thank you! Your pledge of ${formatRWF(form.amount)} has been recorded.`);
    setForm({ charityId: "", amount: "", frequency: "once", note: "" });
  };

  return (
    <main>
      <div className="dash-header">
        <div>
          <h2>Welcome back, <span>{session?.name}</span></h2>
          <p>Here's a summary of your giving on Gabira.</p>
        </div>
      </div>

      <section className="stats-grid" aria-label="Donor summary">
        <div className="stat-card">
          <div className="stat-value">{formatRWF(total)}</div>
          <div className="stat-label">Total Donated</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{donations.length}</div>
          <div className="stat-label">Donations Made</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{charitiesSupported}</div>
          <div className="stat-label">Charities Supported</div>
        </div>
      </section>

      <div className="dash-grid">
        <div>
          <h2 className="section-title">Your Donation History</h2>
          <div className="table-wrap">
            {donations.length === 0 ? (
              <p className="empty-state">You haven't made any donations yet &mdash; make your first pledge!</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Charity</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody id="donorDonationsBody">
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.date}</td>
                      <td>{d.charityName}</td>
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
          <h2 className="section-title">Make a New Pledge</h2>
          <form className="app-form" onSubmit={handlePledge}>
            <div className="form-row">
              <label>Charity</label>
              <select
                required
                value={form.charityId}
                onChange={(e) => setForm({ ...form, charityId: e.target.value })}
              >
                <option value="" disabled>Select a charity</option>
                {charities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Amount (RWF)</label>
              <input
                type="number"
                required
                min={1000}
                max={10000000}
                step={500}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Frequency</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="frequency"
                    value="once"
                    checked={form.frequency === "once"}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  /> One-time
                </label>
                <label>
                  <input
                    type="radio"
                    name="frequency"
                    value="monthly"
                    checked={form.frequency === "monthly"}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  /> Monthly
                </label>
              </div>
            </div>

            <div className="form-row">
              <label>Note (optional)</label>
              <textarea
                rows={3}
                maxLength={200}
                placeholder="e.g. For school supplies"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">Submit Pledge</button>
            {msg && <div className="form-msg show success">{msg}</div>}
          </form>
        </div>
      </div>
    </main>
  );
}