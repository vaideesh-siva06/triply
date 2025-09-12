import React, { createContext, useState } from 'react'
import Validation from '../components/Validation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SubmitContext = createContext();

function SubmitProvider({ children, setIsAuthenticated }) {

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrors({});
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values); 
    setErrors(validationErrors); 

    if (event.currentTarget.id === "signup") {
      if (validationErrors.name === "" && validationErrors.email === "" && validationErrors.password === "") {
        // Use local backend URL
        axios.post('http://localhost:5001/signup', values, { withCredentials: true })
          .then((res) => {
            setSuccess(true);
          })
          .catch((err) => {
            if (err.response && err.response.data.field === "email") {
              setErrors((prev) => ({
                ...prev,
                email: err.response.data.message
              }));
            } else {
              console.log(err);
            }
          })
      }
    } else if (event.currentTarget.id === "login") {
      axios.defaults.withCredentials = true;
      setErrors({});
      if (values.email !== "" && values.password !== "") {
        // Use local backend URL
        axios.post('http://localhost:5001/login', values, { withCredentials: true })
          .then((res) => {
            if (res.data.message === "Success!") {
              setIsAuthenticated(true);
              setSuccess(true);
            } else {
              setErrors({ password: 'Email or password is incorrect' });
            }
          })
          .catch(() => {
            setErrors({ password: 'Email or password is incorrect' });
          })
      } else {
        setErrors({ password: 'Email or password is incorrect' });
      }
    }
  }

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <SubmitContext.Provider value={{ handleSubmit, values, setValues, handleInput, errors, success, setSuccess, setErrors }}>
      {children}
    </SubmitContext.Provider>
  )
}

export default SubmitProvider
