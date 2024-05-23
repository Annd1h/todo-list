import React, {useEffect, useState} from 'react' // Importon React dhe hook-et e tij
import { signOut,onAuthStateChanged } from 'firebase/auth' // Importojm funksionet e autentikimin firebase
import { auth , db} from '../Firebase.js' // Importon autentikimin dhe bazën e të dhënave nga Firebase
import {useNavigate} from "react-router-dom";// importojm  useNavigate hook per navigim
import { uid } from 'uid'; //  importojm uid per  gjenerimin e idve unike
import {set,ref, onValue ,remove ,update} from 'firebase/database' // Importon funksionet për menaxhimin e të dhënave nga Firebase
import './homepage.css' // Importon stilimet për faqen kryesore
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import moment from 'moment'; // Importon moment për të menaxhuar datën dhe kohën








export default function Homepage()
 {

  const [todo,setTodo]= useState(""); // useState për mbajtjen e TODO-së aktuale
  const [todos,setTodos] = useState([]) // useState për mbajtjen e listës së TODO-ve
  const [isEdit ,setIsEdit] = useState(false); // useState për menaxhimin e modalitetit të redaktimit
  const [tempUidd,setTempUidd]= useState(""); // useState për mbajtjen e ID-së së përkohshme të TODO-së që po redaktohet
  const navigate = useNavigate(); // hook per navigacion
  
  useEffect(()=>{
    // Merr todo items  nga baza e të dhënave Firebase kur komponenti montohet
    auth.onAuthStateChanged(user=>{
      if(user){
        onValue(ref(db,`/${auth.currentUser.uid}`), snapshot =>{
            setTodos([]);
            const data = snapshot.val();
            if(data !== null){
              Object.values(data).map (todo =>{
                  setTodos((oldArray) => [...oldArray,todo]);
              });
            }
        });
      } else if(!user)
      {
        navigate("/") // redirektohet tek login page nese user sosht i authentikum
      }
    });
  },[]);


  const handleSignOut = () =>{
    // funksioi i cili  i qkyq userat dhe  i redikton tek login page
    signOut(auth).then(()=>{navigate("/");}).catch(err =>
       {alert(err.message);
    
    });
  };

  // Perditsimi i todo items ne Firebase database
  const  handleUpdate =(todo) =>{
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd (todo.uidd)
  };
  const handleEditConfirm = () =>{
    // ekzekutimi i perditsimit  te todo items ne firebase database
    update(ref(db,`/${auth.currentUser.uid}/${tempUidd}`),{
       todo: todo,
       tempUidd:tempUidd
       

    });
    setTodo("");
    setIsEdit(false);
  };
  
  // Krijojm todo item ne firebase database
  const writeToDatabase = () => {
    const uidd = uid();
    const currentDateAndTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    set(ref(db,`/${auth.currentUser.uid}/${uidd}`),{
        todo: todo,
        uidd: uidd,
        date: currentDateAndTime
    });
    setTodo("");
  };
  //Fshijm todo item ne firbase database
  const handleDelete = (uid) =>{
       remove(ref(db,`${auth.currentUser.uid}/${uid}`));
  };


  return (
    <div className='homepage'>
      <input type='text'  className="add-edit-input"value={todo} onChange={(e) => setTodo(e.target.value)} placeholder='Add to do'/>
      {
        todos.map((todo) => (
          <div className="todo">
            <h1>{todo.todo}</h1>
            <p className='todo-date'>{todo.date}</p>
            <EditIcon fontSize="large" onClick={() => handleUpdate(todo)} className="edit-button" />
            <DeleteIcon fontSize="large" onClick={() => handleDelete(todo.uidd)} className="delete-button" />
          </div>
        ))}
      
      {isEdit ? (
        <div>
          <CheckIcon onClick={handleEditConfirm} className="add-confirm-icon"/>
        </div>
      ):(
        <div>
          <AddIcon onClick={writeToDatabase} className="add-confirm-icon"/>
        </div>
      )
      }
      <LogoutIcon onClick={handleSignOut} className='logout-icon'/>
    </div>
  );
}
