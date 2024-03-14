document.addEventListener("DOMContentLoaded", function () {
  let totalCost = 0;
  let details = [];

  // Event listener for booking options
  document.querySelectorAll(".booking-option").forEach((item) => {
    item.addEventListener("click", function () {
      resetSelection(".booking-option");
      this.classList.add("selected");
      calculateTotal();
    });
  });

  // Event listener for financial statements options
  document.querySelectorAll(".financial-option").forEach((item) => {
    item.addEventListener("click", function () {
      resetSelection(".financial-option");
      this.classList.add("selected");
      calculateTotal();
    });
  });

  // Show VAT type question based on VAT option selection
  document.querySelectorAll(".VAT-option").forEach((item) => {
    item.addEventListener("click", function () {
      resetSelection(".VAT-option");
      this.classList.add("selected");
      document.getElementById("vatTypeQuestion").style.display =
        this.getAttribute("data-value") === "Yes" ? "block" : "none";
      resetSelection(".vat2-option");
      calculateTotal();
    });
  });

  // Event listener for VAT type options
  document.querySelectorAll(".vat2-option").forEach((item) => {
    item.addEventListener("click", function () {
      resetSelection(".vat2-option");
      this.classList.add("selected");
      calculateTotal();
    });
  });

  // Event listener for tax return options
  document.querySelectorAll(".taxreturn").forEach((item) => {
    item.addEventListener("click", function () {
      resetSelection(".taxreturn");
      this.classList.add("selected");
      calculateTotal();
    });
  });

  // Event listener for add-on options
  document.querySelectorAll(".add-option").forEach((item) => {
    item.addEventListener("click", function () {
      if (this.getAttribute("data-value") === "Payroll accounting") {
        const payrollInputContainer = document.getElementById(
          "payrollInputContainer"
        );
        payrollInputContainer.style.display = "block";
        document.getElementById("numEmployees").focus();
      }
      this.classList.toggle("selected");
      calculateTotal();
    });
  });

  // Separate event listener for the payroll input to update total cost immediately
  document
    .getElementById("numEmployees")
    .addEventListener("input", function () {
      calculateTotal(); // Call calculateTotal directly to update the cost based on input
    });

  function calculateTotal() {
    totalCost = 0;
    details = [];

    // Calculate booking cost
    let selectedBooking = document.querySelector(".booking-option.selected");
    if (selectedBooking) {
      totalCost += parseFloat(selectedBooking.getAttribute("data-value"));
      details.push(
        `${selectedBooking.getAttribute("data-value")} CHF for bookings`
      );
    }

    // Calculate financial statement cost
    let financialStatementSelected = document.querySelector(
      ".financial-option.selected"
    );
    if (
      financialStatementSelected &&
      financialStatementSelected.getAttribute("data-value") === "Yes" &&
      selectedBooking
    ) {
      const financialStatementCosts = {
        "99.00": 124.1,
        "199.00": 140.8,
        "299.00": 157.5,
        "399.00": 165.8,
        "599.00": 182.5,
        "899.00": 0,
      };
      let additionalCost =
        financialStatementCosts[selectedBooking.getAttribute("data-value")] ||
        0;
      totalCost += additionalCost;
      if (additionalCost > 0) {
        details.push(`${additionalCost} CHF for financial statements`);
      }
    }

    // Calculate VAT cost
    let vatSelected = document.querySelector(".VAT-option.selected");
    if (vatSelected && vatSelected.getAttribute("data-value") === "Yes") {
      let selectedVatType = document.querySelector(".vat2-option.selected");
      if (selectedVatType) {
        const vatCosts = {
          Quartal: 74.1,
          SSS: 40.8,
        };
        let vatCost = vatCosts[selectedVatType.getAttribute("data-value")] || 0;
        totalCost += vatCost;
        details.push(`${vatCost} CHF for VAT declarations`);
      }
    }

    // Calculate tax return cost
    let taxReturnSelected = document.querySelector(".taxreturn.selected");
    if (taxReturnSelected) {
      if (
        taxReturnSelected.getAttribute("data-value") ===
        "Corporate or sole proprietorship"
      ) {
        totalCost += 29;
        details.push(`29 CHF for Corporate Tax Return`);
      } else {
        details.push(`Personal Tax Return price to be defined after a call`);
      }
    }

    // Handle digital mailbox add-on first
    const digitalMailboxSelected = document.querySelector(
      ".add-option[data-value='Digital-mailbox']"
    );
    if (
      digitalMailboxSelected &&
      digitalMailboxSelected.classList.contains("selected")
    ) {
      totalCost += 49; // Assuming cost for digital mailbox
      details.push("49 CHF for Digital Mailbox");
    }

    // Now handle payroll accounting, ensuring it comes after Digital Mailbox and before Onboarding
    const payrollSelected = document
      .querySelector(".add-option[data-value='Payroll accounting']")
      .classList.contains("selected");
    if (payrollSelected) {
      const numEmployees =
        parseInt(document.getElementById("numEmployees").value) || 0;
      const pricePerEmployee = 39;
      totalCost += numEmployees * pricePerEmployee;
      details.push(
        `${
          numEmployees * pricePerEmployee
        } CHF for payroll accounting (${numEmployees} employees)`
      );
    }

    // Handle onboarding add-on last
    const onboardingSelected = document.querySelector(
      ".add-option[data-value='Onboarding']"
    );
    if (
      onboardingSelected &&
      onboardingSelected.classList.contains("selected")
    ) {
      totalCost += 199; // Assuming cost for onboarding
      details.push("Onboarding fee (just first month) CHF 199.00");
    }

    // Display the calculated total cost
    document.getElementById(
      "totalCost"
    ).innerHTML = `Your approximate monthly fee for the services you asked is <strong>${totalCost.toFixed(
      2
    )}</strong> CHF. This includes: ${details.join(", ")}.`;
  }

  function resetSelection(selector) {
    document
      .querySelectorAll(selector)
      .forEach((item) => item.classList.remove("selected"));
  }
});
