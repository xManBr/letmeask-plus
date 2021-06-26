import { FormEvent, useState } from 'react';
//import illustrationImg from '../assents/images/illustration.svg';
import logoImg from '../assents/images/logo.svg';
import { Link, useHistory } from 'react-router-dom';

import "../styles/auth.scss";
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
  // const {user} = useAuth();

  const { user } = useAuth();
  const [newRoom, setNewRoon] = useState('');
  const history = useHistory();


  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }
    console.log(newRoom);
    const roomRef = database.ref('rooms');
    const firabaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firabaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      {/* <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas de audiência em tempo real</p>
      </aside>
       */}      
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" onClick={() => history.push('/')} />
          <h2> Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoon(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
            <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link> </p>
          </form>
        </div>
      </main>
    </div>
  )
}