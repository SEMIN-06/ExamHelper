import { Link } from 'react-router-dom';
import { collection, query, orderBy } from 'firebase/firestore';
import { fireStore } from '../components/Firebase';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import { ThreeDots } from  'react-loader-spinner'

const Home = () => {
  const q = query(collection(fireStore, "projects"), orderBy("editAt"));
  const [value, loading, error] = useCollectionOnce(q);

  return (
    <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        <ThreeDots
          height="60"
          width="60"
          radius="9"
          color="#ffffff"
          ariaLabel="Loading DB..."
          wrapperStyle={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%"
          }}
          visible={loading}
        />
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
