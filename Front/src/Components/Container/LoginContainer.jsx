const LoginContainer = ({element, height}) => {
    return (
      <div  className={`shadow-darker-shadow m-auto bg-DarkBlue overflow-y-auto w-[25vw] min-w-96 h-[90vh] rounded-lg relative ${height}`}>
          {element}
      </div>
    );
}
export default LoginContainer
