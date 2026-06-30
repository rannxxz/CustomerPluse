const API_BASE =
  "http://127.0.0.1:8000/api";

async function fetchDashboard() {
  const response = await fetch(
    `${API_BASE}/dashboard`
  );

  return await response.json();
}

async function fetchCustomers(
  page = 1,
  risk = ""
) {
  const limit = 50;
  const skip = (page - 1) * limit;

  let url =
    `${API_BASE}/customers?skip=${skip}&limit=${limit}`;

  if (risk) {
    url += `&risk=${encodeURIComponent(risk)}`;
  }

  const response =
    await fetch(url);

  return await response.json();
}

async function fetchHighRiskCustomers() {
  const response = await fetch(
    `${API_BASE}/customers/high-risk`
  );

  return await response.json();
}

async function searchCustomers(query) {

  const response =
    await fetch(
      `${API_BASE}/search?customer_id=${query}`
    );

  return await response.json();
}

export {
  fetchDashboard,
  fetchCustomers,
  fetchHighRiskCustomers,
  searchCustomers
};