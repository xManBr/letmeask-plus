import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assents/images/logo.svg';
import checkImg from '../assents/images/check.svg';
import answerImg from '../assents/images/answer.svg';
import deleteImg from '../assents/images/delete.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question/Index';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useState } from 'react';

type RoomParms = {
  id: string;
}
export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParms>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const [goldenWords, setGoldenWords] = useState('');

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    if (window.confirm('Tem certeza de que deseja definir como pergunta - RESPONDIDA?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      })
    }
  }

  async function handleHighLightQuestion(questionId: string) {
    if (window.confirm('Tem certeza de que deseja DESTACAR esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighLighted: true,
      })
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza de que deseja APAGAR esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  function hasGoldenWord(content: string): boolean {
    const questionUp = content.toUpperCase();
    const goldenWordsArray = goldenWords.split(' ');
    const hasGoldenWord = goldenWordsArray.find(goldenWord => questionUp.includes(goldenWord.toUpperCase())) || '';

    return hasGoldenWord !== '';
  }
  return (
    <div id='page-room'>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={() => history.push('/')} />
          <div>
            <RoomCode code={roomId} />
          </div>
          <div>
            <Button isOutlined onClick={handleEndRoom} > Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span> {questions.length} perguntas</span>
          }
        </div>

        {(questions.length > 0) && (
          <div className="room-golden-word">
            <form>
              <input
                type="text"
                placeholder="Procure perguntas por palavra(s) de ouro."
                onChange={event => setGoldenWords(event.target.value)}
                value={goldenWords}
              ></input>
            </form>
          </div>
        )
        }

        <div className="question-list">
          {questions.map(question => {
            if ((goldenWords.trim() === '')
              || hasGoldenWord(question.content)) {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLighted={question.isHighLighted}
                >
                  {!question.isAnswered
                    && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Set question is Answered." />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHighLightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Set question to Top" />
                        </button>
                      </>
                    )
                  }

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Delete question" />
                  </button>
                </Question>

              );
            }
            else {
              return (
                <div></div>
              );
            }
          })}
        </div>

      </main>
    </div >
  );
}