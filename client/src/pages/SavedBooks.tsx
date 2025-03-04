import { useQuery, useMutation } from '@apollo/client'; // Import Apollo hooks
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

//import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../graphql/queries'; // Import GET_ME query
import { REMOVE_BOOK } from '../graphql/mutations'; // Import REMOVE_BOOK mutation

const SavedBooks = () => {
  // Fetch user data using useQuery
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || { savedBooks: [] };

  // Mutation for removing a book
  const [removeBookMutation] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.writeQuery({
        query: GET_ME,
        data: { me: removeBook },
      });
    },
  });

  // Delete book function using GraphQL mutation
  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBookMutation({
        variables: { bookId },
      });

      // Remove book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username ? `${userData.username}'s` : 'your'} saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: { bookId: string; image?: string; title: string; authors: string[]; description: string }) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={`Cover of ${book.title}`} variant="top" />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
