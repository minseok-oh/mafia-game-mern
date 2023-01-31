import "../style/Modal.css";

function Modal(props) {
  const subject = () => {
    if (props.mafia) {
      return "당신은 마피아입니다.";
    } else {
      return "당신은 시민입니다.";
    }
  };

  return (
    <div className="container">
      <p>{subject()}</p>
    </div>
  );
}
export default Modal;
