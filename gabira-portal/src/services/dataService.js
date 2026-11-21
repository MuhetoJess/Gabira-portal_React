const EXTRA_DONATIONS_KEY = "cgp_extra_donations";
const EXTRA_USERS_KEY = "cgp_extra_users";

export function formatRWF(amount) {
  return "RWF " + Number(amount || 0).toLocaleString();
}

// ----------------- USERS -----------------
export async function loadAllUsers() {
  const res = await fetch("/data/users.json");
  if (!res.ok) throw new Error("Failed to load users data");
  const base = await res.json();

  let extra = { donors: [], charities: [] };
  try {
    const raw = localStorage.getItem(EXTRA_USERS_KEY);
    if (raw) extra = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  return {
    donors: [...base.donors, ...extra.donors],
    charities: [...base.charities, ...extra.charities]
  };
}

export function saveExtraUser(role, user) {
  let extra = { donors: [], charities: [] };
  try {
    const raw = localStorage.getItem(EXTRA_USERS_KEY);
    if (raw) extra = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const list = role === "charity" ? extra.charities : extra.donors;
  list.push(user);
  localStorage.setItem(EXTRA_USERS_KEY, JSON.stringify(extra));
}

// ----------------- DONATIONS -----------------
export async function loadDonations() {
  const res = await fetch("/data/donations.json");
  if (!res.ok) throw new Error("Failed to load donations data");
  const base = await res.json();

  let extra = [];
  try {
    const raw = localStorage.getItem(EXTRA_DONATIONS_KEY);
    if (raw) extra = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [...base, ...extra];
}

export function saveExtraDonation(donation) {
  let list = [];
  try {
    const raw = localStorage.getItem(EXTRA_DONATIONS_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  list.push(donation);
  localStorage.setItem(EXTRA_DONATIONS_KEY, JSON.stringify(list));
}