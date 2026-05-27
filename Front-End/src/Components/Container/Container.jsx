const Container = ({element, height}) => {
    return (
      <div  className={`shadow-darker-shadow bg-gray-800 overflow-y-auto pb-5 w-[92vw] my-[3vh] mr-[6vw] ml-[2vw] shadow-2xl border rounded-lg relative ${height}`}>
          {element}
      </div>
    );
}
export default Container
