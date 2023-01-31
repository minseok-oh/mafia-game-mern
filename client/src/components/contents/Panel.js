import "../style/Panel.css";

const Panel = (props) => {
  const userList = props.list.map((user) => <p className="userName">{user}</p>);
  return <div className="panel">{userList}</div>;
};

export default Panel;
