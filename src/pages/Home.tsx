//import illustrationImg from '../assents/images/illustration.svg';
import logoImg from '../assents/images/logo.svg';
import googleIconImg from '../assents/images/google-icon.svg';

import "../styles/auth.scss";
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const { user, singInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await singInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const salaCodeRef = `rooms/${roomCode}`;
    const roomRef = await database.ref(salaCodeRef).get();

    if (!roomRef.exists()) {
      alert('Sala não existe.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Sala já existe.');
      return;
    }

    if (roomRef.val().authorId !== user?.id) {
      history.push(salaCodeRef);
    }
    else {
      history.push(`/adminrooms/${roomCode}`);
    }
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
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom} >
            <img src={googleIconImg} alt="Logo do Google" />
            Cria sua sala com o goole
          </button>
          <div className="separator" >Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entar na sala
            </Button>
          </form>
            <strong>Crie salas de Q&amp;A ao-vivo</strong>
            <p>Tire suas dúvidas de audiência em tempo real</p>
         </div>
      </main>
    </div>
  )
}