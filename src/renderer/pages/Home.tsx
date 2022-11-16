import { Link } from 'react-router-dom';
import { collection, setDoc, doc } from 'firebase/firestore';
import { fireStore } from '../components/Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

const Home = () => {
  const [value, loading, error] = useCollection(
    collection(fireStore, "test"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const addButton = async () => {
    await setDoc(doc(fireStore, "test", "4"), {
      content: Math.random()
    });
  };

  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{' '}
            {value.docs.map((doc) => (
              <h1 key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
              </h1>
            ))}
          </span>
        )}
      </p>
      <button onClick={addButton}>테스트 버튼</button>
    </div>
  );
};

export default Home;
