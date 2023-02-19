import { useState, useEffect } from 'react';
import Axios from "axios"
import './App.css';

function App() {

  const [password,setPassword] = useState("")
  const [title,setTitle] = useState("")
  const [passwordList,setPasswordList] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data)
    })
  },[])

  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      title: title,
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
                id: val.id,
                password: val.password,
                title: response.data,
                iv: val.iv,
              }
            : val
        })
      )

      console.log(response.data)
    })
  }

  return (
    <div className="App">
      <div className="adding-password">
        <input 
          type="text" 
          placeholder='Ex. password123' 
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <input 
          type="text" 
          placeholder='Ex. Facebook' 
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <button onClick={addPassword}> Add Password</button>
      </div>

      <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h3>{val.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
