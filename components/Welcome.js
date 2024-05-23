import React, { useState, useEffect } from 'react'; // Importojmë React dhe hooks nga React
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'; // Importojmë funksionet për autentifikim nga Firebase
import { auth } from '../Firebase'; // Importojmë objektin auth nga skedari ynë Firebase
import { useNavigate } from 'react-router-dom'; // Importojmë hook-un useNavigate nga react-router-dom për të naviguar mes faqeve
import './welcome.css'; // Importojmë skedarin CSS për stilimin
import TodoSVG from '../assets/todo-svg.svg'; // Importojmë një imazh SVG

export default function Welcome() {
  const [email, setEmail] = useState(""); // Deklarojmë variablin email dhe funksionin për të vendosur emailin
  const [password, setPassword] = useState(""); // Deklarojmë variablin password dhe funksionin për të vendosur passwordin
  const [isRegistering, setIsRegistering] = useState(""); // Deklarojmë variablin që tregon nëse përdoruesi po regjistrohet
  const navigate = useNavigate(); // Deklarojmë funksionin navigate për të naviguar
  const [registerInformation, setRegisterInformation] = useState({ // Deklarojmë variablin për informacionet e regjistrimit dhe funksionin për të vendosur ato
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => { // Përdorim useEffect për të ekzekutuar kod kur komponenti montohet
    auth.onAuthStateChanged((user) => { // Vendosim një listener për ndryshimet në gjendjen e autentifikimit
      if (user) { // Nëse ka një përdorues të loguar
        navigate("/homepage"); // Navigojmë te faqja homepage
      }
    });
  }, []); // Efekti ekzekutohet vetëm një herë pasi [] është bosh

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Vendosim emailin nga inputi
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Vendosim passwordin nga inputi
  }
  
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => { // Thërrasim funksionin për të loguar përdoruesin
      navigate("/homepage"); // Nëse suksesshëm, navigojmë te faqja homepage
    }).catch((err) => alert(err.message)); // Nëse ka gabim, shfaqim një alert me mesazhin e gabimit
  }

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) { // Kontrollojmë nëse email-et përputhen
      alert("Ju lutem konfirmoni që email-et janë të njëjta");
      return;
    } else if (registerInformation.password !== registerInformation.confirmPassword) { // Kontrollojmë nëse password-et përputhen
      alert("Ju lutem konfirmoni që fjalëkalimet janë të njëjta");
      return;
    }
    createUserWithEmailAndPassword(auth, registerInformation.email, registerInformation.password).then(() => { // Thërrasim funksionin për të krijuar një përdorues të ri
      navigate("/homepage"); // Nëse suksesshëm, navigojmë te faqja homepage
    }).catch((err) => alert(err.message)); // Nëse ka gabim, shfaqim një alert me mesazhin e gabimit
  };

  return (
    <div className='welcome'>
      <img src={TodoSVG} className='todo-svg' /> {/* Shfaqim imazhin SVG */}
      <h1>To do list</h1>
      <div className='login-register-container'>
        {isRegistering ? ( // Nëse përdoruesi po regjistrohet
          <>
            <input type='email' placeholder='Email' value={registerInformation.email} onChange={(e) => setRegisterInformation({ ...registerInformation, email: e.target.value })} />
            <input type='email' placeholder='Confirm Email' value={registerInformation.confirmEmail} onChange={(e) => setRegisterInformation({ ...registerInformation, confirmEmail: e.target.value })} />
            <input type='password' placeholder='Password' value={registerInformation.password} onChange={(e) => setRegisterInformation({ ...registerInformation, password: e.target.value })} />
            <input type='Password' placeholder='Confirm Password' value={registerInformation.confirmPassword} onChange={(e) => setRegisterInformation({ ...registerInformation, confirmPassword: e.target.value })} />
            <button className='sign-in-register-button' onClick={handleRegister}>Register</button>
            <button onClick={() => setIsRegistering(false)}>Go Back</button>
          </>
        ) : ( // Nëse përdoruesi po logon
          <>
            <input type='email' placeholder='Email' onChange={handleEmailChange} value={email} />
            <input type='password' placeholder='Password' onChange={handlePasswordChange} value={password} />
            <button className='sign-in-button' onClick={handleSignIn}>Sign in</button>
            <button className="create-account-button" onClick={() => setIsRegistering(true)}>Create an account</button>
          </>
        )}
      </div>
    </div>
  );
}