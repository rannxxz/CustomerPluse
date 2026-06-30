import {
  fetchDashboard,
  fetchCustomers,
  fetchHighRiskCustomers,
  searchCustomers
} from "./api.js";

let currentPage = 1;
let currentRisk = "";

let dashboardData = null;

console.log("CustomerPulse Loaded");
lucide.createIcons();

// ==========================
// THEME INITIALIZATION
// ==========================

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute(
    "data-theme",
    "dark"
  );
}

// ==========================
// THEME TOGGLE
// ==========================

const themeToggle =
  document.getElementById(
    "theme-toggle"
  );

themeToggle?.addEventListener(
  "click",
  () => {
    const isDark =
      document.documentElement.getAttribute(
        "data-theme"
      ) === "dark";

    if (isDark) {
      document.documentElement.removeAttribute(
        "data-theme"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    lucide.createIcons();
  }
);

async function loadCustomerPage() {

  const customers =
    await fetchCustomers(
      currentPage,
      currentRisk
    );

  renderCustomerTable(customers);

  document.getElementById(
    "page-indicator"
  ).textContent =
    `Page ${currentPage}`;
}

document
  .getElementById("customer-search")
  .addEventListener(
    "input",
    async e => {

      const value =
        e.target.value.trim();

      if (!value) {
        loadCustomerPage();
        return;
      }

      const customers =
        await searchCustomers(
          value
        );

      renderCustomerTable(
        customers
      );
    }
  );

document
  .getElementById("risk-filter")
  .addEventListener(
    "change",
    async e => {

      currentRisk =
        e.target.value;

      currentPage = 1;

      loadCustomerPage();

    }
  );

document
  .getElementById("next-page")
  .addEventListener(
    "click",
    () => {

      currentPage++;

      loadCustomerPage();

    }
  );

document
  .getElementById("prev-page")
  .addEventListener(
    "click",
    () => {

      if (currentPage === 1)
        return;

      currentPage--;

      loadCustomerPage();

    }
  );

async function loadDashboard() {

  try {

    dashboardData = await fetchDashboard();
    const dashboard = dashboardData;

    console.log("KPIs")
    try {
      renderKPIs(dashboard.kpis);
      console.log("KPIs finished");
    }
    catch (e) {
      console.error("renderKPIs failed");
      console.error(e);
    }

    console.log("Risk Distribution")
    renderRiskDistribution(dashboard.summary);

    console.log("Feature Importance")
    renderFeatureImportance(dashboard.features);

    renderHealthDistribution(dashboard.healthScores);

    renderCustomerSegments(dashboard.segments);

    console.log("AI Insights")
    renderAIInsights(dashboard);

    await loadCustomerPage();

  }

  catch (err) {
    console.error("Dashboard Error:");
    console.error(err);
    console.error(err.stack);
  }

}

function getFilteredDashboard(days) {

  if (!dashboardData)
    return null;

  const filtered =
    structuredClone(
      dashboardData
    );

  if (days === "7") {

    filtered.healthScores =
      filtered.healthScores.slice(
        0,
        100
      );

  }

  else if (days === "30") {

    filtered.healthScores =
      filtered.healthScores.slice(
        0,
        500
      );

  }

  return filtered;

}

function rerenderDashboard(data) {

  renderHealthDistribution(
    data.healthScores
  );

  window.dispatchEvent(
    new Event("resize")
  );

}

function renderKPIs(kpis) {

  document.querySelector(
    "#kpi-total-customers .kpi-value"
  ).textContent =
    kpis.totalCustomers.toLocaleString();

  document.querySelector(
    "#kpi-high-risk .kpi-value"
  ).textContent =
    kpis.highRiskCustomers.toLocaleString();

  document.querySelector(
    "#kpi-retention .kpi-value"
  ).textContent =
    `$${kpis.revenueAtRisk.toLocaleString()}`;

  document.querySelector(
    "#kpi-health .kpi-value"
  ).textContent =
    `${kpis.averageHealthScore}%`;

}

function renderCustomerTable(
  customers
) {

  const tbody =
    document.getElementById(
      "customer-table-body"
    );

  tbody.innerHTML = "";

  customers.forEach(
    customer => {

      tbody.innerHTML += `
        <tr
          class="customer-row"
          data-customer='${JSON.stringify(customer)}'
        >
          <td>${customer.CustomerID}</td>
          <td>${customer.RiskSegment}</td>
          <td>${customer.RetentionPriority}</td>
          <td>${customer.LifecycleStage}</td>
          <td>${(
          customer.ChurnProbability *
          100
        ).toFixed(1)}%</td>
        </tr>
      `;
    }
  );

  attachRowEvents();
}

function attachRowEvents() {

  document
    .querySelectorAll(
      ".customer-row"
    )
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          const customer =
            JSON.parse(
              row.dataset.customer
            );

          document.getElementById(
            "modal-body"
          ).innerHTML = `
            <h2>${customer.CustomerID}</h2>

            <p>
              <strong>Risk:</strong>
              ${customer.RiskSegment}
            </p>

            <p>
              <strong>Priority:</strong>
              ${customer.RetentionPriority}
            </p>

            <p>
              <strong>Lifecycle:</strong>
              ${customer.LifecycleStage}
            </p>

            <p>
              <strong>Churn Probability:</strong>
              ${(
              customer.ChurnProbability *
              100
            ).toFixed(1)}%
            </p>
          `;

          document
            .getElementById(
              "customer-modal"
            )
            .classList.add(
              "active"
            );

        }
      );

    });

}

