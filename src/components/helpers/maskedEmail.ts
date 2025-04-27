const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername = username[0] + "*********"; // Mask username
    const maskedDomain = domain.slice(0, 1) + "****" + domain.slice(-3); // Mask domain
    return `${maskedUsername}@${maskedDomain}`;
  };

  export default maskEmail;