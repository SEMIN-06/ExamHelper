import { Link } from 'react-router-dom';
import { collection, query, orderBy } from 'firebase/firestore';
import { fireStore } from '../Firebase';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import LoadingSpinner from 'renderer/components/LoadingSpinner';

// UI 꾸미기
const Home = () => {
  const q = query(collection(fireStore, "projects"), orderBy("editAt"));
  const [value, loading, error] = useCollectionOnce(q);

  return (
    <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        <LoadingSpinner visible={loading}/>

        {value && (
          <div>
            {value.docs.map((doc) => (
              <Link to={`/project/${doc.id}`} key={doc.id}>
                <button>
                  {doc.data().title}
                </button>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
};

export default Home;
