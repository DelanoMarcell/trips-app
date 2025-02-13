const sendEmailVerification = async (name, email, link, code, type) => {
  fetch(process.env.P_AUTOMATE_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Explicitly set content type
    },
    body: JSON.stringify({
      name: name,
      email: email,
      link: link,
      code: code,
      type: type, //'reset-request / email-verification'
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Successfully sent email ");
      } else {
        console.log("Failed to send email ");
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