document
  .getElementById(
    "close-modal"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "customer-modal"
        )
        .classList.remove(
          "active"
        );

    }
  );

function renderCustomerSegments(segments) {
  if (
    !document.getElementById(
      "customer-segments-chart"
    )
  ) return;

  const chart = echarts.init(
    document.getElementById(
      "customer-segments-chart"
    )
  );

  chart.setOption({

    tooltip: {
      trigger: "item"
    },

    legend: {
      bottom: 0
    },

    series: [

      {

        type: "pie",

        radius: ["45%", "70%"],

        data: segments.map(segment => ({

          name: segment.LifecycleStage,

          value: segment.Customers

        }))

      }

    ]

  });

}

function renderAIInsights(dashboard) {

  try {

    console.log("Insights function running");

    const kpis = dashboard.kpis;

    const insights = [];

    insights.push(
      `${kpis.highRiskCustomers} customers are classified as High Risk and should be prioritized for retention.`
    );

    insights.push(
      `Estimated revenue at risk is $${Number(
        kpis.revenueAtRisk
      ).toLocaleString()}.`
    );

    insights.push(
      `Average customer health score is ${kpis.averageHealthScore}.`
    );

    console.log(dashboard.features);
    console.log(dashboard.models);

    if (
      dashboard.features &&
      dashboard.features.length >= 2
    ) {
      insights.push(
        `${dashboard.features[0].Feature} is the strongest churn predictor, followed by ${dashboard.features[1].Feature}.`
      );
    }

    if (
      dashboard.models &&
      dashboard.models.length
    ) {

      const bestModel =
        dashboard.models.reduce(
          (best, current) =>
            current.AUC > best.AUC
              ? current
              : best
        );

      insights.push(
        `${bestModel.Model} is currently the best-performing prediction model (AUC ${bestModel.AUC.toFixed(3)}).`
      );
    }

    const container =
      document.getElementById(
        "ai-insights"
      );

    console.log(container);

    container.innerHTML =
      insights
        .map(
          text => `<li>${text}</li>`
        )
        .join("");

  }

  catch (err) {

    console.error(
      "Insights Error:"
    );

    console.error(err);

  }

}

