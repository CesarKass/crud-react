import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const noti = withReactContent(Swal);


function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(18);
  const [cargo, setCargo] = useState("");
  const [id, setId] = useState("");
  const [editarUer, setEditUser] = useState(false);
  const [usersList, setUsers] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      cargo
    }).then((response) => {
      getUsers();
      limpiarCampos();
      noti.fire({
        title: <strong>{response.data.msg}</strong>,
        html: <i>{nombre}</i>,
        icon: 'success'
      })

    });
  };

  const EditUser = (val) => {
    setEditUser(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setId(val.id_user);
  };

  const DeleteUser = (val) => {
    noti.fire({
      title: '¿Eliminar?',
      text: "Desea eliminar " + val.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete("http://localhost:3001/delete/" + val.id_user).then((response) => {
          getUsers(); 
          noti.fire({
            position: 'center',
            icon: 'success',
            title: '¡Eliminado!<br>'+response.data.msg + ' <strong>' + val.nombre + '<strong>', 
            showConfirmButton: false,
            timer: 2000
          })
        }).catch(function(e){
          noti.fire({
            position: 'center',
            icon: 'error',
            title: "Oh :(",
            text: "Algo ocurrio, reintenta mas tarde",
            footer: JSON.parse(JSON.stringify(e)).message==="Network Error"? "Intente más tarte": "Error",
            showConfirmButton: false,
            timer: 2000
          })
        });

      }
    })

  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre,
      edad,
      cargo,
    }).then((response) => {
      getUsers();
      limpiarCampos();
      noti.fire({
        title: <strong>{response.data.msg}</strong>,
        html: <i>{nombre}</i>,
        icon: 'success'
      })
    });
  };

  const getUsers = () => {
    Axios.get("http://localhost:3001/users").then((response) => {
      setUsers(response.data);
    });
  };

  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setCargo("");
    setEditUser(false);
  };

  useEffect(() => {
    getUsers(); // Llamar a la función solo cuando el componente se monta
  }, []);


  return (
    <div className="container">
      <div className="App">

        <div className="row p-2">
          <h3 className='text-center'>CRUD Usuarios</h3>
          <h6 className='text-center fw-lighter text-muted'>con ReactJS</h6>
          <hr />
          <div className="col-md-5">
            <div className="card text-center">
              <div className="card-header">
                Agrega nuevo usuario
              </div>
              <div className="card-body">
                <div className="form">

                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Nombre</span>
                    <input type="text" value={nombre} className="form-control" placeholder="Ingrese nombre" aria-label="Ingrese nombre" aria-describedby="basic-addon1"
                      onChange={(event) => { setNombre(event.target.value) }}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Edad</span>
                    <input type="number" value={edad} className="form-control" min={18} placeholder="Ingrese edad" aria-label="Ingrese edad" aria-describedby="basic-addon1"
                      onChange={(event) => { setEdad(event.target.value) }}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Cargo</span>
                    <input type="text" value={cargo} className="form-control" placeholder="Ingrese cargo" aria-label="Ingrese cargo" aria-describedby="basic-addon1"
                      onChange={(event) => { setCargo(event.target.value) }}
                    />
                  </div>

                  <hr />
                  {
                    editarUer ?
                      <div>
                        <button className='btn btn-warning' onClick={update}>Actualizar</button>
                        &nbsp;
                        <button className='btn btn-danger' onClick={add}>Cancelar</button>
                      </div>
                      :
                      <button className='btn btn-success' onClick={add}>Guardar</button>

                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className='lista'>
              <div className="container mt-2">
                <table className="table table-striped table-hover table-sm">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Edad</th>
                      <th scope="col">Cargo</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      usersList.map((val, key) => {
                        return <tr key={key + 1}>
                          <th scope="row">{key + 1}</th>
                          <td>{val.nombre}</td>
                          <td>{val.edad}</td>
                          <td>{val.cargo}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button type="button" onClick={() => { EditUser(val) }} className="btn btn-primary">Editar</button>
                              <button type="button" onClick={() => { DeleteUser(val) }} className="btn btn-danger">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      })
                    }

                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

  );
}
export default App;
