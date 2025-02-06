const sendEmailVerification = async (name, email, link) => {
  fetch(process.env.P_AUTOMATE_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Explicitly set content type
    },
    body: JSON.stringify({
      name: name,
      email: email,
      link: link,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Successfully sent email verification email. ");
      } else {
        console.log("Failed to send email verification email.  ");
      }

      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  sendEmailVerification,
};