function renderHealthDistribution(scores) {
  if (
    !document.getElementById(
      "health-distribution-chart"
    )
  ) return;

  const bins = {
    "0-20": 0,
    "20-40": 0,
    "40-60": 0,
    "60-80": 0,
    "80-100": 0
  };

  scores.forEach(customer => {

    const score =
      customer.CustomerHealthScore;

    if (score < 20)
      bins["0-20"]++;

    else if (score < 40)
      bins["20-40"]++;

    else if (score < 60)
      bins["40-60"]++;

    else if (score < 80)
      bins["60-80"]++;

    else
      bins["80-100"]++;

  });

  const chart = echarts.init(
    document.getElementById(
      "health-distribution-chart"
    )
  );

  chart.setOption({

    tooltip: {
      trigger: "axis"
    },

    xAxis: {
      type: "category",
      data: Object.keys(bins)
    },

    yAxis: {
      type: "value"
    },

    series: [

      {

        type: "bar",

        data: Object.values(bins)

      }

    ]

  });

}

function renderFeatureImportance(features) {
  if (
    !document.getElementById(
      "feature-importance-chart"
    )
  ) return;

  const chart = echarts.init(
    document.getElementById(
      "feature-importance-chart"
    )
  );

  chart.setOption({

    tooltip: {
      trigger: "axis"
    },

    grid: {
      left: 140,
      right: 20,
      top: 20,
      bottom: 20
    },

    xAxis: {
      type: "value"
    },

    yAxis: {
      type: "category",
      data: features.map(f => f.Feature)
    },

    series: [

      {

        type: "bar",

        data: features.map(
          f => f.Importance
        )

      }

    ]

  });

}

function renderRiskDistribution(summary) {

  if (
    !document.getElementById(
      "risk-distribution-chart"
    )
  ) return;

  const chart =
    echarts.init(
      document.getElementById(
        "risk-distribution-chart"
      )
    );

  const data =
    summary.map(item => ({
      name: item.RiskSegment,
      value: item.Customers
    }));

  chart.setOption({

    tooltip: {
      trigger: "item"
    },

    legend: {
      bottom: 0
    },

    series: [

      {

        type: "pie",

        radius: ["45%", "70%"],

        data

      }

    ]

  });

}
document
  .getElementById("export-btn")
  .addEventListener(
    "click",
    async () => {

      const customers =
        await fetchCustomers(
          currentPage,
          currentRisk
        );

      const rows = customers.map(c =>
        [
          c.CustomerID,
          c.RiskSegment,
          c.RetentionPriority,
          c.LifecycleStage,
          c.ChurnProbability
        ].join(",")
      );

      const csv =
        [
          "CustomerID,Risk,Priority,Lifecycle,ChurnProbability",
          ...rows
        ].join("\n");

      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv"
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "customers.csv";

      a.click();

      URL.revokeObjectURL(
        url
      );

    }
  );

document
  .getElementById(
    "date-filter"
  )
  ?.addEventListener(
    "change",
    e => {

      const data =
        getFilteredDashboard(
          e.target.value
        );

      if (!data)
        return;

      rerenderDashboard(data);

    }
  );

const pages = {
  "overview-page":
    document.getElementById(
      "overview-page"
    ),

  "customers-page":
    document.getElementById(
      "customers-page"
    ),

  "analytics-page":
    document.getElementById(
      "analytics-page"
    ),

  "risk-page":
    document.getElementById(
      "risk-page"
    ),

  "reports-page":
    document.getElementById(
      "reports-page"
    )
};

document
  .querySelectorAll(".nav-item")
  .forEach(item => {

    item.addEventListener(
      "click",
      () => {

        const page =
          item.dataset.page;

        Object.values(
          pages
        ).forEach(p => {

          if (p)
            p.style.display =
              "none";

        });

        if (pages[page]) {

          pages[
            page
          ].style.display =
            "block";

        }

        document
          .querySelectorAll(
            ".nav-item"
          )
          .forEach(n =>
            n.classList.remove(
              "active"
            )
          );

        item.classList.add(
          "active"
        );

      }
    );

  });


loadDashboard();