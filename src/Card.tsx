import { FC } from "react";
import { BookInformation } from "./lib/types";

const Card: FC<{ book: BookInformation }> = ({ book }) => {
  return (
    <div>
      <h3>{book.name}</h3>
      <p>
        <b>Автор</b>: {book.author.name}
      </p>
      <p>
        <b>Описание</b>: {book.description}
      </p>
      <p>
        <b>Отзывы: </b>
        {book.reviews.length > 0
          ? book.reviews.map((review) => `${review.text} (${review.user.name})`).join(", ")
          : "-"}
      </p>
    </div>
  );
};

export default Card;
