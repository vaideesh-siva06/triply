function Validation(values) {
    let error = {}

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if(values.name === "") {
        error.name = "Name should not be empty.";
    } else if (values.name.length < 2) {
        error.name = "Name must be at least 2 characters long.";
    } else {
        error.name = "";
    }

    if(values.email === "") {
        error.email = "Email should not be empty.";
    } else if (!values.email.includes('@')) {
        error.email = "Email must contain '@'.";
    } else if (!values.email.includes('.')) {
        error.email = "Email must contain a domain (e.g., '.com').";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email format is invalid. Please enter a valid email address (e.g., user@example.com).";
    } else {
        error.email = "";
    }

    if(values.password === "") {
        error.password = "Password should not be empty.";
    } else if (values.password.length < 8) {
        error.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Za-z]/.test(values.password)) {
        error.password = "Password must contain at least one letter.";
    } else if (!/\d/.test(values.password)) {
        error.password = "Password must contain at least one number.";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least one letter and one number.";
    } else {
        error.password = "";
    }
    return error;
}

export default Validation;