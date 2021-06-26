import copyImg from '../assents/images/copy.svg'

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string
}
export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipborad() {
    navigator.clipboard.writeText(props.code)

  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipborad}>
      <div>
        <img src={copyImg} alt='Copiar o código da sala.' />
      </div>
      <span>Sala {props.code} </span>
    </button>
  )
    }