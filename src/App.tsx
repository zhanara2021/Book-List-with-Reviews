import "./styles.css";
import { Book, BookInformation, User, ReviewInformation, Review } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

const toBookInformation = (
  book: Book,
  author: User,
  reviews: ReviewInformation[]
): BookInformation => {
  return {
    id: book.id,
    name: book.name || "Книга без названия",
    author,
    reviews,
    description: book.description || "Описание отсутствует",
  };
};

const toReviewInformation = (review: Review, user: User): ReviewInformation => {
  return {
    ...review,
    user, 
  };
};

const App: FC = () => {
  const [books, setBooks] = useState<BookInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [fetchedBooks, fetchedUsers, fetchedReviews] = await Promise.all([
          getBooks(),
          getUsers(),
          getReviews()
        ]);

        const userMap = new Map(fetchedUsers.map(user => [user.id, user]));
        const reviewMap = new Map(fetchedReviews.map(review => [review.id, review]));

        const booksWithDetails = fetchedBooks.map(book => {
          const bookReviews = book.reviewIds.map(reviewId => {
            const review = reviewMap.get(reviewId);
            const user = review && userMap.get(review.userId);
            return review && user ? toReviewInformation(review, user) : null;
          }).filter((r): r is ReviewInformation => r !== null);

          const author = userMap.get(book.authorId) || { id: '', name: 'Unknown' };

          return toBookInformation(book, author, bookReviews);
        });

        setBooks(booksWithDetails);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {error && <div>{error}</div>}
      {!isLoading && !error && books.map((book) => (
        <Card key={book.id} book={book} />
      ))}
    </div>
  );
};

export default App;
