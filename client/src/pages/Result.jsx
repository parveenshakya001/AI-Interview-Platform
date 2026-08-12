import { useParams } from 'react-router-dom';
const Result = () => {
  const { id } = useParams();
  return <div style={{ padding: 40 }}><h1>Result #{id}</h1></div>;
};
export default Result;