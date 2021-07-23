import { useHistory } from 'react-router-dom';
import homePageImg from '../assets/images/homepage.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import{database} from '../services/firebase'

import { Button } from '../componentes/Button';
import { useAuth } from '../hooks/useAuth'


import'../styles/auth.scss';
import { FormEvent, useState } from 'react';

export function Home(){
    const history =useHistory();
    const { user, sigInWithGoogle} = useAuth()
    const[roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if (!user) {
        await sigInWithGoogle()
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
        alert('Room does not exists');
        return;
    }

    if (roomRef.val().endedAt){
        alert('Room already closed');
    }
    
    history.push(`/rooms/${roomCode}`);
}

    return(
        <div id="page-auth">
            <aside>
                <img src={homePageImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Toda Pergunta tem uma resposta</strong>
                <p> Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content" >
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src = {googleIconImg} alt="Logo do Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                        type = "text" 
                        placeholder = "Digite o código da sala"
                        onChange={event => setRoomCode(event.target.value)}
                        value={roomCode}
                        />
                        <Button type ="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}