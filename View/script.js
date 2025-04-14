async function signup(event) {
    event.preventDefault();
  
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const birthdate = document.getElementById("birthdate").value;
    const businessName = document.getElementById("businessName").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    const userData = {
      firstName,
      lastName,
      email,
      birthdate,
      businessName,
      password,
    };
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("User signed up successfully!");
        window.location.href = "/signin.html";
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while signing up. Please try again.");
      console.error(error);
    }
  }
  